const { cmd } = require('../momy');
const config = require('../config');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const Crypto = require('crypto');
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
// Reaction definitions
// ─────────────────────────────────────────────
const reactions = {
    cry:       { api: 'https://api.waifu.pics/sfw/cry',       emoji: '😢', action: 'is crying' },
    cuddle:    { api: 'https://api.waifu.pics/sfw/cuddle',    emoji: '🤗', action: 'cuddled' },
    bully:     { api: 'https://api.waifu.pics/sfw/bully',     emoji: '😈', action: 'is bullying' },
    hug:       { api: 'https://api.waifu.pics/sfw/hug',       emoji: '🤗', action: 'hugged' },
    awoo:      { api: 'https://api.waifu.pics/sfw/awoo',      emoji: '🐺', action: 'awoos at' },
    lick:      { api: 'https://api.waifu.pics/sfw/lick',      emoji: '👅', action: 'licked' },
    pat:       { api: 'https://api.waifu.pics/sfw/pat',       emoji: '🫂', action: 'patted' },
    smug:      { api: 'https://api.waifu.pics/sfw/smug',      emoji: '😏', action: 'is smug at' },
    bonk:      { api: 'https://api.waifu.pics/sfw/bonk',      emoji: '🔨', action: 'bonked' },
    yeet:      { api: 'https://api.waifu.pics/sfw/yeet',      emoji: '🔪', action: 'yeeted' },
    blush:     { api: 'https://api.waifu.pics/sfw/blush',     emoji: '😊', action: 'is blushing at' },
    handhold:  { api: 'https://api.waifu.pics/sfw/handhold',  emoji: '🤝', action: 'is holding hands with' },
    highfive:  { api: 'https://api.waifu.pics/sfw/highfive',  emoji: '✋', action: 'gave a high-five to' },
    nom:       { api: 'https://api.waifu.pics/sfw/nom',       emoji: '🍽️', action: 'is nomming' },
    wave:      { api: 'https://api.waifu.pics/sfw/wave',      emoji: '👋', action: 'waved at' },
    smile:     { api: 'https://api.waifu.pics/sfw/smile',     emoji: '😁', action: 'smiled at' },
    wink:      { api: 'https://api.waifu.pics/sfw/wink',      emoji: '😉', action: 'winked at' },
    happy:     { api: 'https://api.waifu.pics/sfw/happy',     emoji: '😊', action: 'is happy with' },
    glomp:     { api: 'https://api.waifu.pics/sfw/glomp',     emoji: '🤗', action: 'glomped' },
    bite:      { api: 'https://api.waifu.pics/sfw/bite',      emoji: '🦷', action: 'bit' },
    poke:      { api: 'https://api.waifu.pics/sfw/poke',      emoji: '👉', action: 'poked' },
    cringe:    { api: 'https://api.waifu.pics/sfw/cringe',    emoji: '😬', action: 'thinks' },
    dance:     { api: 'https://api.waifu.pics/sfw/dance',     emoji: '💃', action: 'danced with' },
    kill:      { api: 'https://api.waifu.pics/sfw/kill',      emoji: '🔪', action: 'killed' },
    slap:      { api: 'https://api.waifu.pics/sfw/slap',      emoji: '✊', action: 'slapped' },
    kiss:      { api: 'https://api.waifu.pics/sfw/kiss',      emoji: '💋', action: 'kissed' },
};

// ─────────────────────────────────────────────
// Helper: fetch GIF and convert to video buffer
// ─────────────────────────────────────────────
async function fetchGif(url) {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(res.data);
}

async function gifToVideo(gifBuffer) {
    const inputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.gif');
    const outputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.mp4');
    fs.writeFileSync(inputPath, gifBuffer);

    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .on('error', reject)
            .on('end', () => resolve(true))
            .addOutputOptions([
                '-movflags', 'faststart',
                '-pix_fmt', 'yuv420p',
                '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2'
            ])
            .toFormat('mp4')
            .save(outputPath);
    });

    const buf = fs.readFileSync(outputPath);
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
    return buf;
}

// ─────────────────────────────────────────────
// Shared function to send reaction GIF
// ─────────────────────────────────────────────
async function sendReactionGif(conn, mek, from, sender, reactionType) {
    try {
        // React with emoji
        await conn.sendMessage(from, { react: { text: reactionType.emoji, key: mek.key } });

        // Determine mentioned user
        const mentionedJid = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const quotedSender = mek.message?.extendedTextMessage?.contextInfo?.participant;
        const mentionedUser = mentionedJid || quotedSender;

        const senderTag = `@${sender.split('@')[0]}`;
        let caption;
        let mentionsList = [sender];

        const isGroup = from.endsWith('@g.us');

        if (mentionedUser) {
            const target = `@${mentionedUser.split('@')[0]}`;
            caption = `${senderTag} ${reactionType.action} ${target} ${reactionType.emoji}`;
            mentionsList.push(mentionedUser);
        } else if (isGroup) {
            caption = `${senderTag} ${reactionType.action} everyone! ${reactionType.emoji}`;
        } else {
            caption = `${senderTag} ${reactionType.action} ${reactionType.emoji}`;
        }

        // Fetch and convert GIF
        const res = await axios.get(reactionType.api);
        const gifUrl = res.data.url;
        const gifBuffer = await fetchGif(gifUrl);
        const videoBuffer = await gifToVideo(gifBuffer);

        await conn.sendMessage(from, {
            video: videoBuffer,
            caption: caption,
            gifPlayback: true,
            mentions: mentionsList.filter(Boolean),
            contextInfo
        }, { quoted: mek });

    } catch (error) {
        console.error('❌ Reaction error:', error);
        await conn.sendMessage(from, { text: '❌ Failed to send reaction GIF' }, { quoted: mek });
    }
}

// ─────────────────────────────────────────────
// Register all reactions as commands (.kiss, .hug, etc.)
// ─────────────────────────────────────────────
Object.keys(reactions).forEach((reactionName) => {
    const reactionType = reactions[reactionName];
    cmd({
        pattern: reactionName,
        react: reactionType.emoji,
        desc: `Send ${reactionName} reaction GIF`,
        category: 'fun',
        use: `.${reactionName} @mention`
    },
    async (conn, mek, m, { from, sender }) => {
        await sendReactionGif(conn, mek, from, sender, reactionType);
    });
});

// ─────────────────────────────────────────────
// Auto reaction: typing "kiss", "hug", etc. (without prefix)
// ─────────────────────────────────────────────
cmd({ on: 'body' },
async (conn, mek, m, { from, sender, body }) => {
    try {
        const text = (body || '').toLowerCase().trim();
        const reactionType = reactions[text];
        if (!reactionType) return;
        await sendReactionGif(conn, mek, from, sender, reactionType);
    } catch (e) {
        console.error('❌ Auto reaction error:', e);
    }
});
