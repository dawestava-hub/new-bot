const { cmd } = require('../momy');
const config = require('../config');

// ─── KICKALL (kick everyone instantly) ────────────────────────────────────────
cmd({
    pattern: "kickall",
    react: "💀",
    desc: "Kick all members from the group at once",
    category: "group",
    use: ".kickall",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, isBotAdmins, participants, groupAdmins, botNumber }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ Please make the bot an admin first.");

        const botJid = botNumber + "@s.whatsapp.net";

        // Filter out bot itself and group admins
        const toKick = participants
            .map(p => p.id)
            .filter(id => id !== botJid && !groupAdmins.includes(id));

        if (toKick.length === 0) return reply("❌ No regular members to kick.");

        await reply(`⚡ *KICKALL INITIATED*\n\n🗑️ Kicking *${toKick.length}* member(s)...\n\n> SHINIGAMI MD`);

        // Kick all at once (batch)
        await conn.groupParticipantsUpdate(from, toKick, "remove");

        await reply(`✅ *KICKALL COMPLETE*\n\n👢 Kicked *${toKick.length}* member(s) successfully.\n\n> SHINIGAMI MD`);

    } catch (e) {
        console.error("Kickall error:", e);
        reply("❌ Failed to kick all members. Make sure bot is admin.");
    }
});

// ─── KICKALL2 (kick one by one with delay) ────────────────────────────────────
cmd({
    pattern: "kickall2",
    react: "👢",
    desc: "Kick all members one by one",
    category: "group",
    use: ".kickall2",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, isBotAdmins, participants, groupAdmins, botNumber }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ Please make the bot an admin first.");

        const botJid = botNumber + "@s.whatsapp.net";

        const toKick = participants
            .map(p => p.id)
            .filter(id => id !== botJid && !groupAdmins.includes(id));

        if (toKick.length === 0) return reply("❌ No regular members to kick.");

        await reply(`⚡ *KICKALL2 INITIATED*\n\n👢 Kicking *${toKick.length}* member(s) one by one...\n\n> SHINIGAMI MD`);

        let kicked = 0;
        for (const user of toKick) {
            try {
                await conn.groupParticipantsUpdate(from, [user], "remove");
                kicked++;
                await new Promise(r => setTimeout(r, 800));
            } catch (e) {
                console.error(`Failed to kick ${user}:`, e.message);
            }
        }

        await reply(`✅ *KICKALL2 COMPLETE*\n\n👢 Kicked *${kicked}/${toKick.length}* member(s) successfully.\n\n> SHINIGAMI MD`);

    } catch (e) {
        console.error("Kickall2 error:", e);
        reply("❌ Failed. Make sure bot is admin.");
    }
});

// ─── PROMOTE ──────────────────────────────────────────────────────────────────
cmd({
    pattern: "promote",
    react: "⬆️",
    alias: ["makeadmin"],
    desc: "Promote a member to admin",
    category: "group",
    use: ".promote @user",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, isBotAdmins, mentionedJid, participants }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ Please make the bot an admin first.");

        if (!mentionedJid || mentionedJid.length === 0) {
            return reply("❌ Please tag the member to promote.\n\nExample:\n.promote @user");
        }

        for (const user of mentionedJid) {
            await conn.groupParticipantsUpdate(from, [user], "promote");
        }

        const names = mentionedJid.map(j => "@" + j.split("@")[0]).join(", ");
        await conn.sendMessage(from, {
            text: `⬆️ *PROMOTED TO ADMIN*\n\n👑 ${names} is now a group admin!\n\n> SHINIGAMI MD`,
            mentions: mentionedJid
        }, { quoted: mek });

    } catch (e) {
        console.error("Promote error:", e);
        reply("❌ Failed to promote member.");
    }
});

// ─── DEMOTE ───────────────────────────────────────────────────────────────────
cmd({
    pattern: "demote",
    react: "⬇️",
    alias: ["removeadmin"],
    desc: "Demote an admin to regular member",
    category: "group",
    use: ".demote @user",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, isBotAdmins, mentionedJid }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ Please make the bot an admin first.");

        if (!mentionedJid || mentionedJid.length === 0) {
            return reply("❌ Please tag the admin to demote.\n\nExample:\n.demote @user");
        }

        for (const user of mentionedJid) {
            await conn.groupParticipantsUpdate(from, [user], "demote");
        }

        const names = mentionedJid.map(j => "@" + j.split("@")[0]).join(", ");
        await conn.sendMessage(from, {
            text: `⬇️ *DEMOTED FROM ADMIN*\n\n${names} is no longer an admin.\n\n> SHINIGAMI MD`,
            mentions: mentionedJid
        }, { quoted: mek });

    } catch (e) {
        console.error("Demote error:", e);
        reply("❌ Failed to demote member.");
    }
});

