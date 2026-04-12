const config = require('../config');
const { cmd, commands } = require('../momy');

// Function to convert text to plain uppercase
const toUpper = (str) => str.toUpperCase();

// =============================================================
// 📌 BUG MENU COMMAND - Affiche toutes les commandes de crash
// =============================================================
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
      const bugCommands = [
        // Inconnu Series
        { name: "inconnu-kill", alias: ["ikill", "inconnu"], desc: "Inconnu crash attack" },
        { name: "primis-kill", alias: ["pkill", "primis"], desc: "Primis crash attack" },
        { name: "sukuna-crash", alias: ["sukuna", "skrash"], desc: "Sukuna crash attack" },
        { name: "dyby-crash", alias: ["dyby", "dcrash"], desc: "Dyby crash attack" },
        { name: "ios-crash", alias: ["ios", "iphonecrash", "icrash"], desc: "iOS specific crash" },
        { name: "android-crash", alias: ["android", "droidcrash", "acrash"], desc: "Android specific crash" },
        { name: "ultimate-crash", alias: ["ucrash", "megacrash", "totalcrash"], desc: "Ultimate all-in-one crash" },
        { name: "dev-protection", alias: ["protected", "devlist"], desc: "Show protected numbers" }
      ];

      // Menu Header (same as your menu)
      let menu = `
╭━━━━━━━━━━━━━•
│ • BOT: SHINIGAMI MD
│ • USER: @${sender.split("@")[0]}
│ • PREFIX: ${prefix}
│ • TYPE: BUG/CRASH COMMANDS
│ • COMMANDS: ${bugCommands.length}
╰─────────────•\n`;

      // Group by category
      menu += `\n╭─  🔥 INCONNU SERIES\n`;
      menu += `│ • ${prefix}inconnu-kill (ikill, inconnu)\n`;
      menu += `│   └─ Inconnu crash attack\n`;
      menu += `╰───────────────⭓\n`;

      menu += `\n╭─  🔥 PRIMIS SERIES\n`;
      menu += `│ • ${prefix}primis-kill (pkill, primis)\n`;
      menu += `│   └─ Primis crash attack\n`;
      menu += `╰───────────────⭓\n`;

      menu += `\n╭─  ⚡ SUKUNA SERIES\n`;
      menu += `│ • ${prefix}sukuna-crash (sukuna, skrash)\n`;
      menu += `│   └─ Sukuna crash attack\n`;
      menu += `╰───────────────⭓\n`;

      menu += `\n╭─  ⚡ DYBY SERIES\n`;
      menu += `│ • ${prefix}dyby-crash (dyby, dcrash)\n`;
      menu += `│   └─ Dyby crash attack\n`;
      menu += `╰───────────────⭓\n`;

      menu += `\n╭─  📱 PLATFORM SPECIFIC\n`;
      menu += `│ • ${prefix}ios-crash (ios, iphonecrash, icrash)\n`;
      menu += `│   └─ iOS specific crash\n`;
      menu += `│ • ${prefix}android-crash (android, droidcrash, acrash)\n`;
      menu += `│   └─ Android specific crash\n`;
      menu += `╰───────────────⭓\n`;

      menu += `\n╭─  👑 ULTIMATE\n`;
      menu += `│ • ${prefix}ultimate-crash (ucrash, megacrash, totalcrash)\n`;
      menu += `│   └─ Ultimate all-in-one crash\n`;
      menu += `╰───────────────⭓\n`;

      menu += `\n╭─  🛡️ PROTECTION\n`;
      menu += `│ • ${prefix}dev-protection (protected, devlist)\n`;
      menu += `│   └─ Show protected numbers\n`;
      menu += `╰───────────────⭓\n`;

      // Footer (same as your menu)
      menu += `\n> POWERED BY SHINIGAMI MD`;

      // Send the Menu with image and context info (same as your menu)
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
