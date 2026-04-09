const { cmd } = require('../momy');
const axios = require('axios');
const yts = require('yt-search');

const VIDEO_IMAGE = 'https://files.catbox.moe/xoac4l.jpg';

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
            vcard: `BEGIN:VCARD
VERSION:3.0
FN: SHINIGAMI MD
ORG:SHINIGAMI-MD;
TEL;type=CELL;type=VOICE;waid=554488138425:+554488138425
END:VCARD`
        }
    }
};

cmd({
    pattern: "video",
    alias: ["ytmp4", "mp4", "ytv", "shiniplay"],
    desc: "Download videos from YouTube",
    category: "download",
    react: "🎥",
    filename: __filename
},
    async (conn, mek, m, { from, sender, reply, q }) => {
        try {
            if (!q) {
                return reply(`┏━❑ VIDEO DOWNLOADER ━━━━━━━━━
┃ 🎥 DO YOU WANT TO DOWNLOAD A VIDEO?
┃
┃ TYPE: .video your video name
┃
┃ Example:
┃ .video Cristiano Ronaldo Goal
┗━━━━━━━━━━━━━━━━━━━━`);
            }

            const search = await yts(q);
            if (!search.videos.length) {
                return reply(`┏━❑ VIDEO SEARCH ━━━━━━━━━
┃ ❌ No Video Found
┃ 😔 Try Another Search
┗━━━━━━━━━━━━━━━━━━━━`);
            }

            const data = search.videos[0];
            const ytUrl = data.url;

            const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
            const { data: apiRes } = await axios.get(api);

            if (!apiRes?.status || !apiRes.result?.media?.video_url) {
                return reply(`┏━❑ VIDEO ERROR ━━━━━━━━━
┃ ❌ Video Download Failed
┃ Please Try Again
┗━━━━━━━━━━━━━━━━━━━━`);
            }

            const result = apiRes.result.media;

            const caption = `┏━❑ VIDEO PLAYER ━━━━━━━━━
┃ 🎬 Title: ${data.title}
┃
┃ 🔗 Link: ${data.url}
┃ 👀 Views: ${data.views}
┃ ⏱️ Time: ${data.timestamp}
┃
┃ Choose Your Version:
┃ 
┃ °1 Simple Video
┃ °2 File Video
┗━━━━━━━━━━━━━━━━━━━━`;

            const sentMsg = await conn.sendMessage(from, {
                image: { url: result.thumbnail },
                caption: caption
            }, { quoted: fakevCard });

            const messageID = sentMsg.key.id;

            const messageHandler = async (msgData) => {
                if (!msgData.messages) return;

                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message) return;

                const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
                const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                const senderID = receivedMsg.key.remoteJid;

                if (isReplyToBot && senderID === from) {
                    const choice = receivedText.trim();

                    try {
                        if (choice === "1") {

                            await conn.sendMessage(senderID, {
                                video: { url: result.video_url },
                                mimetype: "video/mp4",
                                caption: `🎬 ${data.title}\n\nDownloaded by shinigami-md`
                            }, { quoted: fakevCard });

                        } else if (choice === "2") {

                            await conn.sendMessage(senderID, {
                                document: { url: result.video_url },
                                mimetype: "video/mp4",
                                fileName: `${data.title}.mp4`,
                                caption: `🎬 ${data.title}\n\nDownloaded by Shinigami`
                            }, { quoted: fakevCard });

                        } else {

                            await conn.sendMessage(senderID, {
                                text: `┏━❑  SELECTION NUM ━━━━━━━━━
┃ ❌ Reply with °1 or °2
┗━━━━━━━━━━━━━━━━━━━━`
                            }, { quoted: fakevCard });

                        }

                    } catch (err) {
                        console.error("Video send error:", err.message);

                        await conn.sendMessage(senderID, {
                            text: `┏━❑ ERROR ━━━━━━━━━
┃ ❌ Failed to send video
┗━━━━━━━━━━━━━━━━━━━━`
                        }, { quoted: fakevCard });

                    }

                    conn.ev.off('messages.upsert', messageHandler);
                }
            };

            conn.ev.on('messages.upsert', messageHandler);

            setTimeout(() => {
                conn.ev.off('messages.upsert', messageHandler);
            }, 60000);

        } catch (error) {

            console.error('Video Error:', error.message);

            reply(`┏━❑ DOWNLOAD FAILED ━━━━━━━━━
┃ 😔 Video download failed
┃ Please try again
┗━━━━━━━━━━━━━━━━━━━━`);

        }
    });
