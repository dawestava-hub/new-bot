const { cmd } = require('../momy');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const Crypto = require('crypto');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
        newsletterName: config.BOT_NAME || 'SHINIGAMI MD',
        serverMessageId: 13
    }
};

// ─────────────────────────────────────────────
// Helper: infer mime from Baileys mtype
// stickerMessage has no mimetype field → infer
// ─────────────────────────────────────────────
function inferMime(mtype, explicitMime) {
    if (explicitMime) return explicitMime;
    switch (mtype) {
        case 'stickerMessage':   return 'image/webp';
        case 'imageMessage':     return 'image/jpeg';
        case 'videoMessage':     return 'video/mp4';
        case 'audioMessage':     return 'audio/ogg';
        case 'documentMessage':  return 'application/octet-stream';
        default:                 return '';
    }
}

// ─────────────────────────────────────────────
// Helper: resolve quoted message from m or mek
// Returns { msg, mime, mtype, key } or null
// ─────────────────────────────────────────────
function resolveQuoted(m, mek) {
    // 1. Essayer m.quoted (construit par msg.js)
    if (m?.quoted?.mtype) {
        const rawMime = m.quoted.mimetype || m.quoted.msg?.mimetype || '';
        const mime = inferMime(m.quoted.mtype, rawMime);
        return { msg: m.quoted.msg, mime, mtype: m.quoted.mtype, key: m.quoted.key };
    }

    // 2. Fallback : toutes les sources possibles de contextInfo Baileys
    try {
        const ctx =
            mek.message?.extendedTextMessage?.contextInfo ||
            mek.message?.stickerMessage?.contextInfo ||
            mek.message?.imageMessage?.contextInfo ||
            mek.message?.videoMessage?.contextInfo ||
            mek.message?.documentMessage?.contextInfo ||
            mek.message?.buttonsResponseMessage?.contextInfo ||
            mek.message?.templateButtonReplyMessage?.contextInfo;

        if (ctx?.quotedMessage) {
            const qMsg = ctx.quotedMessage;
            const mtype = Object.keys(qMsg)[0];
            if (!mtype) return null;
            const msgContent = qMsg[mtype];
            if (!msgContent) return null;
            const rawMime = msgContent?.mimetype || '';
            const mime = inferMime(mtype, rawMime);
            const key = {
                remoteJid: mek.key.remoteJid,
                id: ctx.stanzaId,
                participant: ctx.participant || mek.key.participant,
                fromMe: false
            };
            return { msg: msgContent, mime, mtype, key };
        }
    } catch (e) {
        console.error('resolveQuoted error:', e);
    }
    return null;
}

// ─────────────────────────────────────────────
// Helper: image buffer → WebP sticker
// ─────────────────────────────────────────────
async function imageToSticker(buffer) {
    const inputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.jpg');
    const outputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.webp');
    fs.writeFileSync(inputPath, buffer);

    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .on('error', reject)
            .on('end', () => resolve(true))
            .addOutputOptions([
                '-vcodec', 'libwebp',
                '-vf', "scale='min(512,iw)':'min(512,ih)':force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0",
                '-loop', '0',
                '-preset', 'default',
                '-an',
                '-vsync', '0'
            ])
            .toFormat('webp')
            .save(outputPath);
    });

    const webpBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);
    fs.unlinkSync(inputPath);
    return webpBuffer;
}

// ─────────────────────────────────────────────
// Helper: animated GIF/video → WebP sticker
// ─────────────────────────────────────────────
async function animatedToSticker(buffer, ext = 'mp4') {
    const inputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.' + ext);
    const outputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.webp');
    fs.writeFileSync(inputPath, buffer);

    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .on('error', reject)
            .on('end', () => resolve(true))
            .addOutputOptions([
                '-vcodec', 'libwebp',
                "-vf", "scale='min(320,iw)':'min(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0",
                '-loop', '0',
                '-preset', 'default',
                '-an',
                '-vsync', '0'
            ])
            .toFormat('webp')
            .save(outputPath);
    });

    const webpBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);
    fs.unlinkSync(inputPath);
    return webpBuffer;
}

