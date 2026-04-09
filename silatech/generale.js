const { cmd, commands } = require('../momy');
const config = require('../config');
const os = require('os');

// =================================================================
// ⏱️ COMMANDE UPTIME
// =================================================================
cmd({
    pattern: "uptime",
    alias: ["speed", "ping"],
    desc: "check bot latency and system resources",
    category: "general",
    react: "💀"
},
    async (conn, mek, m, { from, reply, myquoted }) => {
        try {
            const start = Date.now();

            // Initial message
            const msg = await conn.sendMessage(from, { text: 'testing...' }, { quoted: myquoted });

            const end = Date.now();
            const latency = end - start;

            // Memory calculation
            const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
            const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
            const usedMem = (totalMem - freeMem).toFixed(0);

            // Uptime calculation
            const uptime = () => {
                let sec = process.uptime();
                let h = Math.floor(sec / 3600);
                let mn = Math.floor((sec % 3600) / 60);
                let s = Math.floor(sec % 60);
                return `${h}h ${mn}m ${s}s`;
            };

            // Final message
            const uptimeMsg = `╭━━【 💀 𝚄𝙿𝚃𝙸𝙼𝙴 𝙸𝙽𝙵𝙾 】━━━━╮
│ ⚡ response: *${latency} ms*
│ ⏱️ uptime: *${uptime()}*
│ 🖥️ platform: *${os.platform()}*
│ 💾 memory: *${usedMem}mb / ${totalMem}mb*
│ 📊 cpu: *${os.cpus().length} cores*
╰━━━━━━━━━━━━━━━━━━━━╯

> © MADE IN BY INCONNU BOY`;

            // Edit message
            await conn.sendMessage(from, { text: uptimeMsg, edit: msg.key });

        } catch (e) {
            reply("*error checking uptime*");
        }
    });


// =================================================================
// 👑 COMMANDE OWNER
// =================================================================
cmd({
    pattern: "owner",
    desc: "contact bot owner",
    category: "general",
    react: "💀"
},
    async (conn, mek, m, { from, myquoted }) => {
        const ownerNumber = config.OWNER_NUMBER;

        const vcard = 'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'FN:blaze tech (owner)\n' +
            'ORG:octo-md bot;\n' +
            `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\n` +
            'END:VCARD';

        await conn.sendMessage(from, {
            contacts: {
                displayName: 'blaze tech',
                contacts: [{ vcard }]
            }
        }, { quoted: myquoted });
    });
