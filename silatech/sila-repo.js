const { cmd } = require('../momy');
const axios = require('axios');

const REPO_IMAGE = 'https://files.catbox.moe/36vahk.png'; // You can replace with your OCTO MD logo if needed
const REPO_LINK = 'https://github.com/ARNOLDT20/OCTO-MD';

// Define combined fakevCard 
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© OCTO MD",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:OCTO MD BOT\nORG:OCTO MD;\nTEL;type=CELL;type=VOICE;waid=255627417402:+255627417402\nEND:VCARD`
    }
  }
};

// Utility function for formatted messages
function octoMessage(text) {
  return {
    text: text,
    contextInfo: {
      externalAdReply: {
        title: 'OCTO MD',
        body: 'GitHub Repository ‧ Verified',
        thumbnailUrl: REPO_IMAGE,
        sourceUrl: REPO_LINK,
        mediaUrl: REPO_IMAGE,
        renderLargerThumbnail: true,
        mediaType: 1
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363421014261315@newsletter',
        newsletterName: 'OCTO MD',
        serverMessageId: Math.floor(Math.random() * 1000000)
      },
      isForwarded: true,
      forwardingScore: 999
    }
  };
}

cmd({
  pattern: "repo",
  alias: ["repository", "github"],
  desc: "Get bot repository link",
  category: "main",
  react: "📦",
  filename: __filename
},
  async (conn, mek, m, { from, sender, reply }) => {
    try {
      // Fetch GitHub stats
      let stars = '⭐';
      let forks = '🔀';

      try {
        const response = await axios.get(REPO_LINK.replace('https://github.com', 'https://api.github.com/repos'));
        stars = response.data.stargazers_count || '⭐';
        forks = response.data.forks_count || '🔀';
      } catch (err) {
        console.log('Could not fetch GitHub stats');
      }

      const repoMessage =
        `┏━❑ OCTO MD GITHUB ━━━━━━━━━
┃ 📦 Repository: OCTO-MD
┃ 👨‍💻 Developer: BLAZE TECH
┃ 🔗 Link: ${REPO_LINK}
┃
┃ ⭐ Stars: ${stars}
┃ 🔀 Forks: ${forks}
┃
┃ 🛠️ Open Source WhatsApp Bot
┃ 💚 Made with ❤️ by BLAZE TECH
┗━━━━━━━━━━━━━━━━━━━━`;

      const messageData = octoMessage(repoMessage);

      await conn.sendMessage(from, messageData, { quoted: fakevCard });

    } catch (e) {
      reply("❌ Error: " + e.message);
    }
  });