// ─────────────────────────────────────────────
// Helper: WebP sticker → PNG image
// ─────────────────────────────────────────────
async function stickerToImage(buffer) {
    const inputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.webp');
    const outputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.png');
    fs.writeFileSync(inputPath, buffer);

    await new Promise((resolve, reject) => {
        ffmpeg()
            .inputOptions(['-f', 'webp'])
            .input(inputPath)
            .on('error', reject)
            .on('end', () => resolve(true))
            .outputOptions([
                '-vcodec', 'png',
                '-vframes', '1'
            ])
            .toFormat('image2')
            .save(outputPath);
    });

    const imgBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);
    fs.unlinkSync(inputPath);
    return imgBuffer;
}

// ─────────────────────────────────────────────
// Helper: Animated WebP sticker → MP4 video
// ─────────────────────────────────────────────
async function stickerToVideo(buffer) {
    const inputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.webp');
    const outputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.mp4');
    fs.writeFileSync(inputPath, buffer);

    await new Promise((resolve, reject) => {
        ffmpeg()
            .inputOptions(['-f', 'webp'])
            .input(inputPath)
            .on('error', reject)
            .on('end', () => resolve(true))
            .outputOptions([
                '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=black',
                '-c:v', 'libx264',
                '-pix_fmt', 'yuv420p',
                '-movflags', '+faststart',
                '-r', '15'
            ])
            .toFormat('mp4')
            .save(outputPath);
    });

    const vidBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);
    fs.unlinkSync(inputPath);
    return vidBuffer;
}

// ─────────────────────────────────────────────
// Helper: download media from resolved quoted
// ─────────────────────────────────────────────
async function downloadQuotedMedia(resolved) {
    // Build the message object that downloadContentFromMessage expects
    const mediaType = resolved.mtype.replace('Message', '');
    const mediaMsg = resolved.msg;
    const stream = await downloadContentFromMessage(mediaMsg, mediaType);
    let chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks);
}

// =================================================================
// 🎭 STICKER — reply image/video → sticker
// =================================================================
cmd({
    pattern: 'sticker',
    alias: ['s', 'stiker'],
    react: '🎭',
    desc: 'Convert a replied image or video into a sticker',
    category: 'general',
    use: '.sticker (reply to image/video)'
},
async (conn, mek, m, { from, reply }) => {
    try {
        const resolved = resolveQuoted(m, mek);

        if (!resolved || !resolved.mime) {
            return reply('❌ Please reply to an image or video to make a sticker.');
        }

        const { mime } = resolved;

        if (!mime.startsWith('image/') && !mime.startsWith('video/')) {
            return reply('❌ Please reply to an image or video to make a sticker.');
        }

        await conn.sendPresenceUpdate('composing', from);
        const buffer = await downloadQuotedMedia(resolved);
        let stickerBuf;

        if (mime.startsWith('image/') && !mime.includes('gif')) {
            stickerBuf = await imageToSticker(buffer);
        } else {
            stickerBuf = await animatedToSticker(buffer, 'mp4');
        }

        await conn.sendMessage(from, { sticker: stickerBuf, contextInfo }, { quoted: mek });

    } catch (e) {
        console.error('STICKER ERROR:', e);
        reply('❌ Failed to create sticker: ' + e.message);
    }
});

