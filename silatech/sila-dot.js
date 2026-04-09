const { cmd } = require('../momy');
const config = require('../config');

// Define fakevCard 
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© SHINIGAMI-MD",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:SHINIGAMI MD BOT\nORG:SHINIGAMI-MD;\nTEL;type=CELL;type=VOICE;waid=554488138425:+554488138425\nEND:VCARD`
    }
  }
};

const getContextInfo = (sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363403408693274@newsletter',
            newsletterName: '© SHINIGAMI MD',
            serverMessageId: 143,
        },
    };
};

cmd({
    pattern: ".",
    alias: ["botlink", "free", "freebot", "whatsapp"],
    desc: "bot information",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender, pushname, myquoted }) => {
    try {
        const response = `SHINIGAMI MD BOT

BOT LINK:
https://shinigami-md-bot.onrender.com

CHANNEL: https://whatsapp.com/channel/0029VbC6It7K0IBkQwaKYd2J

COMMANDS:
Type .menu for commands

Powered By SHINIGAMI MD`;

        await conn.sendMessage(from, {
            image: { url: config.IMAGE_PATH || 'https://files.catbox.moe/xoac4l.jpg' },
            caption: response,
            contextInfo: getContextInfo(sender)
        }, { quoted: fakevCard });

    } catch (error) {
        console.error('Error in dot command:', error);
        
        // Fallback: send without image if image fails
        try {
            await conn.sendMessage(from, {
                text: response,
                contextInfo: getContextInfo(sender)
            }, { quoted: fakevCard });
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
        }
    }
});