// ─── SETDESC ──────────────────────────────────────────────────────────────────
cmd({
    pattern: "setdesc",
    react: "📝",
    alias: ["setdescription", "groupdesc"],
    desc: "Change group description",
    category: "group",
    use: ".setdesc <new description>",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, isBotAdmins, args, q }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ Please make the bot an admin first.");

        const desc = q?.trim();
        if (!desc) return reply("❌ Please provide a description.\n\nExample:\n.setdesc Welcome to our group!");

        await conn.groupUpdateDescription(from, desc);
        await reply(`📝 *GROUP DESCRIPTION UPDATED*\n\n"${desc}"\n\n> SHINIGAMI MD`);

    } catch (e) {
        console.error("Setdesc error:", e);
        reply("❌ Failed to update description.");
    }
});

// ─── SETNAME ──────────────────────────────────────────────────────────────────
cmd({
    pattern: "setname",
    react: "✏️",
    alias: ["groupname", "setgroupname"],
    desc: "Change group name/subject",
    category: "group",
    use: ".setname <new name>",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, isBotAdmins, q }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ Please make the bot an admin first.");

        const name = q?.trim();
        if (!name) return reply("❌ Please provide a group name.\n\nExample:\n.setname My Awesome Group");

        await conn.groupUpdateSubject(from, name);
        await reply(`✏️ *GROUP NAME UPDATED*\n\nNew name: *${name}*\n\n> SHINIGAMI MD`);

    } catch (e) {
        console.error("Setname error:", e);
        reply("❌ Failed to update group name.");
    }
});

// ─── SETPPGROUP ───────────────────────────────────────────────────────────────
cmd({
    pattern: "setppgroup",
    react: "🖼️",
    alias: ["setgroupicon", "setgrouppic", "setgpp"],
    desc: "Change group profile picture (reply to an image)",
    category: "group",
    use: ".setppgroup (reply to image)",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, isBotAdmins }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ Please make the bot an admin first.");

        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMsg = quoted?.imageMessage || mek.message?.imageMessage;

        if (!imageMsg) {
            return reply("❌ Please reply to an image to set it as the group photo.\n\nExample: Reply to a photo with .setppgroup");
        }

        const media = await conn.downloadMediaMessage({ message: { imageMessage: imageMsg } });

        await conn.updateProfilePicture(from, media);
        await reply("🖼️ *GROUP PHOTO UPDATED*\n\nGroup profile picture has been changed successfully!\n\n> SHINIGAMI MD");

    } catch (e) {
        console.error("Setppgroup error:", e);
        reply("❌ Failed to update group photo. Make sure you replied to an image.");
    }
});

// ─── OPENTIME ─────────────────────────────────────────────────────────────────
// Usage:
//   .opentime now               → open immediately
//   .opentime 14:30             → open today at 14:30
//   .opentime 25/04/2026 08:00  → open at specific date & time
//   .opentime +30m              → open in 30 minutes
//   .opentime cancel            → cancel scheduled open
//   .opentime status            → show current schedule
cmd({
    pattern: "opentime",
    react: "🔓",
    alias: ["groupopen"],
    desc: "Schedule automatic group opening",
    category: "group",
    use: ".opentime <now | HH:MM | DD/MM/YYYY HH:MM | +Xm/+Xh/+Xs | cancel | status>",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, isBotAdmins, sender, q }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ Please make the bot an admin first.");

        const { addSchedule, removeSchedule, getSchedules, parseScheduleInput } = require('../lib/scheduler');
        const moment = require('moment-timezone');
        const input = q?.trim();

        if (!input) {
            return reply(
                "🔓 *OPENTIME — SCHEDULE GROUP OPENING*\n\n" +
                "*Usage:*\n" +
                "• `.opentime now` — Open immediately\n" +
                "• `.opentime 14:30` — Today at 14:30\n" +
                "• `.opentime 25/04/2026 08:00` — Specific date\n" +
                "• `.opentime +30m` — In 30 minutes\n" +
                "• `.opentime +2h` — In 2 hours\n" +
                "• `.opentime +45s` — In 45 seconds\n" +
                "• `.opentime cancel` — Cancel schedule\n" +
                "• `.opentime status` — Show schedule\n\n" +
                "> SHINIGAMI MD"
            );
        }

        // Cancel
        if (input === 'cancel') {
            removeSchedule(from, 'open');
            return reply("🗑️ *OPENTIME CANCELLED*\n\nScheduled open has been removed.\n\n> SHINIGAMI MD");
        }

        // Status
        if (input === 'status') {
            const schedules = getSchedules(from);
            const openSched = schedules.find(s => s.type === 'open');
            if (!openSched) return reply("📋 *No scheduled open for this group.*\n\n> SHINIGAMI MD");
            const dateStr = moment(openSched.targetTime).format('DD/MM/YYYY HH:mm:ss');
            const diff = moment(openSched.targetTime).fromNow();
            return reply(`🔓 *OPENTIME STATUS*\n\n📅 Scheduled: *${dateStr}*\n⏱️ Time left: *${diff}*\n\n> SHINIGAMI MD`);
        }

        // Now — immediate open
        if (input === 'now') {
            await conn.groupSettingUpdate(from, "not_announcement");
            return reply("🔓 *GROUP OPENED NOW*\n\nAll members can now send messages.\n\n> SHINIGAMI MD");
        }

        // Parse date/time input
        const { date, error } = parseScheduleInput(input);
        if (error) return reply(`❌ *${error}*\n\nExamples:\n• .opentime 14:30\n• .opentime 25/04/2026 08:00\n• .opentime +30m`);

        if (date <= new Date()) {
            return reply("❌ The scheduled time is in the past. Please choose a future time.");
        }

        addSchedule(from, 'open', date, sender);

        const dateStr = moment(date).format('DD/MM/YYYY [at] HH:mm:ss');
        const diff = moment(date).fromNow();
        await reply(
            `🔓 *OPENTIME SCHEDULED*\n\n` +
            `📅 Date: *${dateStr}*\n` +
            `⏱️ In: *${diff}*\n\n` +
            `The bot will automatically open this group at the scheduled time, even if you're offline.\n\n` +
            `Use *.opentime cancel* to cancel.\n\n> SHINIGAMI MD`
        );

    } catch (e) {
        console.error("Opentime error:", e);
        reply("❌ Failed: " + e.message);
    }
});

