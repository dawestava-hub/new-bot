/**
 * SHINIGAMI MD - Group Scheduler
 * Handles scheduled open/close of groups
 * Persists to JSON file so it survives bot restarts
 */

const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');

const SCHEDULER_FILE = path.join(__dirname, '../database/scheduler.json');
const CHECK_INTERVAL = 30 * 1000; // check every 30 seconds

let schedulerInterval = null;
let connRef = null;

// ─── Load / Save ──────────────────────────────────────────────────────────────

function loadSchedules() {
    try {
        fs.ensureDirSync(path.dirname(SCHEDULER_FILE));
        if (!fs.existsSync(SCHEDULER_FILE)) return {};
        return JSON.parse(fs.readFileSync(SCHEDULER_FILE, 'utf8'));
    } catch (e) {
        console.error('Scheduler load error:', e.message);
        return {};
    }
}

function saveSchedules(data) {
    try {
        fs.ensureDirSync(path.dirname(SCHEDULER_FILE));
        fs.writeFileSync(SCHEDULER_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Scheduler save error:', e.message);
    }
}

// ─── Add a schedule ───────────────────────────────────────────────────────────
// type: 'open' | 'close'
// targetTime: Date object (UTC)
function addSchedule(groupJid, type, targetTime, setBy) {
    const data = loadSchedules();
    if (!data[groupJid]) data[groupJid] = [];

    // Remove any existing schedule of same type for this group
    data[groupJid] = data[groupJid].filter(s => s.type !== type);

    data[groupJid].push({
        type,                                     // 'open' | 'close'
        targetTime: targetTime.toISOString(),     // ISO string stored
        setBy,
        done: false
    });

    saveSchedules(data);
}

// ─── Remove a schedule ────────────────────────────────────────────────────────
function removeSchedule(groupJid, type) {
    const data = loadSchedules();
    if (!data[groupJid]) return;
    data[groupJid] = data[groupJid].filter(s => s.type !== type);
    if (data[groupJid].length === 0) delete data[groupJid];
    saveSchedules(data);
}

// ─── List schedules for a group ───────────────────────────────────────────────
function getSchedules(groupJid) {
    const data = loadSchedules();
    return (data[groupJid] || []).filter(s => !s.done);
}

// ─── Execute pending schedules ────────────────────────────────────────────────
async function executePending() {
    if (!connRef) return;

    const data = loadSchedules();
    const now = new Date();
    let changed = false;

    for (const groupJid of Object.keys(data)) {
        for (const schedule of data[groupJid]) {
            if (schedule.done) continue;

            const target = new Date(schedule.targetTime);
            if (now >= target) {
                try {
                    if (schedule.type === 'open') {
                        await connRef.groupSettingUpdate(groupJid, 'not_announcement');
                        await connRef.sendMessage(groupJid, {
                            text: `🔓 *GROUP AUTO-OPENED*\n\n⏰ Scheduled open time reached.\nAll members can now send messages.\n\n> SHINIGAMI MD`
                        });
                        console.log(`✅ Scheduler: Opened group ${groupJid}`);
                    } else if (schedule.type === 'close') {
                        await connRef.groupSettingUpdate(groupJid, 'announcement');
                        await connRef.sendMessage(groupJid, {
                            text: `🔒 *GROUP AUTO-CLOSED*\n\n⏰ Scheduled close time reached.\nOnly admins can now send messages.\n\n> SHINIGAMI MD`
                        });
                        console.log(`✅ Scheduler: Closed group ${groupJid}`);
                    }
                    schedule.done = true;
                    changed = true;
                } catch (e) {
                    console.error(`Scheduler execute error (${groupJid}):`, e.message);
                }
            }
        }

        // Clean up done schedules
        data[groupJid] = data[groupJid].filter(s => !s.done);
        if (data[groupJid].length === 0) delete data[groupJid];
    }

    if (changed) saveSchedules(data);
}

// ─── Start the scheduler loop ─────────────────────────────────────────────────
function startScheduler(conn) {
    connRef = conn;
    if (schedulerInterval) clearInterval(schedulerInterval);
    schedulerInterval = setInterval(executePending, CHECK_INTERVAL);
    // Run once immediately on start to catch missed schedules after restart
    executePending();
    console.log('⏰ Group scheduler started (checks every 30s)');
}

// ─── Parse user input into a Date ─────────────────────────────────────────────
// Accepts formats:
//   DD/MM/YYYY HH:MM
//   DD/MM/YYYY HH:MM:SS
//   HH:MM  (today)
//   HH:MM:SS (today)
//   +Xs / +Xm / +Xh  (relative: +30s, +5m, +2h)
function parseScheduleInput(input, timezone = 'Africa/Abidjan') {
    const trimmed = input.trim();

    // Relative: +30s, +5m, +2h
    const relativeMatch = trimmed.match(/^\+(\d+)(s|m|h)$/i);
    if (relativeMatch) {
        const amount = parseInt(relativeMatch[1]);
        const unit = relativeMatch[2].toLowerCase();
        const ms = unit === 's' ? amount * 1000
                 : unit === 'm' ? amount * 60 * 1000
                 : amount * 60 * 60 * 1000;
        return { date: new Date(Date.now() + ms), error: null };
    }

    // Date + time: DD/MM/YYYY HH:MM or DD/MM/YYYY HH:MM:SS
    const dateTimeMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (dateTimeMatch) {
        const [, d, mo, y, h, mi, s = '00'] = dateTimeMatch;
        const m = moment.tz(`${y}-${mo.padStart(2,'0')}-${d.padStart(2,'0')} ${h.padStart(2,'0')}:${mi}:${s}`, timezone);
        if (!m.isValid()) return { date: null, error: 'Invalid date.' };
        return { date: m.toDate(), error: null };
    }

    // Time only: HH:MM or HH:MM:SS (today)
    const timeMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (timeMatch) {
        const [, h, mi, s = '00'] = timeMatch;
        const m = moment.tz(timezone).set({ hour: parseInt(h), minute: parseInt(mi), second: parseInt(s), millisecond: 0 });
        if (m.toDate() <= new Date()) m.add(1, 'day'); // if already passed, schedule for tomorrow
        return { date: m.toDate(), error: null };
    }

    return { date: null, error: 'Invalid format. Use: DD/MM/YYYY HH:MM or HH:MM or +30s/+5m/+2h' };
}

module.exports = {
    startScheduler,
    addSchedule,
    removeSchedule,
    getSchedules,
    parseScheduleInput
};
