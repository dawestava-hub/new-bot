const config = require('../config');
const { cmd, commands } = require('../momy');

const toUpper = (str) => str.toUpperCase();

cmd({
  pattern: "bugmenu",
  alias: ["buglist", "crashmenu", "killmenu", "attackmenu"],
  desc: "show all bug/crash attack commands",
  category: "general",
  react: "🐛",
  filename: __filename
},
async (conn, mek, m, { from, reply, sender, isOwner, prefix }) => {

  try {

    let menu = `
╭━━━━━━━━━━━━━•
│ • BOT: SHINIGAMI MD
│ • USER: @${sender.split("@")[0]}
│ • TYPE: BUG/CRASH COMMANDS
╰─────────────•\n`;

    menu += `\n╭─  SHINIGAMI BUG MENU\n`;
    menu += `│ • inconnu-kill\n`;
    menu += `│ • primis-kill\n`;
    menu += `│ • sukuna-crash\n`;
    menu += `│ • dyby-crash\n`;
    menu += `│ • ios-crash\n`;
    menu += `│ • android-crash\n`;
    menu += `│ • ultimate-crash\n`;
    menu += `│ • dev-protection\n`;
    menu += `╰───────────────⭓\n`;

    menu += `\n> POWERED BY SHINIGAMI MD`;

    await conn.sendMessage(from, {
      image: { url: config.IMAGE_PATH || 'https://files.catbox.moe/xoac4l.jpg' },
      caption: menu,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
          newsletterName: 'SHINIGAMI MD',
          serverMessageId: 13
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error("Bug menu error:", e);
    reply(`❌ Error generating bug menu`);
  }

});
