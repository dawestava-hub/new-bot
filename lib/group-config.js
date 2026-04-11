const config = require('../config');

const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
        newsletterName: 'SHINIGAMI MD',
        serverMessageId: 13
    }
};

// ─── In-memory custom template store (per group JID) ────────────────────────
// Format: { groupJid: { welcome: "...", goodbye: "..." } }
const customTemplates = new Map();

function setWelcomeTemplate(groupJid, template) {
    const existing = customTemplates.get(groupJid) || {};
    customTemplates.set(groupJid, { ...existing, welcome: template });
}

function setGoodbyeTemplate(groupJid, template) {
    const existing = customTemplates.get(groupJid) || {};
    customTemplates.set(groupJid, { ...existing, goodbye: template });
}

function resetWelcomeTemplate(groupJid) {
    const existing = customTemplates.get(groupJid) || {};
    delete existing.welcome;
    customTemplates.set(groupJid, existing);
}

function resetGoodbyeTemplate(groupJid) {
    const existing = customTemplates.get(groupJid) || {};
    delete existing.goodbye;
    customTemplates.set(groupJid, existing);
}

function getWelcomeTemplate(groupJid) {
    return customTemplates.get(groupJid)?.welcome || null;
}

function getGoodbyeTemplate(groupJid) {
    return customTemplates.get(groupJid)?.goodbye || null;
}

// ─── Build message from template with variable substitution ─────────────────
// Variables: {user}, {group}, {members}, {mention}
function buildTemplate(template, vars) {
    return template
        .replace(/\{user\}/gi, vars.username)
        .replace(/\{mention\}/gi, `@${vars.username}`)
        .replace(/\{group\}/gi, vars.groupName)
        .replace(/\{members\}/gi, vars.members);
}

const DEFAULT_WELCOME =
`╭───────────────⊷
│ 👋 *WELCOME*
│
│ 🧑‍💼 *User:* @{user}
│ 📛 *Group:* {group}
│ 👥 *Members:* {members}
│
│ 💬 *Read the group rules!*
╰───────────────⊷
> SHINIGAMI MD`;

const DEFAULT_GOODBYE =
`╭───────────────⊷
│ 👋 *GOODBYE*
│
│ 🧑‍💼 *User:* @{user}
│ 📛 *Group:* {group}
│ 👥 *Members Left:* {members}
│
│ ❌ *User has left the group*
╰───────────────⊷
> SHINIGAMI MD`;

async function groupEvents(conn, update) {
    const isWelcomeEnabled = config.WELCOME_ENABLE === 'true';
    const isGoodbyeEnabled = config.GOODBYE_ENABLE === 'true';

    if (!isWelcomeEnabled && !isGoodbyeEnabled) return;

    try {
        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;
        const groupJid = update.id;
        const participants = update.participants;

        for (const participantJid of participants) {
            const username = participantJid.split('@')[0];
            const mentions = [participantJid];
            const vars = { username, groupName, members: metadata.participants.length };

            if (update.action === 'add' && isWelcomeEnabled) {
                const customTpl = getWelcomeTemplate(groupJid);
                const tpl = customTpl || DEFAULT_WELCOME;
                const welcomeMsg = buildTemplate(tpl, vars);
                const welcomeImage = config.WELCOME_IMAGE || 'https://files.catbox.moe/xoac4l.jpg';

                await conn.sendMessage(groupJid, {
                    image: { url: welcomeImage },
                    caption: welcomeMsg,
                    mentions: mentions,
                    contextInfo: { ...contextInfo, mentionedJid: mentions }
                });
            }

            else if (update.action === 'remove' && isGoodbyeEnabled) {
                const customTpl = getGoodbyeTemplate(groupJid);
                const tpl = customTpl || DEFAULT_GOODBYE;
                const goodbyeMsg = buildTemplate(tpl, vars);
                const goodbyeImage = config.GOODBYE_IMAGE || 'https://files.catbox.moe/xoac4l.jpg';

                await conn.sendMessage(groupJid, {
                    image: { url: goodbyeImage },
                    caption: goodbyeMsg,
                    mentions: mentions,
                    contextInfo: { ...contextInfo, mentionedJid: mentions }
                });
            }

            else if (update.action === 'promote') {
                const author = update.author || '';
                if (author) mentions.push(author);
                const msg = `👑 Congratulations @${username}!\nYou have been promoted to *Admin* in *${groupName}*.\nPlease use your new privileges responsibly.`;
                await conn.sendMessage(groupJid, {
                    text: msg,
                    mentions: mentions,
                    contextInfo: { ...contextInfo, mentionedJid: mentions }
                });
            }

            else if (update.action === 'demote') {
                const author = update.author || '';
                if (author) mentions.push(author);
                const msg = `🔻 @${username} has been removed from the *Admin* role in *${groupName}*.\nAdmin privileges have been revoked.`;
                await conn.sendMessage(groupJid, {
                    text: msg,
                    mentions: mentions,
                    contextInfo: { ...contextInfo, mentionedJid: mentions }
                });
            }
        }

        await handleChannelEvents(conn, update);

    } catch (e) {
        console.error("Group Events Error:", e.message);
    }
}

