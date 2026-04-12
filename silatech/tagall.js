const { cmd } = require('../momy');
const config = require('../config');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "tagall",
    alias: ["all", "mentionall", "everyone"],
    desc: "Tag all group members",
    category: "group",
    react: "🏷️",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender, isGroup, isAdmins }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isAdmins) return reply("❌ Only group admins can use this command.");

        const groupData = await conn.groupMetadata(from);
        const members = groupData.participants;

        // Accept @s.whatsapp.net AND @lid jids (new WhatsApp format)
        const realMembers = members.filter(p =>
            p.id && (p.id.endsWith('@s.whatsapp.net') || p.id.endsWith('@lid'))
        );

        // Fallback: use all members if none match
        const validMembers = realMembers.length > 0 ? realMembers : members.filter(p => p.id);

        if (!validMembers.length) return reply("❌ No valid members found.");

        const admins = validMembers.filter(p =>
            p.admin === "admin" || p.admin === "superadmin"
        );

        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
                newsletterName: config.BOT_NAME || 'SHINIGAMI MD',
                serverMessageId: 13
            }
        };

        let tagMessage =
`╭━━━━━━━━━━━━━•
│ • BOT: ${config.BOT_NAME || 'SHINIGAMI-MD'}
│ • MEMBRE: ${validMembers.length}
│ • ADMIN: ${admins.length}
│ • USER: @${sender.split('@')[0]}
│ • GROUP: ${groupData.subject}
╰─────────────•

🏷️ *TAG ALL MEMBERS*\n`;

        validMembers.forEach((member, index) => {
            tagMessage += `\n${index + 1}. @${member.id.split('@')[0]}`;
        });

        tagMessage += `\n\n> Powerd By ${config.BOT_NAME || 'Shinigami-MD'}`;

        const mentions = validMembers.map(p => p.id);

        // Send with image if BOT_IMAGE is configured
        const botImage = config.BOT_IMAGE || config.BOT_PP || null;

        if (botImage) {
            await conn.sendMessage(from, {
                image: { url: botImage },
                caption: tagMessage,
                mentions,
                contextInfo
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, {
                text: tagMessage,
                mentions,
                contextInfo
            }, { quoted: mek });
        }

        await m.react("✅");

    } catch (error) {
        console.error('Error in tagall:', error);
        reply("❌ Failed to tag all members");
        await m.react("❌");
    }
});
