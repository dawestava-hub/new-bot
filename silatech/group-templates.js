const { cmd } = require('../momy');
const config = require('../config');
const {
    setWelcomeTemplate,
    setGoodbyeTemplate,
    resetWelcomeTemplate,
    resetGoodbyeTemplate,
    getWelcomeTemplate,
    getGoodbyeTemplate,
    DEFAULT_WELCOME,
    DEFAULT_GOODBYE
} = require('../lib/group-config');

const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
        newsletterName: config.BOT_NAME || 'SHINIGAMI MD',
        serverMessageId: 13
    }
};

// ─── SETWELCOME ───────────────────────────────────────────────────────────────
// Usage: .setwelcome Welcome {mention} to {group}! We are now {members} members.
// Variables: {mention}, {user}, {group}, {members}
cmd({
    pattern: "setwelcome",
    react: "👋",
    desc: "Set a custom welcome message for this group",
    category: "group",
    use: ".setwelcome <message>  (use {mention}, {user}, {group}, {members})",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, q }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");

        const template = q?.trim();
        if (!template) {
            const current = getWelcomeTemplate(from);
            return reply(
                `👋 *SETWELCOME*\n\n` +
                `Set a custom welcome message for this group.\n\n` +
                `*Available variables:*\n` +
                `• \`{mention}\` — tags the new member\n` +
                `• \`{user}\` — new member's number\n` +
                `• \`{group}\` — group name\n` +
                `• \`{members}\` — total member count\n\n` +
                `*Current template:*\n${current || '_(default)_'}\n\n` +
                `*Example:*\n.setwelcome 🎉 Welcome {mention} to *{group}*! You are member #{members}.`
            );
        }

        setWelcomeTemplate(from, template);
        await reply(
            `✅ *WELCOME MESSAGE UPDATED*\n\n` +
            `📝 *New template:*\n${template}\n\n` +
            `_Variables: {mention}, {user}, {group}, {members}_\n\n> SHINIGAMI MD`
        );

    } catch (e) {
        console.error("Setwelcome error:", e);
        reply("❌ Failed to set welcome message: " + e.message);
    }
});

// ─── SETGOODBYE ───────────────────────────────────────────────────────────────
cmd({
    pattern: "setgoodbye",
    react: "👋",
    desc: "Set a custom goodbye message for this group",
    category: "group",
    use: ".setgoodbye <message>  (use {mention}, {user}, {group}, {members})",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, q }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");

        const template = q?.trim();
        if (!template) {
            const current = getGoodbyeTemplate(from);
            return reply(
                `👋 *SETGOODBYE*\n\n` +
                `Set a custom goodbye message for this group.\n\n` +
                `*Available variables:*\n` +
                `• \`{mention}\` — mentions the leaving member\n` +
                `• \`{user}\` — member's number\n` +
                `• \`{group}\` — group name\n` +
                `• \`{members}\` — remaining member count\n\n` +
                `*Current template:*\n${current || '_(default)_'}\n\n` +
                `*Example:*\n.setgoodbye 😢 {mention} has left *{group}*. {members} members remain.`
            );
        }

        setGoodbyeTemplate(from, template);
        await reply(
            `✅ *GOODBYE MESSAGE UPDATED*\n\n` +
            `📝 *New template:*\n${template}\n\n` +
            `_Variables: {mention}, {user}, {group}, {members}_\n\n> SHINIGAMI MD`
        );

    } catch (e) {
        console.error("Setgoodbye error:", e);
        reply("❌ Failed to set goodbye message: " + e.message);
    }
});

// ─── RESETWELCOME ─────────────────────────────────────────────────────────────
cmd({
    pattern: "resetwelcome",
    react: "🔄",
    alias: ["welcomereset"],
    desc: "Reset welcome message to default",
    category: "group",
    use: ".resetwelcome",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");

        resetWelcomeTemplate(from);
        await reply(
            `🔄 *WELCOME MESSAGE RESET*\n\n` +
            `The welcome message has been restored to the default template.\n\n` +
            `*Default template:*\n${DEFAULT_WELCOME}\n\n> SHINIGAMI MD`
        );

    } catch (e) {
        console.error("Resetwelcome error:", e);
        reply("❌ Failed to reset welcome message: " + e.message);
    }
});

// ─── RESETGOODBYE ─────────────────────────────────────────────────────────────
cmd({
    pattern: "resetgoodbye",
    react: "🔄",
    alias: ["goodbyereset"],
    desc: "Reset goodbye message to default",
    category: "group",
    use: ".resetgoodbye",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");

        resetGoodbyeTemplate(from);
        await reply(
            `🔄 *GOODBYE MESSAGE RESET*\n\n` +
            `The goodbye message has been restored to the default template.\n\n` +
            `*Default template:*\n${DEFAULT_GOODBYE}\n\n> SHINIGAMI MD`
        );

    } catch (e) {
        console.error("Resetgoodbye error:", e);
        reply("❌ Failed to reset goodbye message: " + e.message);
    }
});
