const { cmd } = require('../momy');
const config = require('../config');

const ctxInfo = () => ({
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
        newsletterName: config.BOT_NAME || 'SHINIGAMI MD',
        serverMessageId: 13
    }
});

// Helper: send with image if BOT_IMAGE is set, otherwise plain text
async function sendWithOptionalImage(conn, from, text, mentions, mek) {
    const botImage = config.BOT_IMAGE || config.BOT_PP || null;
    const opts = { quoted: mek };
    if (botImage) {
        await conn.sendMessage(from, {
            image: { url: botImage },
            caption: text,
            mentions: mentions || [],
            contextInfo: ctxInfo()
        }, opts);
    } else {
        await conn.sendMessage(from, {
            text,
            mentions: mentions || [],
            contextInfo: ctxInfo()
        }, opts);
    }
}

// ─── JOIN ─────────────────────────────────────────────────────────────────────
cmd({
    pattern: "join",
    react: "🔗",
    desc: "Bot joins a group via invite link",
    category: "group",
    use: ".join <group invite link>",
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwner, q }) => {
    try {
        if (!isOwner) return reply("❌ Owner only command.");

        const link = q?.trim();
        if (!link) return reply(
            `❌ Please provide a group invite link.\n\n` +
            `Example: .join https://chat.whatsapp.com/ABC123\n\n> ${config.BOT_NAME}`
        );

        // Extract invite code from full link or raw code
        const code = link.includes("chat.whatsapp.com/")
            ? link.split("chat.whatsapp.com/")[1].split(/[? ]/)[0].trim()
            : link.trim();

        if (!code || code.length < 10) return reply("❌ Invalid invite link or code.");

        await conn.groupAcceptInvite(code);

        reply(
            `✅ *GROUP JOINED SUCCESSFULLY*\n\n` +
            `🔗 Link: ${link}\n\n> ${config.BOT_NAME}`
        );

    } catch (e) {
        console.error("Join error:", e);
        if (e.message?.includes('not-authorized') || e.message?.includes('forbidden')) {
            reply("❌ This invite link is invalid or expired.");
        } else {
            reply("❌ Failed to join group: " + e.message);
        }
    }
});

// ─── LINK ─────────────────────────────────────────────────────────────────────
cmd({
    pattern: "link",
    react: "🔗",
    alias: ["grouplink", "invitelink"],
    desc: "Get or regenerate the group invite link",
    category: "group",
    use: ".link | .link reset",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isOwner, isAdmins, q }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isOwner && !isAdmins) return reply("❌ Only group admins can use this command.");

        const arg = q?.trim().toLowerCase();

        if (arg === "reset" || arg === "revoke" || arg === "new") {
            const newCode = await conn.groupRevokeInvite(from);
            const newLink = `https://chat.whatsapp.com/${newCode}`;

            await sendWithOptionalImage(conn, from,
                `🔗 *GROUP LINK REVOKED & REGENERATED*\n\n` +
                `🆕 New invite link:\n${newLink}\n\n` +
                `⚠️ Old link is now invalid.\n\n> ${config.BOT_NAME}`,
                [], mek
            );
        } else {
            const inviteCode = await conn.groupInviteCode(from);
            const link = `https://chat.whatsapp.com/${inviteCode}`;

            await sendWithOptionalImage(conn, from,
                `🔗 *GROUP INVITE LINK*\n\n${link}\n\n` +
                `_Use *.link reset* to regenerate a new link_\n\n> ${config.BOT_NAME}`,
                [], mek
            );
        }

    } catch (e) {
        console.error("Link error:", e);
        reply("❌ Failed: " + e.message);
    }
});

// ─── GROUPINFO ────────────────────────────────────────────────────────────────
cmd({
    pattern: "groupinfo",
    alias: ["ginfo", "grpinfo"],
    react: "📊",
    desc: "Get detailed group information",
    category: "group",
    use: ".groupinfo",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");

        const g = await conn.groupMetadata(from);
        const members = g.participants;
        const admins = members.filter(p => p.admin);
        const superAdmin = members.find(p => p.admin === "superadmin");
        const created = g.creation
            ? new Date(g.creation * 1000).toLocaleDateString('en-GB', {
                year: 'numeric', month: 'long', day: 'numeric'
              })
            : "Unknown";

        let inviteLink = "N/A";
        try {
            const code = await conn.groupInviteCode(from);
            inviteLink = `https://chat.whatsapp.com/${code}`;
        } catch (_) {}

        // Newsletter JID
        const newsletterJid = config.CHANNEL_JID_1 || 'N/A';

        const ownerNum = (superAdmin?.id || g.owner || 'unknown').split('@')[0].split(':')[0];

        const info =
`╭━━━━━━━━━━━━━•
│ 📊 *GROUP INFORMATION*
│
│ 📛 Name: ${g.subject}
│ 🆔 JID: ${g.id}
│ 👑 Owner: @${ownerNum}
│ 📅 Created: ${created}
│ 👥 Members: ${members.length}
│ 👮 Admins: ${admins.length}
│ 🔗 Link: ${inviteLink}
│ 📡 Newsletter: ${newsletterJid}
│
│ 📝 Description:
│ ${g.desc ? g.desc.replace(/\n/g, '\n│ ') : 'No description set'}
╰─────────────•

> ${config.BOT_NAME}`;

        const mentionList = superAdmin ? [superAdmin.id] : [];

        await sendWithOptionalImage(conn, from, info, mentionList, mek);

    } catch (e) {
        console.error("Groupinfo error:", e);
        reply("❌ Failed to get group info: " + e.message);
    }
});

// ─── BROADCASTER ──────────────────────────────────────────────────────────────
cmd({
    pattern: "broadcaster",
    alias: ["broadcast", "bc"],
    react: "📢",
    desc: "Send a broadcast message to all groups the bot is in",
    category: "owner",
    use: ".broadcaster <message>",
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwner, q }) => {
    try {
        if (!isOwner) return reply("❌ Owner only command.");

        const message = q?.trim();
        if (!message) return reply(
            `❌ Please provide a message.\n\nExample:\n.broadcaster Hello everyone!\n\n> ${config.BOT_NAME}`
        );

        // Fetch all groups bot participates in
        const allGroups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(allGroups);

        if (!groupIds.length) return reply("❌ Bot is not in any group.");

        await reply(
            `📢 *BROADCAST STARTING*\n\n` +
            `📬 Target: ${groupIds.length} group(s)\n` +
            `⏳ Please wait...\n\n> ${config.BOT_NAME}`
        );

        let sent = 0;
        let failed = 0;

        for (const gid of groupIds) {
            try {
                await conn.sendMessage(gid, {
                    text:
                        `📢 *BROADCAST*\n\n` +
                        `${message}\n\n` +
                        `> ${config.BOT_NAME}`,
                    contextInfo: ctxInfo()
                });
                sent++;
                // 1.2s delay between each send to avoid rate-limiting / ban
                await new Promise(r => setTimeout(r, 1200));
            } catch (e) {
                console.error(`Broadcast failed for ${gid}:`, e.message);
                failed++;
            }
        }

        reply(
            `✅ *BROADCAST COMPLETE*\n\n` +
            `✔️ Sent: *${sent}*\n` +
            `❌ Failed: *${failed}*\n` +
            `📊 Total: *${groupIds.length}*\n\n` +
            `> ${config.BOT_NAME}`
        );

    } catch (e) {
        console.error("Broadcaster error:", e);
        reply("❌ Broadcast failed: " + e.message);
    }
});
