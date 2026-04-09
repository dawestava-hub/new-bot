const { cmd } = require('../momy');
const axios = require('axios');

const REPO_IMAGE = 'https://files.catbox.moe/xoac4l.jpg'; // You can replace with your SHINIGAMI MD logo if needed
const REPO_LINK = 'https://github.com/INCONNU-BOY/INCONNU-XD-V2'; // Replace with your actual repository link

// Define combined fakevCard 
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© SHINIGAMI MD",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:SHINIGAMI MD BOT\nORG:SHINIGAMI MD;\nTEL;type=CELL;type=VOICE;waid=554488138425:+554488138425\nEND:VCARD`
    }
  }
};

// Utility function for formatted messages - keeping contextInfo but removing design
function shinigamiMessage(text) {
  return {
    text: text,
    contextInfo: {
      externalAdReply: {
        title: 'SHINIGAMI MD',
        body: 'GitHub Repository ‧ Verified',
        thumbnailUrl: REPO_IMAGE,
        sourceUrl: REPO_LINK,
        mediaUrl: REPO_IMAGE,
        renderLargerThumbnail: true,
        mediaType: 1
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363403408693274@newsletter',
        newsletterName: 'SHINIGAMI MD',
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
  category: "general",
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

      const repoMessage = `SHINIGAMI MD GITHUB

Repository: SHINIGAMI-MD
Developer: BLAZE TECH
Link: ${REPO_LINK}

Stars: ${stars}
Forks: ${forks}

Open Source WhatsApp Bot
> MADE IN BY INCONNU BOY`;

      const messageData = shinigamiMessage(repoMessage);

      await conn.sendMessage(from, messageData, { quoted: fakevCard });

    } catch (e) {
      reply("❌ Error: " + e.message);
    }
  });