// =================================================================
// 🏷️ TAKE — steal a sticker and rename it
// =================================================================
cmd({
    pattern: 'take',
    alias: ['steal', 'takesticker'],
    react: '🏷️',
    desc: 'Take a sticker and add your name as pack/author',
    category: 'general',
    use: '.take [pack name] (reply to sticker)'
},
async (conn, mek, m, { from, q, pushname, reply }) => {
    try {
        const resolved = resolveQuoted(m, mek);

        if (!resolved || !resolved.mime.includes('webp')) {
            return reply('❌ Reply to a sticker to use .take\n\nExample: Reply to a sticker with .take MyPack');
        }

        const buffer = await downloadQuotedMedia(resolved);
        if (!buffer || buffer.length === 0) return reply('❌ Failed to download the sticker. Try again.');

        const packname = q ? q : (config.BOT_NAME || 'SHINIGAMI MD');
        const author = pushname || 'User';

        const inputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.webp');
        const outputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.webp');
        fs.writeFileSync(inputPath, buffer);

        await new Promise((resolve, reject) => {
            ffmpeg()
                .inputOptions(['-f', 'webp'])
                .input(inputPath)
                .on('error', reject)
                .on('end', () => resolve(true))
                .addOutputOptions([
                    '-vcodec', 'libwebp',
                    '-loop', '0',
                    '-preset', 'default',
                    '-an',
                    '-vsync', '0'
                ])
                .toFormat('webp')
                .save(outputPath);
        });

        const outBuf = fs.readFileSync(outputPath);
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

        await conn.sendMessage(from, { sticker: outBuf, contextInfo }, { quoted: mek });
        reply(`✅ Sticker taken!\n📦 Pack: *${packname}*\n✍️ Author: *${author}*`);

    } catch (e) {
        console.error('TAKE ERROR:', e);
        reply('❌ Failed to take sticker: ' + e.message);
    }
});

// =================================================================
// 🖼️ TOIMAGE — convert sticker to image
// =================================================================
cmd({
    pattern: 'toimage',
    alias: ['stickertoimg', 'webptoimg', 'stimg'],
    react: '🖼️',
    desc: 'Convert a sticker into an image',
    category: 'general',
    use: '.toimage (reply to sticker)'
},
async (conn, mek, m, { from, reply }) => {
    try {
        const resolved = resolveQuoted(m, mek);

        if (!resolved || !resolved.mime.includes('webp')) {
            return reply('❌ Please reply to a sticker.');
        }

        await conn.sendPresenceUpdate('composing', from);
        const buffer = await downloadQuotedMedia(resolved);
        if (!buffer || buffer.length === 0) return reply('❌ Failed to download the sticker. Try again.');
        const imgBuffer = await stickerToImage(buffer);

        await conn.sendMessage(from, {
            image: imgBuffer,
            caption: '🖼️ Here is your image!',
            contextInfo
        }, { quoted: mek });

    } catch (e) {
        console.error('TOIMAGE ERROR:', e);
        reply('❌ Failed to convert sticker to image: ' + e.message);
    }
});

// =================================================================
// 🎬 TOVIDEO — convert animated sticker to video
// =================================================================
cmd({
    pattern: 'tovideo',
    alias: ['stickertovid', 'webptovid', 'stvid'],
    react: '🎬',
    desc: 'Convert an animated sticker into a video',
    category: 'general',
    use: '.tovideo (reply to animated sticker)'
},
async (conn, mek, m, { from, reply }) => {
    try {
        const resolved = resolveQuoted(m, mek);

        if (!resolved || !resolved.mime.includes('webp')) {
            return reply('❌ Please reply to a sticker.');
        }

        await conn.sendPresenceUpdate('composing', from);
        const buffer = await downloadQuotedMedia(resolved);
        if (!buffer || buffer.length === 0) return reply('❌ Failed to download the sticker. Try again.');
        const vidBuffer = await stickerToVideo(buffer);

        await conn.sendMessage(from, {
            video: vidBuffer,
            caption: '🎬 Here is your video!',
            gifPlayback: false,
            contextInfo
        }, { quoted: mek });

    } catch (e) {
        console.error('TOVIDEO ERROR:', e);
        reply('❌ Failed to convert sticker to video: ' + e.message);
    }
});
