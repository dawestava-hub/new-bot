const { cmd, commands } = require('../momy');
const config = require('../config');

// Commande Ping
cmd({
    pattern: "ping",
    desc: "Check bot latency",
    category: "general",
    react: "😎"
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply, myquoted }) => {
        try {
            const startTime = Date.now();
            const message = await conn.sendMessage(from, { text: '🔍 _checking connection..._' }, { quoted: myquoted });
            const endTime = Date.now();
            const ping = endTime - startTime;

            const pongMessage = `*😎 OCTO MD PONG : ${ping} ms*`;

            await conn.sendMessage(from, { text: pongMessage }, { quoted: message });
        } catch (e) {
            console.log(e);
            reply(`❌ error: ${e.message}`);
        }
    });

// Commande Alive
cmd({
    pattern: "alive",
    desc: "Check if bot is alive",
    category: "general",
    react: "🔐"
},
    async (conn, mek, m, { from, reply, myquoted }) => {
        try {
            await conn.sendMessage(from, {
                image: { url: config.IMAGE_PATH }, // updated to config image
                caption: `╭━━【 OCTO MD BOT 】━━━━━━━━╮
│ status: *active & running*
│ prefix: *${config.PREFIX}*
│ version: *2.0.0*
│ developed: *BLAZE TECH*
╰━━━━━━━━━━━━━━━━━━━━╯

${config.BOT_FOOTER || '> © 𝐏𝐨𝐰𝐞𝐫𝐝 𝐁𝐲 𝐁𝐥𝐚𝐳𝐞 𝐓𝐞𝐜𝐡'}`
            }, { quoted: myquoted });
        } catch (e) {
            reply("error: " + e.message);
        }
    });