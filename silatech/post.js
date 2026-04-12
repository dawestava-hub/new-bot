const { cmd } = require('../momy');
const config = require('../config');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const Crypto = require('crypto');

// Helper: download media from quoted message using downloadContentFromMessage
async function downloadQuotedForStatus(quotedMsg, type) {
    const msgContent = quotedMsg[type + 'Message'];
    if (!msgContent) return null;
    const stream = await downloadContentFromMessage(msgContent, type);
    let chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks);
}

// Command To Status
cmd({
    pattern: "tostatus",
    alias: ["gstatus", "story", "uploadstory", "sendstatus"],
    desc: "Send message/image/video to WhatsApp Status",
    category: "general",
    react: "📢"
},
async (conn, mek, m, { from, q, sender, senderNumber, reply }) => {
    try {
        const quotedMsg = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!q && !quotedMsg) {
            return reply(
                `❌ *Please provide content to post on status*\n\n` +
                `Usage:\n` +
                `${config.PREFIX}tostatus *text message*\n` +
                `Or reply to image/video with ${config.PREFIX}tostatus`
            );
        }

        await conn.sendPresenceUpdate('composing', from);
        await conn.sendMessage(from, { react: { text: "📤", key: mek.key } });

        // ── IMAGE ────────────────────────────────────────────────────────────
        if (quotedMsg?.imageMessage) {
            const imgBuffer = await downloadQuotedForStatus(quotedMsg, 'image');
            if (!imgBuffer) return reply("❌ Failed to download image.");

            await conn.sendMessage("status@broadcast", {
                image: imgBuffer,
                caption: q || `📸 Posted by @${senderNumber}`,
                mentions: [sender]
            });
            reply('✅ *Image posted to status successfully*');

        // ── VIDEO ────────────────────────────────────────────────────────────
        } else if (quotedMsg?.videoMessage) {
            const vidBuffer = await downloadQuotedForStatus(quotedMsg, 'video');
            if (!vidBuffer) return reply("❌ Failed to download video.");

            await conn.sendMessage("status@broadcast", {
                video: vidBuffer,
                caption: q || `🎬 Posted by @${senderNumber}`,
                mentions: [sender]
            });
            reply('✅ *Video posted to status successfully*');

        // ── AUDIO ────────────────────────────────────────────────────────────
        } else if (quotedMsg?.audioMessage || quotedMsg?.ptvMessage) {
            const type = quotedMsg?.ptvMessage ? 'ptv' : 'audio';
            const audioBuffer = await downloadQuotedForStatus(quotedMsg, type);
            if (!audioBuffer) return reply("❌ Failed to download audio.");

            await conn.sendMessage("status@broadcast", {
                audio: audioBuffer,
                mimetype: "audio/mpeg",
                ptt: !!quotedMsg?.ptvMessage
            });
            reply('✅ *Audio posted to status successfully*');

        // ── STICKER ──────────────────────────────────────────────────────────
        } else if (quotedMsg?.stickerMessage) {
            const stickerBuffer = await downloadQuotedForStatus(quotedMsg, 'sticker');
            if (!stickerBuffer) return reply("❌ Failed to download sticker.");

            await conn.sendMessage("status@broadcast", {
                sticker: stickerBuffer
            });
            reply('✅ *Sticker posted to status successfully*');

        // ── TEXT ─────────────────────────────────────────────────────────────
        } else if (q) {
            await conn.sendMessage("status@broadcast", {
                text: q,
                backgroundColor: "#000000",
                font: 0
            });
            reply('✅ *Text posted to status successfully*');

        } else {
            reply('❌ *Unsupported media type or no text provided.*');
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error('tostatus Error:', e);
        reply(`❌ *Failed to post to status*\nError: ${e.message}`);
    }
});
