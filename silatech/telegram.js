const { cmd } = require('../momy');
const config = require('../config');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const Crypto = require('crypto');

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
// 📦 TELEGRAM — Download a Telegram sticker pack
// Usage: .telegram <sticker_pack_name>
// Example: .telegram Animals
// =================================================================
cmd({
    pattern: 'telegram',
    alias: ['tgsticker', 'tgstickerpack', 'tgpack'],
    react: '📦',
    desc: 'Download stickers from a Telegram sticker pack',
    category: 'general',
    use: '.telegram <sticker_pack_name>'
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(
`❌ Please provide a sticker pack name.

📖 *Usage:* .telegram <pack_name>

*Examples:*
• .telegram Animals
• .telegram PeppaHD
• .telegram Kirby

💡 The pack name is from the Telegram sticker pack URL:
   t.me/addstickers/*PackName*`
        );

        const TELEGRAM_TOKEN = config.TELEGRAM_BOT_TOKEN;
        if (!TELEGRAM_TOKEN) return reply('❌ Telegram bot token is not configured. Please set TELEGRAM_BOT_TOKEN in config.');

        await conn.sendPresenceUpdate('composing', from);
        await conn.sendMessage(from, { text: `🔍 Fetching sticker pack *${q}*...` }, { quoted: mek });

        // Get sticker set from Telegram API
        let stickerSet;
        try {
            const res = await axios.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getStickerSet`, {
                params: { name: q }
            });
            if (!res.data.ok) throw new Error(res.data.description || 'Pack not found');
            stickerSet = res.data.result;
        } catch (e) {
            return reply(`❌ Sticker pack *${q}* not found on Telegram.\n\nMake sure the pack name is correct (case-sensitive).`);
        }

        const stickers = stickerSet.stickers;
        const packTitle = stickerSet.title;
        const total = Math.min(stickers.length, 20); // Limit to 20 stickers per request

        await conn.sendMessage(from, {
            text: `📦 Found pack: *${packTitle}*\n🎭 Stickers: ${stickers.length}\n⬇️ Sending first ${total} stickers...`,
            contextInfo
        }, { quoted: mek });

        let sent = 0;
        for (let i = 0; i < total; i++) {
            try {
                const sticker = stickers[i];
                const fileId = sticker.file_id;

                // Get file path
                const fileRes = await axios.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile`, {
                    params: { file_id: fileId }
                });
                const filePath = fileRes.data.result.file_path;
                const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;

                // Download sticker
                const dlRes = await axios.get(fileUrl, { responseType: 'arraybuffer' });
                const stickerBuffer = Buffer.from(dlRes.data);

                // Send sticker to WhatsApp
                await conn.sendMessage(from, {
                    sticker: stickerBuffer,
                    contextInfo
                });

                sent++;
                // Small delay to avoid spam
                await new Promise(r => setTimeout(r, 400));
            } catch (err) {
                console.error(`Failed to send sticker ${i + 1}:`, err.message);
            }
        }

        await conn.sendMessage(from, {
            text: `✅ Done! Sent *${sent}/${total}* stickers from pack *${packTitle}*.\n\n${stickers.length > 20 ? `⚠️ Only first 20 stickers were sent (pack has ${stickers.length} total).` : ''}`,
            contextInfo
        }, { quoted: mek });

    } catch (e) {
        console.error('TELEGRAM STICKER ERROR:', e);
        reply('❌ Failed to fetch Telegram sticker pack: ' + e.message);
    }
});
