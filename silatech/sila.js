const { cmd } = require('../momy');

cmd({
    pattern: "octo",
    alias: ["dev", "creator", "bot"],
    desc: "bot developer information",
    category: "main",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, reply, myquoted }) => {
    try {
        const response = await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/ejpcue.png" },
            caption: `╭━━【 👑 BLAZE TECH 】━━━╮
│ 
│ *👤 NAME:* ARNOLD TARIMO
│ *🎯 ROLE:* Bot Developer & Owner
│ *💻 SPECIALITY:* WhatsApp Bot Development
│ *🌟 EXPERIENCE:* 3+ Years
│ 
│ ──────────────────
│ *📞 CONTACT INFO:*
│ 📱 *Phone:* +255627417402
│ 📧 *Email:* atarimo117@gmail.com
│ 
│ ──────────────────
│ *🔧 SERVICES OFFERED:*
│ 🤖 WhatsApp Bot Development
│ 💾 Bot Hosting & Maintenance
│ 🔧 Bot Updates & Fixes
│ 📚 Custom Commands
│ 
│ ──────────────────
│ *🌐 CONNECT WITH ME:*
│ 📢 *Channel:* https://whatsapp.com/channel/0029VbAjawl9MF8vQQa0ZT32
│ 🤖 *Bot Link:* https://octo-md-1.onrender.com/
│ 
╰━━━━━━━━━━━━━━━━━━━╯

*FEEL FREE TO CONTACT ME FOR:*
• Bot Development
• Bot Modifications
• Custom Features
• Technical Support

> 🚀 DEVELOPED BY BLAZE TECH`
        }, { quoted: myquoted });

        await m.react("👑");

    } catch (error) {
        console.error('Error in octo command:', error);
        reply("*❌ Error displaying developer info*");
        await m.react("❌");
    }
});