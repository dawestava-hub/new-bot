const { cmd } = require('../momy');
const config = require('../config');

const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
        newsletterName: config.BOT_NAME || 'SHINIGAMI MD',
        serverMessageId: 13
    }
};

// =================================================================
// 📸 GETPP — Get someone's WhatsApp profile picture
// =================================================================
cmd({
    pattern: 'getpp',
    alias: ['pp', 'profilepic', 'pfp'],
    react: '📸',
    desc: "Get someone's profile picture",
    category: 'general',
    use: '.getpp @mention / .getpp (reply to a message)'
},
async (conn, mek, m, { from, sender, quoted, args, isGroup, participants, reply }) => {
    try {
        await conn.sendPresenceUpdate('composing', from);

        let targetJid;

        // Priority 1: mentioned user
        const mentionedJid = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
            || mek.message?.imageMessage?.contextInfo?.mentionedJid?.[0];

        if (mentionedJid) {
            targetJid = mentionedJid;
        }
        // Priority 2: quoted message sender
        else if (m.quoted) {
            targetJid = m.quoted.sender || m.quoted.key?.participant || m.quoted.key?.remoteJid;
        }
        // Priority 3: argument phone number
        else if (args[0]) {
            const num = args[0].replace(/[^0-9]/g, '');
            targetJid = num + '@s.whatsapp.net';
        }
        // Priority 4: sender themselves
        else {
            targetJid = sender;
        }

        if (!targetJid) return reply('❌ Could not determine target. Please mention someone or reply to their message.');

        // Normalize JID
        if (!targetJid.includes('@')) targetJid = targetJid + '@s.whatsapp.net';

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(targetJid, 'image');
        } catch {
            ppUrl = null;
        }

        const displayNumber = targetJid.split('@')[0];
        const caption =
`╭━━━━━━━━━━━━━━━━━╮
│  📸 *PROFILE PICTURE*
│
│  📱 *Number:* +${displayNumber}
╰━━━━━━━━━━━━━━━━━╯
> ${config.BOT_FOOTER || '© MADE IN BY INCONNU BOY'}`;

        if (ppUrl) {
            await conn.sendMessage(from, {
                image: { url: ppUrl },
                caption,
                contextInfo
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, {
                text: `❌ No profile picture found for +${displayNumber}.\nThis user may have hidden their photo or does not have one.`,
                contextInfo
            }, { quoted: mek });
        }

    } catch (e) {
        console.error('GETPP ERROR:', e);
        reply('❌ Failed to fetch profile picture: ' + e.message);
    }
});
