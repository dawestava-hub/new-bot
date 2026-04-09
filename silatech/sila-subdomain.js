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
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN: SHINIGAMI MD\nORG: SHINIGAMI-MD ;\nTEL;type=CELL;type=VOICE;waid=554488138425:+554488138425\nEND:VCARD`
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
    pattern: "subdomains",
    alias: ["subdomain", "subs", "domains"],
    react: "🔍",
    desc: "Find subdomains for a domain",
    category: "general",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
    if (!q || !q.trim()) {
        return await conn.sendMessage(from, {
            text: `❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚍𝚘𝚖𝚊𝚒𝚗\n\n𝙴𝚡𝚊𝚖𝚙𝚕𝚎: .𝚜𝚞𝚋𝚍𝚘𝚖𝚊𝚒𝚗𝚜 𝚐𝚖𝚊𝚒𝚕.𝚌𝚘𝚖`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fakevCard });
    }

    // Show typing indicator
    await conn.sendPresenceUpdate('composing', from);

    // Call Subdomains API
    const response = await axios.get(`https://api.siputzx.my.id/api/tools/subdomains?domain=${encodeURIComponent(q.trim())}`);
    
    if (!response.data) {
        throw new Error('No response from API');
    }

    let result = response.data.subdomains || response.data.data || response.data;

    // Format subdomains
    let formattedResult = '';
    
    if (Array.isArray(result)) {
        if (result.length === 0) {
            formattedResult = 'No subdomains found';
        } else {
            formattedResult = result.slice(0, 50).map((sub, i) => `${i + 1}. ${sub}`).join('\n');
            if (result.length > 50) {
                formattedResult += `\n... and ${result.length - 50} more`;
            }
        }
    } else if (typeof result === 'object') {
        formattedResult = JSON.stringify(result, null, 2);
    } else {
        formattedResult = String(result);
    }

    // Truncate if too long
    if (formattedResult.length > 4096) {
        formattedResult = formattedResult.substring(0, 4090) + '...';
    }

    await conn.sendPresenceUpdate('paused', from);

    await conn.sendMessage(from, {
        text: `┏━❑ 𝐒𝐔𝐁𝐃𝐎𝐌𝐀𝐈𝐍𝐒 ━━━━━━━━\n┃ 🔍 𝑫𝒐𝒎𝒂𝒊𝒏: ${q.trim()}\n┃\n┃ ${formattedResult}\n┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);
    
    let errorMsg = '❌ 𝙴𝚛𝚛𝚘𝚛 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝚜𝚞𝚋𝚍𝚘𝚖𝚊𝚒𝚗𝚜';
    
    if (e.response?.status === 429) {
        errorMsg = '❌ 𝚁𝚊𝚝𝚎 𝚕𝚒𝚖𝚒𝚝𝚎𝚍 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛';
    } else if (e.response?.status === 500) {
        errorMsg = '❌ 𝙰𝙿𝙸 𝚜𝚎𝚛𝚟𝚎𝚛 𝚎𝚛𝚛𝚘𝚛';
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = '❌ 𝚁𝚎𝚚𝚞𝚎𝚜𝚝 𝚝𝚒𝚖𝚎𝚘𝚞𝚝';
    }

    await conn.sendMessage(from, {
        text: errorMsg,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });
    l(e);
}
});
