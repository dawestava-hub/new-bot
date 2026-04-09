const { cmd, commands } = require('../momy');
const config = require('../config');

// Ping Command
cmd({
    pattern: "ping",
    desc: "Check bot latency",
    category: "general",
    react: "😎"
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply, myquoted }) => {
        try {
            const startTime = Date.now();
            const message = await conn.sendMessage(from, { text: '🔍 Checking connection...' }, { quoted: myquoted });
            const endTime = Date.now();
            const ping = endTime - startTime;

            const pongMessage = `⚡ SHINIGAMI MD PONG: ${ping} ms`;

            await conn.sendMessage(from, { text: pongMessage }, { quoted: message });
        } catch (e) {
            console.log(e);
            reply(`❌ Error: ${e.message}`);
        }
    });

// Alive Command - NO DESIGN, JUST TEXT
cmd({
    pattern: "alive",
    desc: "Check if bot is active",
    category: "general",
    react: "✅"
},
    async (conn, mek, m, { from, reply, myquoted }) => {
        try {
            // Simple plain text message - no design boxes
            const aliveMessage = `✅ SHINIGAMI MD IS ACTIVE

🤖 Status: Active
🔰 Prefix: ${config.PREFIX}
📦 Version: 2.0.0
👨‍💻 Dev: INCONNU BOY

💫 Bot is running smoothly!
🚀 Type ${config.PREFIX}menu for commands`;

            await conn.sendMessage(from, { text: aliveMessage }, { quoted: myquoted });
        } catch (e) {
            reply("❌ Error: " + e.message);
        }
    });