async function handleChannelEvents(conn, update) {
    try {
        const channelJids = [config.CHANNEL_JID_1, config.CHANNEL_JID_2].filter(Boolean);

        for (const channelJid of channelJids) {
            if (!channelJid) continue;
            if (update.id.includes('@newsletter')) {
                await handleNewsletterEvents(conn, update, channelJid);
            }
        }
    } catch (e) {
        console.error("Channel Events Error:", e.message);
    }
}

async function handleNewsletterEvents(conn, update, channelJid) {
    try {
        const participantJid = update.participants?.[0] || '';
        const username = participantJid.split('@')[0];
        let channelMessage = '';

        if (update.action === 'add') {
            channelMessage = `📢 New subscriber: *${username}*\n🕐 ${new Date().toLocaleTimeString()}`;
            if (config.OWNER_NUMBER) {
                await conn.sendMessage(`${config.OWNER_NUMBER}@s.whatsapp.net`, {
                    text: channelMessage,
                    contextInfo
                });
            }
        } else if (update.action === 'remove') {
            channelMessage = `📢 A subscriber has left: *${username}*\n🕐 ${new Date().toLocaleTimeString()}`;
            if (config.OWNER_NUMBER) {
                await conn.sendMessage(`${config.OWNER_NUMBER}@s.whatsapp.net`, {
                    text: channelMessage,
                    contextInfo
                });
            }
        }
    } catch (e) {
        console.error("Newsletter Events Error:", e.message);
    }
}

async function handleGroupSettingsUpdate(conn, update) {
    try {
        if (update.announce === 'true' || update.announce === 'false') {
            const status = update.announce === 'true' ? 'locked 🔒 — only admins can send messages' : 'unlocked 🔓 — all members can send messages';
            await conn.sendMessage(update.id, {
                text: `📢 The group has been ${status}.`,
                contextInfo
            });
        }

        if (update.restrict === 'true' || update.restrict === 'false') {
            const status = update.restrict === 'true' ? 'enabled 🔒 — only admins can edit group settings' : 'disabled 🔓 — all members can edit group settings';
            await conn.sendMessage(update.id, {
                text: `⚙️ Group settings restriction has been ${status}.`,
                contextInfo
            });
        }

        if (update.subject) {
            await conn.sendMessage(update.id, {
                text: `📛 The group name has been updated to *${update.subject}*.`,
                contextInfo
            });
        }

        if (update.description) {
            await conn.sendMessage(update.id, {
                text: `📄 The group description has been updated. Please check the group info for details.`,
                contextInfo
            });
        }

        if (update.picture) {
            await conn.sendMessage(update.id, {
                text: `🖼️ The group profile picture has been changed.`,
                contextInfo
            });
        }
    } catch (e) {
        console.error("Group Settings Update Error:", e.message);
    }
}

async function handleAllEvents(conn, update) {
    try {
        if (update.type === 'participants') {
            await groupEvents(conn, update);
        } else if (update.type === 'group-update') {
            await handleGroupSettingsUpdate(conn, update);
        } else if (update.type === 'channel-update') {
            await handleChannelEvents(conn, update);
        }
    } catch (e) {
        console.error("All Events Handler Error:", e.message);
    }
}

module.exports = {
    groupEvents,
    handleAllEvents,
    handleChannelEvents,
    handleGroupSettingsUpdate,
    setWelcomeTemplate,
    setGoodbyeTemplate,
    resetWelcomeTemplate,
    resetGoodbyeTemplate,
    getWelcomeTemplate,
    getGoodbyeTemplate,
    DEFAULT_WELCOME,
    DEFAULT_GOODBYE
};
