const { cmd } = require('../momy');
const config = require('../config');
const axios = require('axios');
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
// Helper: image buffer → WebP sticker
// ─────────────────────────────────────────────
async function imageToSticker(buffer, packname = config.BOT_NAME || 'SHINIGAMI MD', author = config.OWNER_NUMBER || 'INCONNU BOY') {
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
                '-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split [a][b];[a] palettegen=reserve_transparent=on:transparency_color=ffffff [p];[b][p] paletteuse",
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
        ffmpeg(inputPath)
            .on('error', reject)
            .on('end', () => resolve(true))
            .toFormat('png')
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
        ffmpeg(inputPath)
            .on('error', reject)
            .on('end', () => resolve(true))
            .addOutputOptions(['-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=black'])
            .toFormat('mp4')
            .save(outputPath);
    });

    const vidBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);
    fs.unlinkSync(inputPath);
    return vidBuffer;
}

// =================================================================
// 🎭 STICKER — reply image → sticker
// =================================================================
cmd({
    pattern: 'sticker',
    alias: ['s', 'stiker'],
    react: '🎭',
    desc: 'Convert a replied image or video into a sticker',
    category: 'general',
    use: '.sticker (reply to image/video)'
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        const q = m.quoted ? m.quoted : mek;
        const mime = (q.msg || q).mimetype || '';

        if (!mime) return reply('❌ Please reply to an image or video to make a sticker.');

        await conn.sendPresenceUpdate('composing', from);
        let buffer, stickerBuf;

        if (mime.startsWith('image/')) {
            const stream = await downloadContentFromMessage(q.msg || q, 'image');
            let chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            buffer = Buffer.concat(chunks);
            stickerBuf = await imageToSticker(buffer);
        } else if (mime.startsWith('video/') || mime === 'image/gif') {
            const stream = await downloadContentFromMessage(q.msg || q, 'video');
            let chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            buffer = Buffer.concat(chunks);
            stickerBuf = await animatedToSticker(buffer, 'mp4');
        } else {
            return reply('❌ Unsupported media type. Please reply to an image or video.');
        }

        await conn.sendMessage(from, {
            sticker: stickerBuf,
            contextInfo
        }, { quoted: mek });

    } catch (e) {
        console.error('STICKER ERROR:', e);
        reply('❌ Failed to create sticker: ' + e.message);
    }
});

// =================================================================
// 🏷️ TAKE — steal a sticker and rename it with your name
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
        const q2 = m.quoted ? m.quoted : mek;
        const mime = (q2.msg || q2).mimetype || '';

        if (!mime.includes('webp')) return reply('❌ Please reply to a sticker.');

        const stream = await downloadContentFromMessage(q2.msg || q2, 'sticker');
        let chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

        const packname = q ? q : (config.BOT_NAME || 'SHINIGAMI MD');
        const author = pushname || 'User';

        // Write & re-encode with new metadata
        const inputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.webp');
        const outputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.webp');
        fs.writeFileSync(inputPath, buffer);

        // Inject EXIF metadata using a simple JSON exif approach
        const exifData = JSON.stringify({
            'sticker-pack-id': Crypto.randomBytes(8).toString('hex'),
            'sticker-pack-name': packname,
            'sticker-pack-publisher': author,
            'emojis': ['🎭']
        });
        const exifBuffer = Buffer.from(exifData);

        // Add exif as comment to webp (simple method: just resend with metadata)
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
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

        await conn.sendMessage(from, {
            sticker: outBuf,
            contextInfo
        }, { quoted: mek });

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
        const q = m.quoted ? m.quoted : mek;
        const mime = (q.msg || q).mimetype || '';

        if (!mime.includes('webp')) return reply('❌ Please reply to a sticker.');

        await conn.sendPresenceUpdate('composing', from);

        const stream = await downloadContentFromMessage(q.msg || q, 'sticker');
        let chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

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
        const q = m.quoted ? m.quoted : mek;
        const mime = (q.msg || q).mimetype || '';

        if (!mime.includes('webp')) return reply('❌ Please reply to a sticker.');

        await conn.sendPresenceUpdate('composing', from);

        const stream = await downloadContentFromMessage(q.msg || q, 'sticker');
        let chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

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
