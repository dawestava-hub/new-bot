const { cmd } = require('../momy');

cmd({
    pattern: "tagall",
    alias: ["all", "mentionall", "everyone"],
    desc: "tag all group members",
    category: "group",
    react: "🏷️",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender, isGroup, participants, groupMetadata }) => {
    try {
        // Check if in group
        if (!isGroup) {
            return reply("*❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚘𝚗𝚕𝚢 𝚠𝚘𝚛𝚔𝚜 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜*");
        }

        // Get group metadata
        const groupData = await conn.groupMetadata(from);
        const members = groupData.participants;
        
        if (!members || members.length === 0) {
            return reply("*❌ 𝙽𝚘 𝚖𝚎𝚖𝚋𝚎𝚛𝚜 𝚏𝚘𝚞𝚗𝚍 𝚒𝚗 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙*");
        }

        // Check if sender is admin ONLY
        const senderParticipant = members.find(p => p.id === sender);
        if (!senderParticipant || (senderParticipant.admin !== "admin" && senderParticipant.admin !== "superadmin")) {
            return reply("*❌ 𝙾𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍*");
        }

        // Get admin list
        const admins = members.filter(p => p.admin === "admin" || p.admin === "superadmin");
        const adminNames = admins.map(a => {
            const num = a.id.split('@')[0];
            return `@${num}`;
        }).join('\n│ • ');

        // Get sender info
        const senderNum = sender.split('@')[0];

        // Build the styled message
        let tagMessage = `╭━━━━━━━━━━━━━•
│ • BOT: SHINIGAMI-MD 
│ • MEMBRE: ${members.length}
│ • ADMIN:\n│ • ${adminNames}
│ • USER: @${senderNum}
│ • GROUP: ${groupData.subject}
╰─────────────•

🏷️ *TAG ALL MEMBERS*\n`;

        // Add all members mentions
        members.forEach((member, index) => {
            const number = member.id.split('@')[0];
            tagMessage += `\n${index + 1}. @${number}`;
        });

        tagMessage += `\n\n> 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐒𝐡𝐢𝐧𝐢𝐠𝐚𝐦𝐢-𝐌𝐃`;

        // Send message with contextInfo style
        await conn.sendMessage(from, {
            text: tagMessage,
            mentions: members.map(m => m.id),
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363403408693274@newsletter',
                    newsletterName: 'SHINIGAMI MD',
                    serverMessageId: 13
                }
            }
        }, { quoted: mek });

        await m.react("✅");

    } catch (error) {
        console.error('Error in tagall command:', error);
        reply("*❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚝𝚊𝚐 𝚊𝚕𝚕 𝚖𝚎𝚖𝚋𝚎𝚛𝚜*");
        await m.react("❌");
    }
});