// ─── CLOSETIME ────────────────────────────────────────────────────────────────
// Usage:
//   .closetime now               → close immediately
//   .closetime 22:00             → close today at 22:00
//   .closetime 25/04/2026 22:00  → close at specific date & time
//   .closetime +1h               → close in 1 hour
//   .closetime cancel            → cancel scheduled close
//   .closetime status            → show current schedule
cmd({
    pattern: "closetime",
    react: "🔒",
    alias: ["groupclose"],
    desc: "Schedule automatic group closing",
    category: "group",
    use: ".closetime <now | HH:MM | DD/MM/YYYY HH:MM | +Xm/+Xh/+Xs | cancel | status>",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, isBotAdmins, sender, q }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ Please make the bot an admin first.");

        const { addSchedule, removeSchedule, getSchedules, parseScheduleInput } = require('../lib/scheduler');
        const moment = require('moment-timezone');
        const input = q?.trim();

        if (!input) {
            return reply(
                "🔒 *CLOSETIME — SCHEDULE GROUP CLOSING*\n\n" +
                "*Usage:*\n" +
                "• `.closetime now` — Close immediately\n" +
                "• `.closetime 22:00` — Today at 22:00\n" +
                "• `.closetime 25/04/2026 22:00` — Specific date\n" +
                "• `.closetime +1h` — In 1 hour\n" +
                "• `.closetime +30m` — In 30 minutes\n" +
                "• `.closetime +45s` — In 45 seconds\n" +
                "• `.closetime cancel` — Cancel schedule\n" +
                "• `.closetime status` — Show schedule\n\n" +
                "> SHINIGAMI MD"
            );
        }

        // Cancel
        if (input === 'cancel') {
            removeSchedule(from, 'close');
            return reply("🗑️ *CLOSETIME CANCELLED*\n\nScheduled close has been removed.\n\n> SHINIGAMI MD");
        }

        // Status
        if (input === 'status') {
            const schedules = getSchedules(from);
            const closeSched = schedules.find(s => s.type === 'close');
            if (!closeSched) return reply("📋 *No scheduled close for this group.*\n\n> SHINIGAMI MD");
            const dateStr = moment(closeSched.targetTime).format('DD/MM/YYYY HH:mm:ss');
            const diff = moment(closeSched.targetTime).fromNow();
            return reply(`🔒 *CLOSETIME STATUS*\n\n📅 Scheduled: *${dateStr}*\n⏱️ Time left: *${diff}*\n\n> SHINIGAMI MD`);
        }

        // Now — immediate close
        if (input === 'now') {
            await conn.groupSettingUpdate(from, "announcement");
            return reply("🔒 *GROUP CLOSED NOW*\n\nOnly admins can send messages.\n\n> SHINIGAMI MD");
        }

        // Parse date/time input
        const { date, error } = parseScheduleInput(input);
        if (error) return reply(`❌ *${error}*\n\nExamples:\n• .closetime 22:00\n• .closetime 25/04/2026 22:00\n• .closetime +1h`);

        if (date <= new Date()) {
            return reply("❌ The scheduled time is in the past. Please choose a future time.");
        }

        addSchedule(from, 'close', date, sender);

        const dateStr = moment(date).format('DD/MM/YYYY [at] HH:mm:ss');
        const diff = moment(date).fromNow();
        await reply(
            `🔒 *CLOSETIME SCHEDULED*\n\n` +
            `📅 Date: *${dateStr}*\n` +
            `⏱️ In: *${diff}*\n\n` +
            `The bot will automatically close this group at the scheduled time, even if you're offline.\n\n` +
            `Use *.closetime cancel* to cancel.\n\n> SHINIGAMI MD`
        );

    } catch (e) {
        console.error("Closetime error:", e);
        reply("❌ Failed: " + e.message);
    }
});
