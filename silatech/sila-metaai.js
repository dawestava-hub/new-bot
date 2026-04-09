const { cmd, commands } = require('../momy');
const axios = require('axios');

// Define combined fakevCard 
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

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
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
    pattern: "metaai",
    alias: ["meta", "metabot", "mb"],
    react: "🧠",
    desc: "Ask MetaAI anything",
    category: "ai",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
    if (!q || !q.trim()) {
        return await conn.sendMessage(from, {
            text: `❌ Please ask a message

Example: .metaai What is artificial intelligence?`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fakevCard });
    }

    // Show typing indicator
    await conn.sendPresenceUpdate('composing', from);

    // Call MetaAI API
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/metaai?query=${encodeURIComponent(q.trim())}`);
    
    if (!response.data) {
        throw new Error('No response from API');
    }

    let aiResponse = response.data.response || response.data.result || response.data.data || JSON.stringify(response.data);

    // Truncate if too long
    if (aiResponse.length > 4096) {
        aiResponse = aiResponse.substring(0, 4090) + '...';
    }

    await conn.sendPresenceUpdate('paused', from);

    await conn.sendMessage(from, {
        text: `META AI

Answer:
${aiResponse}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);
    
    let errorMsg = '❌ MetaAI malfunctioning';
    
    if (e.response?.status === 429) {
        errorMsg = '❌ Rate limited. Try again later';
    } else if (e.response?.status === 500) {
        errorMsg = '❌ MetaAI server error';
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = '❌ Request timeout';
    }

    await conn.sendMessage(from, {
        text: errorMsg,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });
    l(e);
}
});
