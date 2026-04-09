const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    jidNormalizedUser,
    Browsers,
    DisconnectReason,
    jidDecode,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    downloadContentFromMessage,
    getContentType
} = require('@whiskeysockets/baileys');

const config = require('./config');
const events = require('./momy');
const { sms } = require('./lib/msg');
const {
    connectdb,
    saveSessionToMongoDB,
    getSessionFromMongoDB,
    deleteSessionFromMongoDB,
    getUserConfigFromMongoDB,
    updateUserConfigInMongoDB,
    addNumberToMongoDB,
    removeNumberFromMongoDB,
    getAllNumbersFromMongoDB,
    saveOTPToMongoDB,
    verifyOTPFromMongoDB,
    incrementStats,
    getStatsForNumber
} = require('./lib/database');
const { handleAntidelete } = require('./lib/antidelete');
const { handleAntilink } = require('./lib/antilink');

const express = require('express');
const fs = require('fs-extra');
const pino = require('pino');
const crypto = require('crypto');
const FileType = require('file-type');
const axios = require('axios');
const bodyparser = require('body-parser');
const moment = require('moment-timezone');

const prefix = config.PREFIX;
const mode = config.MODE;
const router = express.Router();

const path = require('path');

// ==============================================================================
// 1. INITIALIZATION & DATABASE
// ==============================================================================

connectdb();

const activeSockets = new Map();
const socketCreationTime = new Map();

// Manual store implementation
const store = {
    bind: (ev) => {
        // Empty function
        console.log('📦 Store bound');
    },
    loadMessage: async (jid, id) => {
        return undefined;
    }
};

const createSerial = (size) => {
    return crypto.randomBytes(size).toString('hex').slice(0, size);
}

const getGroupAdmins = (participants) => {
    let admins = [];
    for (let i of participants) {
        if (i.admin == null) continue;
        admins.push(i.id);
    }
    return admins;
}

// ==============================================================================
// AUTO FOLLOW NEWSLETTERS
// ==============================================================================
async function autoFollowNewsletters(conn) {
    try {
        console.log('📰 AUTO-FOLLOW CHANNELS...');

        // === CHANNELS TO FOLLOW ===
        const channelsToFollow = [
            {
                jid: "120363421014261315@newsletter",
                name: "Channel 1"
            },
            {
                jid: "120363420222821450@newsletter",
                name: "Channel 2"
            },
            {
                jid: "120363424512102809@newsletter",
                name: "Channel 3 (Your Channel)"
            }
        ];

        console.log(`📊 Found ${channelsToFollow.length} channels to follow`);

        // Follow each channel one by one
        for (const channel of channelsToFollow) {
            try {
                console.log(`🔄 Attempting to follow: ${channel.name} (${channel.jid})`);

                if (typeof conn.newsletterFollow === 'function') {
                    try {
                        await conn.newsletterFollow(channel.jid);
                        console.log(`✅ Successfully followed channel via newsletterFollow: ${channel.name}`);
                        await delay(1000);
                        continue;
                    } catch (followErr) {
                        console.log(`⚠️ newsletterFollow failed: ${followErr.message}`);
                    }
                }

                await conn.sendPresenceUpdate('available', channel.jid);
                console.log(`✅ Sent presence update to: ${channel.name}`);
                await delay(1000);

            } catch (error) {
                console.log(`⚠️ Error following ${channel.name}: ${error.message}`);
            }
        }

        // ======================================================================
        // AUTO-JOIN GROUPS FROM CONFIG
        // ======================================================================
        console.log('👥 AUTO-JOIN GROUPS...');

        const joinGroup = async (groupLink, groupName) => {
            try {
                if (!groupLink || groupLink.trim() === '') {
                    console.log(`⚠️ Empty group link for ${groupName}`);
                    return null;
                }

                const inviteCode = groupLink.split('/').pop();
                if (!inviteCode) {
                    console.log(`⚠️ Invalid group link: ${groupLink}`);
                    return null;
                }

                console.log(`🔄 Attempting to join group: ${groupName || inviteCode}`);

                // JOIN GROUP - NO HELLO MESSAGE
                const response = await conn.groupAcceptInvite(inviteCode);
                console.log(`✅ Successfully joined group: ${groupName || inviteCode}`);

                // NO MESSAGE SENT AFTER JOINING GROUP

                return response;
            } catch (error) {
                console.log(`❌ Failed to join group ${groupName || 'unknown'}: ${error.message}`);
                return null;
            }
        };

        // Join group 1
        if (config.GROUP_LINK_1 && config.GROUP_LINK_1.trim() !== '') {
            await joinGroup(config.GROUP_LINK_1, "Group 1");
            await delay(1000);
        }

        // Join group 2
        if (config.GROUP_LINK_2 && config.GROUP_LINK_2.trim() !== '') {
            await joinGroup(config.GROUP_LINK_2, "Group 2");
            await delay(1000);
        }

        console.log('🎉 AUTO-FOLLOW AND AUTO-JOIN COMPLETED!');

    } catch (error) {
        console.error('❌ Error in auto-follow function:', error.message);
    }
}

// ==============================================================================
// AUTO UPDATE BIO FUNCTION
// ==============================================================================
async function autoUpdateBio(conn, number) {
    try {
        if (config.AUTO_BIO === 'true' && config.BIO_LIST && config.BIO_LIST.length > 0) {
            const bioList = config.BIO_LIST;
            let currentIndex = 0;

            const isConnectionActive = () => {
                const sanitizedNumber = number.replace(/[^0-9]/g, '');
                return activeSockets.has(sanitizedNumber) && conn.user && conn.user.id;
            };

            const updateBio = async () => {
                try {
                    if (!isConnectionActive()) {
                        console.log(`⚠️ Skipping bio update - connection closed for ${number}`);
                        return;
                    }

                    const bioText = bioList[currentIndex];

                    if (!conn.user || !conn.user.id) {
                        console.log(`⚠️ Skipping bio update - no user data for ${number}`);
                        return;
                    }

                    await conn.updateProfileStatus(bioText);
                    console.log(`📝 Updated bio for ${number}: ${bioText}`);

                    currentIndex = (currentIndex + 1) % bioList.length;
                } catch (error) {
                    console.error(`❌ Error updating bio for ${number}:`, error.message);
                    currentIndex = (currentIndex + 1) % bioList.length;
                }
            };

            if (isConnectionActive()) {
                await updateBio();
            }

            const bioInterval = setInterval(() => {
                if (isConnectionActive()) {
                    updateBio();
                } else {
                    console.log(`🔌 Stopping bio update for ${number} - connection lost`);
                    clearInterval(bioInterval);
                }
            }, 30 * 60 * 1000);

            const sanitizedNumber = number.replace(/[^0-9]/g, '');
            if (!global.bioIntervals) global.bioIntervals = {};
            global.bioIntervals[sanitizedNumber] = bioInterval;
        }
    } catch (error) {
        console.error(`❌ Error in auto-bio function for ${number}:`, error.message);
    }
}

function cleanupBioInterval(number) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    if (global.bioIntervals && global.bioIntervals[sanitizedNumber]) {
        clearInterval(global.bioIntervals[sanitizedNumber]);
        delete global.bioIntervals[sanitizedNumber];
        console.log(`🧹 Cleaned up bio interval for ${number}`);
    }
}

function isNumberAlreadyConnected(number) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    return activeSockets.has(sanitizedNumber);
}

function getConnectionStatus(number) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const isConnected = activeSockets.has(sanitizedNumber);
    const connectionTime = socketCreationTime.get(sanitizedNumber);

    return {
        isConnected,
        connectionTime: connectionTime ? new Date(connectionTime).toLocaleString() : null,
        uptime: connectionTime ? Math.floor((Date.now() - connectionTime) / 1000) : 0
    };
}

// Load plugins
const pluginsDir = path.join(__dirname, 'plugins');
if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
}

const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
console.log(`📦 Loading ${files.length} plugins...`);
for (const file of files) {
    try {
        require(path.join(pluginsDir, file));
    } catch (e) {
        console.error(`❌ Failed to load plugin ${file}:`, e);
    }
}

// Function for AI reply to status
async function generateAIResponse(text) {
    try {
        if (!text || text.trim() === '') {
            return "I saw your status, but it has no text. 😊";
        }

        const apiUrl = `https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(text.trim())}`;
        console.log(`🤖 AI API: ${apiUrl.substring(0, 50)}...`);

        const response = await axios.get(apiUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.data && response.data.result) {
            return response.data.result;
        } else if (response.data && response.data.text) {
            return response.data.text;
        } else if (response.data && typeof response.data === 'string') {
            return response.data;
        } else {
            return "I understand your status! Thanks for sharing. 😊";
        }
    } catch (error) {
        console.error(`❌ AI API error: ${error.message}`);
        const lowerText = text.toLowerCase();

        if (lowerText.includes('happy') || lowerText.includes('furaha')) {
            return "I'm happy for you! 😊🎉";
        } else if (lowerText.includes('sad') || lowerText.includes('huzuni')) {
            return "I'm sorry, I hope you find comfort. 💔";
        } else if (lowerText.includes('love') || lowerText.includes('upendo')) {
            return "Love is beautiful! ❤️";
        } else if (lowerText.includes('morning') || lowerText.includes('asubuhi')) {
            return "Good morning! ☀️";
        } else if (lowerText.includes('night') || lowerText.includes('usiku')) {
            return "Sleep well! 🌙";
        } else {
            return "I saw your status, thanks for sharing! 👍";
        }
    }
}

// ==============================================================================
// 2. SPECIFIC HANDLERS
// ==============================================================================

async function setupMessageHandlers(socket, number) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

        const userConfig = await getUserConfigFromMongoDB(number);

        if (userConfig.AUTO_TYPING === 'true') {
            try {
                await socket.sendPresenceUpdate('composing', msg.key.remoteJid);
            } catch (error) {
                console.error(`Failed to set typing presence:`, error);
            }
        }

        if (userConfig.AUTO_RECORDING === 'true') {
            try {
                await socket.sendPresenceUpdate('recording', msg.key.remoteJid);
            } catch (error) {
                console.error(`Failed to set recording presence:`, error);
            }
        }
    });
}

async function setupCallHandlers(socket, number) {
    socket.ev.on('call', async (calls) => {
        try {
            const userConfig = await getUserConfigFromMongoDB(number);
            if (userConfig.ANTI_CALL !== 'true') return;

            for (const call of calls) {
                if (call.status !== 'offer') continue;
                const id = call.id;
                const from = call.from;

                await socket.rejectCall(id, from);
                await socket.sendMessage(from, {
                    text: userConfig.REJECT_MSG || 'Please dont call me! 😊'
                });
                console.log(`📞 Call rejected for ${number} from ${from}`);
            }
        } catch (err) {
            console.error(`Anti-call error for ${number}:`, err);
        }
    });
}

function setupAutoRestart(socket, number) {
    let restartAttempts = 0;
    const maxRestartAttempts = 3;

    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        console.log(`Connection update for ${number}:`, { connection, lastDisconnect });

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const errorMessage = lastDisconnect?.error?.message;

            console.log(`Connection closed for ${number}:`, {
                statusCode,
                errorMessage,
                isManualUnlink: statusCode === 401
            });

            cleanupBioInterval(number);

            if (statusCode === 401 || errorMessage?.includes('401')) {
                console.log(`🔐 Manual unlink detected for ${number}, cleaning up...`);
                const sanitizedNumber = number.replace(/[^0-9]/g, '');

                activeSockets.delete(sanitizedNumber);
                socketCreationTime.delete(sanitizedNumber);
                await deleteSessionFromMongoDB(sanitizedNumber);
                await removeNumberFromMongoDB(sanitizedNumber);

                socket.ev.removeAllListeners();
                return;
            }

            const isNormalError = statusCode === 408 ||
                errorMessage?.includes('QR refs attempts ended');

            if (isNormalError) {
                console.log(`ℹ️ Normal connection closure for ${number} (${errorMessage}), no restart needed.`);
                return;
            }

            if (restartAttempts < maxRestartAttempts) {
                restartAttempts++;
                console.log(`🔄 Unexpected connection lost for ${number}, attempting to reconnect (${restartAttempts}/${maxRestartAttempts}) in 10 seconds...`);

                const sanitizedNumber = number.replace(/[^0-9]/g, '');
                activeSockets.delete(sanitizedNumber);
                socketCreationTime.delete(sanitizedNumber);

                socket.ev.removeAllListeners();

                await delay(10000);

                try {
                    const mockRes = {
                        headersSent: false,
                        send: () => { },
                        status: () => mockRes,
                        setHeader: () => { },
                        json: () => { }
                    };
                    await startBot(number, mockRes);
                    console.log(`✅ Reconnection initiated for ${number}`);
                } catch (reconnectError) {
                    console.error(`❌ Reconnection failed for ${number}:`, reconnectError);
                }
            } else {
                console.log(`❌ Max restart attempts reached for ${number}. Manual intervention required.`);
            }
        }

        if (connection === 'open') {
            console.log(`✅ Connection established for ${number}`);
            restartAttempts = 0;
        }
    });
}

// ==============================================================================
// 3. MAIN STARTBOT FUNCTION
// ==============================================================================

async function startBot(number, res = null) {
    let connectionLockKey;
    const sanitizedNumber = number.replace(/[^0-9]/g, '');

    try {
        const sessionDir = path.join(__dirname, 'session', `session_${sanitizedNumber}`);

        if (isNumberAlreadyConnected(sanitizedNumber)) {
            console.log(`⏩ ${sanitizedNumber} is already connected, skipping...`);
            const status = getConnectionStatus(sanitizedNumber);

            if (res && !res.headersSent) {
                return res.json({
                    status: 'already_connected',
                    message: 'Number is already connected and active',
                    connectionTime: status.connectionTime,
                    uptime: `${status.uptime} seconds`
                });
            }
            return;
        }

        connectionLockKey = `connecting_${sanitizedNumber}`;
        if (global[connectionLockKey]) {
            console.log(`⏩ ${sanitizedNumber} is already in connection process, skipping...`);
            if (res && !res.headersSent) {
                return res.json({
                    status: 'connection_in_progress',
                    message: 'Number is currently being connected'
                });
            }
            return;
        }
        global[connectionLockKey] = true;

        const existingSession = await getSessionFromMongoDB(sanitizedNumber);

        if (!existingSession) {
            console.log(`🧹 No MongoDB session found for ${sanitizedNumber} - requiring NEW pairing`);

            if (fs.existsSync(sessionDir)) {
                await fs.remove(sessionDir);
                console.log(`🗑️ Cleaned leftover local session for ${sanitizedNumber}`);
            }
        } else {
            fs.ensureDirSync(sessionDir);
            fs.writeFileSync(path.join(sessionDir, 'creds.json'), JSON.stringify(existingSession, null, 2));
            console.log(`🔄 Restored existing session from MongoDB for ${sanitizedNumber}`);
        }

        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        const conn = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
            },
            printQRInTerminal: false,
            usePairingCode: !existingSession,
            logger: pino({ level: 'silent' }),
            browser: Browsers.macOS('Safari'),
            syncFullHistory: false,
            getMessage: async (key) => {
                return { conversation: 'Hello' };
            }
        });

        socketCreationTime.set(sanitizedNumber, Date.now());
        activeSockets.set(sanitizedNumber, conn);

        store.bind(conn.ev);

        setupMessageHandlers(conn, number);
        setupCallHandlers(conn, number);
        setupAutoRestart(conn, number);

        conn.decodeJid = jid => {
            if (!jid) return jid;
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {};
                return (decode.user && decode.server && decode.user + '@' + decode.server) || jid;
            } else return jid;
        };

        conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
            let quoted = message.msg ? message.msg : message;
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await downloadContentFromMessage(quoted, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            let type = await FileType.fromBuffer(buffer);
            let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };

        if (!existingSession) {
            setTimeout(async () => {
                try {
                    await delay(1500);
                    const code = await conn.requestPairingCode(sanitizedNumber);
                    console.log(`🔑 Pairing Code: ${code}`);
                    if (res && !res.headersSent) {
                        return res.json({
                            code: code,
                            status: 'new_pairing',
                            message: 'New pairing required'
                        });
                    }
                } catch (err) {
                    console.error('❌ Pairing Error:', err.message);
                    if (res && !res.headersSent) {
                        return res.json({
                            error: 'Failed to generate pairing code',
                            details: err.message
                        });
                    }
                }
            }, 3000);
        } else if (res && !res.headersSent) {
            res.json({
                status: 'reconnecting',
                message: 'Attempting to reconnect with existing session data'
            });
        }

        conn.ev.on('creds.update', async () => {
            await saveCreds();
            const fileContent = fs.readFileSync(path.join(sessionDir, 'creds.json'), 'utf8');
            const creds = JSON.parse(fileContent);

            await saveSessionToMongoDB(sanitizedNumber, creds);
            console.log(`💾 Session updated in MongoDB for ${sanitizedNumber}`);
        });

        conn.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'open') {
                console.log(`✅ Connected: ${sanitizedNumber}`);
                const userJid = jidNormalizedUser(conn.user.id);

                await addNumberToMongoDB(sanitizedNumber);

                setTimeout(async () => {
                    try {
                        await autoFollowNewsletters(conn);
                        await autoUpdateBio(conn, number);
                    } catch (error) {
                        console.error('❌ Error in auto-follow or bio update:', error.message);
                    }
                }, 5000);

                console.log(`🎉 ${sanitizedNumber} successfully connected!`);
            }

            if (connection === 'close') {
                let reason = lastDisconnect?.error?.output?.statusCode;
                if (reason === DisconnectReason.loggedOut) {
                    console.log(`❌ Session closed: Logged Out.`);
                    cleanupBioInterval(number);
                }
            }
        });

        conn.ev.on('call', async (calls) => {
            try {
                const userConfig = await getUserConfigFromMongoDB(number);
                if (userConfig.ANTI_CALL !== 'true') return;

                for (const call of calls) {
                    if (call.status !== 'offer') continue;
                    const id = call.id;
                    const from = call.from;
                    await conn.rejectCall(id, from);
                    await conn.sendMessage(from, {
                        text: userConfig.REJECT_MSG || 'Please dont call me! 😊'
                    });
                }
            } catch (err) {
                console.error("Anti-call error:", err);
            }
        });

        conn.ev.on('messages.update', async (updates) => {
            await handleAntidelete(conn, updates, store);
        });

        // ===============================================================
        // 📥 MESSAGE HANDLER (UPSERT)
        // ===============================================================
        conn.ev.on('messages.upsert', async (msg) => {
            try {
                let mek = msg.messages[0];
                if (!mek.message) return;

                const userConfig = await getUserConfigFromMongoDB(number);

                // Normalize Message
                mek.message = (getContentType(mek.message) === 'ephemeralMessage')
                    ? mek.message.ephemeralMessage.message
                    : mek.message;

                if (mek.message.viewOnceMessageV2) {
                    mek.message = (getContentType(mek.message) === 'ephemeralMessage')
                        ? mek.message.ephemeralMessage.message
                        : mek.message;
                }

                // Auto Read
                if (userConfig.READ_MESSAGE === 'true') {
                    await conn.readMessages([mek.key]);
                }

                // AUTO-REPLY HANDLER
                if (mek.message?.conversation || mek.message?.extendedTextMessage?.text) {
                    const messageText = (mek.message.conversation || mek.message.extendedTextMessage?.text || '').toLowerCase().trim();

                    const autoReplies = config.AUTO_REPLIES || {};

                    const customReplies = {
                        "mambo": "Good! 👋 How can I help you?",
                        "salam": "Wa alaikum salaam! 💫",
                        "vip": "Hello VIP! 👑 How can I assist you?",
                        "mkuu": "Hey boss! 👋 How can I help you?",
                        "boss": "Yes boss! 👑 How can I help you?",
                        "habari": "Good! 👋 How are you?",
                        "bot": "Yes, I am Shinigami MD! 🤖 How can I assist you?",
                        "menu": "Type .menu to see all commands! 📜",
                        "owner": "Contact owner using .owner command 👑",
                        "thanks": "You're welcome! 😊",
                        "thank you": "Anytime! Let me know if you need help 🤖",
                        "asante": "You're welcome! 😊",
                        "poa": "Good! 👋",
                        "mghani": "Hey friend! 💫 How are you?",
                        "shikamo": "Shikamo! 🤝",
                        "safi": "Very good! 👍",
                        "chao": "Bye! 👋 Goodbye!",
                        "bye": "Goodbye! 💫",
                        "goodnight": "Good night! 🌙",
                        "morning": "Good morning! 🌅",
                        "goodmorning": "Good morning! 🌅",
                        "link": "Which link do you need? 🔗",
                        "haram": "Okay! 😊",
                        "dhur": "Okay friend! ☺️",
                        "lanat": "Goodbye! ✨",
                        "saf": "Okay! 😊",
                        "i love you": "Thank you! I'm just a bot though 💖",
                        "miss you": "I'm here! 😊",
                        "we": "Here! 👋",
                        "how are you": "I'm good, thanks for asking! 😊",
                        "umelala": "I slept well, thanks! 👍",
                        "umefanikiwa": "Yes, thank you! 💫",
                        "mvua": "How's the rain? 🌧️",
                        "Shinigami": "Yes, that's my name! 🤖",
                        "kidy": "I am Shinigami MD! 💫",
                        "imad": "I am Shinigami MD bot 🤖",
                        "sawa": "Okay! 👋",
                        "nai": "Okay! ✨",
                        "misi": "Good morning! 😊",
                        "mmh": "Okay! 👍",
                        "ai": "Yes, I have AI features! Use .ai command 🧠",
                        "pic": "Send me an image, I'll recognize it! 📷",
                        "song": "Use .song command for music! 🎵",
                        "help": "Use .menu command for all commands! ❓",
                        "assist": "How can I help you? 💭",
                        "support": "Contact owner using .owner 📞",
                        "happy": "Nice to hear that! 😊",
                        "sad": "I'm sorry, what's wrong? 😔",
                        "angry": "It's okay, don't get angry! ☺️",
                        "cool": "Thank you! 😎",
                        "amazing": "Thank you very much! 🙏",
                        "sweet": "Thank you friend! 💖"
                    };

                    const allReplies = { ...autoReplies, ...customReplies };

                    if (allReplies[messageText] && (userConfig.AUTO_REPLY === 'true' || config.AUTO_REPLY_ENABLE === 'true')) {
                        try {
                            await conn.sendMessage(mek.key.remoteJid, {
                                text: allReplies[messageText]
                            }, { quoted: mek });
                            console.log(`🤖 Auto-replied to "${messageText}"`);
                            return;
                        } catch (replyError) {
                            console.log(`⚠️ Failed to send auto-reply: ${replyError.message}`);
                        }
                    }
                }

                // Status Handling
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    try {
                        if (userConfig.AUTO_VIEW_STATUS === "true") {
                            await conn.readMessages([mek.key]);
                            console.log(`👁️ Auto-viewed status from ${mek.key.participant}`);
                        }

                        if (userConfig.AUTO_LIKE_STATUS === "true") {
                            const jawadlike = await conn.decodeJid(conn.user.id);
                            const emojis = userConfig.AUTO_LIKE_EMOJI || config.AUTO_LIKE_EMOJI;
                            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                            await conn.sendMessage(mek.key.remoteJid, {
                                react: { text: randomEmoji, key: mek.key }
                            }, { statusJidList: [mek.key.participant, jawadlike] });
                            console.log(`👍 Auto-liked status with ${randomEmoji}`);
                        }

                        if (userConfig.AUTO_STATUS_REPLY === "true") {
                            const user = mek.key.participant;
                            let statusText = '';

                            if (mek.message?.conversation) {
                                statusText = mek.message.conversation;
                            } else if (mek.message?.extendedTextMessage?.text) {
                                statusText = mek.message.extendedTextMessage.text;
                            } else if (mek.message?.imageMessage?.caption) {
                                statusText = mek.message.imageMessage.caption;
                            } else if (mek.message?.videoMessage?.caption) {
                                statusText = mek.message.videoMessage.caption;
                            }

                            const aiResponse = await generateAIResponse(statusText);

                            await conn.sendMessage(user, {
                                text: `🤖 *AI Response to your status:*\n\n${aiResponse}\n\n_Powered by SHINIGAMI-MD Bot_`
                            }, { quoted: mek });

                            console.log(`🤖 AI replied to status: "${statusText.substring(0, 30)}..."`);
                        }
                    } catch (error) {
                        console.error(`❌ Error handling status: ${error.message}`);
                    }
                    return;
                }

                // Newsletter Reaction
                const newsletterJids = [
                    "120363421014261315@newsletter",
                    "120363424512102809@newsletter",
                    "120363420222821450@newsletter"
                ];

                const newsEmojis = config.NEWSLETTER_REACTION_EMOJIS || ["❤️", "👍", "😮", "😎", "💀", "💫", "🔥", "👑", "⚡", "🌟", "🎉", "🤩"];

                if (mek.key && newsletterJids.includes(mek.key.remoteJid)) {
                    try {
                        if (mek.newsletterServerId) {
                            const serverId = mek.newsletterServerId;
                            const emoji = newsEmojis[Math.floor(Math.random() * newsEmojis.length)];

                            await conn.newsletterReactMessage(mek.key.remoteJid, serverId.toString(), emoji);
                            console.log(`🎭 Reacted to newsletter ${mek.key.remoteJid} with ${emoji}`);
                        }
                    } catch (e) {
                        console.log(`⚠️ Could not react to newsletter: ${e.message}`);
                    }
                }

                // Message Serialization (continued)
                const m = sms(conn, mek);
                const type = getContentType(mek.message);
                const from = mek.key.remoteJid;
                const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
                const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : '';

                // Handle antilink
                const antilinkSettingsPath = path.join(__dirname, './database/antilink.json');
                if (fs.existsSync(antilinkSettingsPath)) {
                    const antilinkSettings = JSON.parse(fs.readFileSync(antilinkSettingsPath, 'utf8'));
                    if (antilinkSettings[from] === true) {
                        await handleAntilink(conn, mek, from, m);
                    }
                }

                const isCmd = body.startsWith(config.PREFIX);
                const command = isCmd ? body.slice(config.PREFIX.length).trim().split(' ').shift().toLowerCase() : '';
                const args = body.trim().split(/ +/).slice(1);
                const q = args.join(' ');
                const text = q;
                const isGroup = from.endsWith('@g.us');

                const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
                const senderNumber = sender.split('@')[0];
                const botNumber = conn.user.id.split(':')[0];
                const botNumber2 = await jidNormalizedUser(conn.user.id);
                const pushname = mek.pushName || 'User';

                const isMe = botNumber.includes(senderNumber);
                const isOwner = config.OWNER_NUMBER.includes(senderNumber) || isMe;
                const isCreator = isOwner;

                // Group Metadata
                let groupMetadata = null;
                let groupName = null;
                let participants = null;
                let groupAdmins = null;
                let isBotAdmins = null;
                let isAdmins = null;

                if (isGroup) {
                    try {
                        groupMetadata = await conn.groupMetadata(from);
                        groupName = groupMetadata.subject;
                        participants = await groupMetadata.participants;
                        groupAdmins = await getGroupAdmins(participants);
                        isBotAdmins = groupAdmins.includes(botNumber2);
                        isAdmins = groupAdmins.includes(sender);
                    } catch (e) { }
                }

                // Auto Presence
                if (userConfig.AUTO_TYPING === 'true') await conn.sendPresenceUpdate('composing', from);
                if (userConfig.AUTO_RECORDING === 'true') await conn.sendPresenceUpdate('recording', from);

                // Custom MyQuoted
                const fakevCard = {
                    key: {
                        fromMe: false,
                        participant: "0@s.whatsapp.net",
                        remoteJid: "status@broadcast"
                    },
                    message: {
                        contactMessage: {
                            displayName: "© Shinigami MD",
                            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:SHINIGAMI-MD BOT\nORG:SHINIGAMI-MD BOT;\nTEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER || '554488138425'}:+${config.OWNER_NUMBER || '554488138425'}\nEND:VCARD`
                        }
                    },
                    messageTimestamp: Math.floor(Date.now() / 1000),
                    status: 1
                };

                const reply = (text) => conn.sendMessage(from, { text: text }, { quoted: fakevCard });
                const l = reply;

                // "Send" Command
                const cmdNoPrefix = body.toLowerCase().trim();
                if (["send", "sendme", "sand"].includes(cmdNoPrefix)) {
                    if (!mek.message.extendedTextMessage?.contextInfo?.quotedMessage) {
                        await conn.sendMessage(from, { text: "*Reply to a status to send it! 😊*" }, { quoted: mek });
                    } else {
                        try {
                            let qMsg = mek.message.extendedTextMessage.contextInfo.quotedMessage;
                            let mtype = Object.keys(qMsg)[0];
                            const stream = await downloadContentFromMessage(qMsg[mtype], mtype.replace('Message', ''));
                            let buffer = Buffer.from([]);
                            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                            let content = {};
                            if (mtype === 'imageMessage') content = { image: buffer, caption: qMsg[mtype].caption };
                            else if (mtype === 'videoMessage') content = { video: buffer, caption: qMsg[mtype].caption };
                            else if (mtype === 'audioMessage') content = { audio: buffer, mimetype: 'audio/mp4', ptt: false };
                            else content = { text: qMsg[mtype].text || qMsg.conversation };

                            if (content) await conn.sendMessage(from, content, { quoted: mek });
                        } catch (e) { console.error(e); }
                    }
                }

                // Execute plugins
                const cmdName = isCmd ? body.slice(config.PREFIX.length).trim().split(" ")[0].toLowerCase() : false;
                if (isCmd) {
                    await incrementStats(sanitizedNumber, 'commandsUsed');

                    const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
                    if (cmd) {
                        if (config.WORK_TYPE === 'private' && !isOwner) return;
                        if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });

                        try {
                            cmd.function(conn, mek, m, {
                                from, quoted: mek, body, isCmd, command, args, q, text, isGroup, sender,
                                senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator,
                                groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins,
                                reply, config, fakevCard
                            });
                        } catch (e) {
                            console.error("[Plugin ERROR] " + e);
                        }
                    }
                }

                // Statistics
                await incrementStats(sanitizedNumber, 'messagesReceived');
                if (isGroup) {
                    await incrementStats(sanitizedNumber, 'groupsInteracted');
                }

                // Execute Events
                events.commands.map(async (command) => {
                    const ctx = { from, l, quoted: mek, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply, config, fakevCard };

                    if (body && command.on === "body") command.function(conn, mek, m, ctx);
                    else if (mek.q && command.on === "text") command.function(conn, mek, m, ctx);
                    else if ((command.on === "image" || command.on === "photo") && mek.type === "imageMessage") command.function(conn, mek, m, ctx);
                    else if (command.on === "sticker" && mek.type === "stickerMessage") command.function(conn, mek, m, ctx);
                });

            } catch (e) {
                console.error(e);
            }
        });

    } catch (err) {
        console.error(err);
        if (res && !res.headersSent) {
            return res.json({
                error: 'Internal Server Error',
                details: err.message
            });
        }
    } finally {
        if (connectionLockKey) {
            global[connectionLockKey] = false;
        }
    }
}

// ==============================================================================
// 4. API ROUTES
// ==============================================================================

router.get('/', (req, res) => res.sendFile(path.join(__dirname, 'pair.html')));

router.get('/code', async (req, res) => {
    const number = req.query.number;
    if (!number) return res.json({ error: 'Number required' });
    await startBot(number, res);
});

router.get('/status', async (req, res) => {
    const { number } = req.query;

    if (!number) {
        const activeConnections = Array.from(activeSockets.keys()).map(num => {
            const status = getConnectionStatus(num);
            return {
                number: num,
                status: 'connected',
                connectionTime: status.connectionTime,
                uptime: `${status.uptime} seconds`
            };
        });

        return res.json({
            totalActive: activeSockets.size,
            connections: activeConnections
        });
    }

    const connectionStatus = getConnectionStatus(number);

    res.json({
        number: number,
        isConnected: connectionStatus.isConnected,
        connectionTime: connectionStatus.connectionTime,
        uptime: `${connectionStatus.uptime} seconds`,
        message: connectionStatus.isConnected
            ? 'Number is actively connected'
            : 'Number is not connected'
    });
});

router.get('/disconnect', async (req, res) => {
    const { number } = req.query;
    if (!number) {
        return res.status(400).json({ error: 'Number parameter is required' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');

    if (!activeSockets.has(sanitizedNumber)) {
        return res.status(404).json({
            error: 'Number not found in active connections'
        });
    }

    try {
        const socket = activeSockets.get(sanitizedNumber);

        await socket.ws.close();
        socket.ev.removeAllListeners();

        activeSockets.delete(sanitizedNumber);
        socketCreationTime.delete(sanitizedNumber);
        await removeNumberFromMongoDB(sanitizedNumber);
        await deleteSessionFromMongoDB(sanitizedNumber);

        console.log(`✅ Manually disconnected ${sanitizedNumber}`);

        res.json({
            status: 'success',
            message: 'Number disconnected successfully'
        });

    } catch (error) {
        console.error(`Error disconnecting ${sanitizedNumber}:`, error);
        res.status(500).json({
            error: 'Failed to disconnect number'
        });
    }
});

router.get('/active', (req, res) => {
    res.json({
        count: activeSockets.size,
        numbers: Array.from(activeSockets.keys())
    });
});

router.get('/ping', (req, res) => {
    res.json({
        status: 'active',
        message: 'Shinigami-md is running',
        activeSessions: activeSockets.size,
        database: 'MongoDB Integrated'
    });
});

router.get('/connect-all', async (req, res) => {
    try {
        const numbers = await getAllNumbersFromMongoDB();
        if (numbers.length === 0) {
            return res.status(404).json({ error: 'No numbers found to connect' });
        }

        const results = [];
        for (const number of numbers) {
            if (activeSockets.has(number)) {
                results.push({ number, status: 'already_connected' });
                continue;
            }

            const mockRes = {
                headersSent: false,
                json: () => { },
                status: () => mockRes
            };
            await startBot(number, mockRes);
            results.push({ number, status: 'connection_initiated' });
            await delay(1000);
        }

        res.json({
            status: 'success',
            total: numbers.length,
            connections: results
        });
    } catch (error) {
        console.error('Connect all error:', error);
        res.status(500).json({ error: 'Failed to connect all bots' });
    }
});

router.get('/update-config', async (req, res) => {
    const { number, config: configString } = req.query;
    if (!number || !configString) {
        return res.status(400).json({ error: 'Number and config are required' });
    }

    let newConfig;
    try {
        newConfig = JSON.parse(configString);
    } catch (error) {
        return res.status(400).json({ error: 'Invalid config format' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const socket = activeSockets.get(sanitizedNumber);
    if (!socket) {
        return res.status(404).json({ error: 'No active session found for this number' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await saveOTPToMongoDB(sanitizedNumber, otp, newConfig);

    try {
        const userJid = jidNormalizedUser(socket.user.id);
        await socket.sendMessage(userJid, {
            text: `*🔐 CONFIGURATION UPDATE*\n\nYour OTP: *${otp}*\nValid for 5 minutes\n\nUse: .verify-otp ${otp}`
        });

        res.json({
            status: 'otp_sent',
            message: 'OTP sent to your number'
        });
    } catch (error) {
        console.error('Failed to send OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

router.get('/verify-otp', async (req, res) => {
    const { number, otp } = req.query;
    if (!number || !otp) {
        return res.status(400).json({ error: 'Number and OTP are required' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const verification = await verifyOTPFromMongoDB(sanitizedNumber, otp);

    if (!verification.valid) {
        return res.status(400).json({ error: verification.error });
    }

    try {
        await updateUserConfigInMongoDB(sanitizedNumber, verification.config);
        const socket = activeSockets.get(sanitizedNumber);
        if (socket) {
            await socket.sendMessage(jidNormalizedUser(socket.user.id), {
                text: `*✅ CONFIG UPDATED*\n\nYour configuration has been successfully updated!\n\nChanges saved in MongoDB.`
            });
        }
        res.json({
            status: 'success',
            message: 'Config updated successfully in MongoDB'
        });
    } catch (error) {
        console.error('Failed to update config in MongoDB:', error);
        res.status(500).json({ error: 'Failed to update config' });
    }
});

router.get('/stats', async (req, res) => {
    const { number } = req.query;

    if (!number) {
        return res.status(400).json({ error: 'Number is required' });
    }

    try {
        const stats = await getStatsForNumber(number);
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const connectionStatus = getConnectionStatus(sanitizedNumber);

        res.json({
            number: sanitizedNumber,
            connectionStatus: connectionStatus.isConnected ? 'Connected' : 'Disconnected',
            uptime: connectionStatus.uptime,
            stats: stats
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

// ==============================================================================
// 5. AUTO RECONNECT AT STARTUP
// ==============================================================================

async function autoReconnectFromMongoDB() {
    try {
        console.log('🔁 Attempting auto-reconnect from MongoDB...');
        const numbers = await getAllNumbersFromMongoDB();

        if (numbers.length === 0) {
            console.log('ℹ️ No numbers found in MongoDB for auto-reconnect');
            return;
        }

        console.log(`📊 Found ${numbers.length} numbers in MongoDB`);

        for (const number of numbers) {
            if (!activeSockets.has(number)) {
                console.log(`🔁 Reconnecting: ${number}`);
                const mockRes = {
                    headersSent: false,
                    json: () => { },
                    status: () => mockRes
                };
                await startBot(number, mockRes);
                await delay(2000);
            } else {
                console.log(`✅ Already connected: ${number}`);
            }
        }

        console.log('✅ Auto-reconnect completed');
    } catch (error) {
        console.error('❌ autoReconnectFromMongoDB error:', error.message);
    }
}

setTimeout(() => {
    autoReconnectFromMongoDB();
}, 3000);

// ==============================================================================
// 6. TELEGRAM BOT CONFIGURATION
// ==============================================================================

const { Telegraf, Markup } = require('telegraf');

// Create telegram plugins directory
const telegramPluginsDir = path.join(__dirname, 'telegram_plugins');
if (!fs.existsSync(telegramPluginsDir)) {
    fs.mkdirSync(telegramPluginsDir, { recursive: true });
    console.log(`📁 Created telegram_plugins directory`);
}

// Check if Telegram token is configured
if (config.TELEGRAM_BOT_TOKEN) {
    const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

    function loadTelegramCommands() {
        try {
            const telegramFiles = fs.readdirSync(telegramPluginsDir).filter(file => file.endsWith('.js'));
            console.log(`📦 Loading ${telegramFiles.length} telegram commands...`);

            for (const file of telegramFiles) {
                try {
                    const command = require(path.join(telegramPluginsDir, file));
                    if (command && command.command && command.function) {
                        bot.command(command.command, command.function);
                        console.log(`✅ Loaded telegram command: /${command.command}`);
                    }
                } catch (e) {
                    console.error(`❌ Failed to load telegram command ${file}:`, e);
                }
            }
        } catch (error) {
            console.error('❌ Error loading telegram commands:', error);
        }
    }

    bot.start((ctx) => {
        const welcomeMessage = `🤖 *SHINIGAMI MD BOT PAIRING SYSTEM* 🤖

👋 Welcome to Shinigami MD WhatsApp Bot Pairing System!

📱 *How to use:*
1️⃣ Use /pair <number> to pair your bot
2️⃣ I'll generate a pairing code for you
3️⃣ Enter the code in your WhatsApp
4️⃣ Your bot will be connected!

📌 *Example:* /pair 255627417402

🔧 *Available Commands:*
/start - Show this message
/pair <number> - Pair your bot
/owner - Contact owner
/menu - Show commands menu
/ping - Check bot status
/alive - Check if bot is alive

🚀 *Support Links:*
• GitHub: https://github.com/ARNOLDT20/viper2
• WhatsApp Channel: ${config.CHANNEL_LINK || 'https://whatsapp.com/channel/0029VbC6It7K0IBkQwaKYd2J'}
• Support Group: https://chat.whatsapp.com/DJMA7QOT4V8FuRD6MpjPpt

> © Powered By BLAZE Tech`;

        const buttons = Markup.inlineKeyboard([
            [
                Markup.button.url('📢 Channel', 'https://t.me/t20classictech'),
                Markup.button.url('👥 Group', 'https://t.me/255627417402')
            ],
            [
                Markup.button.url('⭐ GitHub', 'https://github.com/INCONNU-BOY'),
                Markup.button.url('📱 WhatsApp', config.CHANNEL_LINK || 'https://whatsapp.com/channel/0029VbAjawl9MF8vQQa0ZT32')
            ]
        ]);

        ctx.replyWithPhoto(
            { url: config.IMAGE_PATH || 'https://files.catbox.moe/xoac4l.jpg' },
            {
                caption: welcomeMessage,
                parse_mode: 'Markdown',
                ...buttons
            }
        ).catch(() => {
            ctx.replyWithMarkdown(welcomeMessage, buttons);
        });
    });

    bot.command('pair', async (ctx) => {
        const args = ctx.message.text.split(' ');
        if (args.length < 2) {
            return ctx.reply('❌ *Usage:* /pair <number>\n*Example:* /pair 554xxxxxxxxx', { parse_mode: 'Markdown' });
        }

        const number = args[1];
        const sanitizedNumber = number.replace(/[^0-9]/g, '');

        if (sanitizedNumber.length < 9) {
            return ctx.reply('❌ Invalid phone number. Please enter a valid number with country code.', { parse_mode: 'Markdown' });
        }

        try {
            ctx.reply(`⏳ *Pairing in progress...*\n\nNumber: +${sanitizedNumber}\nStatus: Initiating connection...`, { parse_mode: 'Markdown' });

            const mockRes = {
                headersSent: false,
                json: (data) => {
                    if (data.code) {
                        ctx.replyWithPhoto(
                            { url: config.IMAGE_PATH || 'https://files.catbox.moe/xoac4l.jpg' },
                            {
                                caption: `✅ *PAIRING CODE GENERATED!*\n\n📱 Number: +${sanitizedNumber}\n🔑 Code: *${data.code}*\n\n📋 *How to use:*\n1️⃣ Open WhatsApp on your phone\n2️⃣ Go to Linked Devices\n3️⃣ Add a new device\n4️⃣ Enter the code: *${data.code}*\n5️⃣ Wait for connection confirmation\n\n⚠️ *Note:* This code is valid for 20 seconds only!`,
                                parse_mode: 'Markdown'
                            }
                        ).catch(() => {
                            ctx.reply(`✅ *PAIRING CODE GENERATED!*\n\n📱 Number: +${sanitizedNumber}\n🔑 Code: *${data.code}*\n\n📋 *How to use:*\n1️⃣ Open WhatsApp on your phone\n2️⃣ Go to Linked Devices\n3️⃣ Add a new device\n4️⃣ Enter the code: *${data.code}*\n5️⃣ Wait for connection confirmation\n\n⚠️ *Note:* This code is valid for 20 seconds only!`, { parse_mode: 'Markdown' });
                        });
                    } else if (data.status === 'already_connected') {
                        ctx.reply(`✅ *BOT ALREADY CONNECTED!*\n\n📱 Number: +${sanitizedNumber}\n🔗 Status: Already active\n⏰ Uptime: ${data.uptime}\n\nYour bot is already running and connected.`, { parse_mode: 'Markdown' });
                    } else if (data.status === 'reconnecting') {
                        ctx.reply(`🔄 *RECONNECTING EXISTING SESSION...*\n\n📱 Number: +${sanitizedNumber}\n🔗 Status: Reconnecting...\n\nPlease wait for a few seconds.`, { parse_mode: 'Markdown' });
                    } else if (data.error) {
                        ctx.reply(`❌ *ERROR:* ${data.error}\n\n📱 Number: +${sanitizedNumber}\n🔧 Details: ${data.details || 'Unknown error'}\n\nTry again or contact owner.`, { parse_mode: 'Markdown' });
                    }
                },
                status: () => mockRes
            };

            await startBot(sanitizedNumber, mockRes);

        } catch (error) {
            console.error('Telegram pairing error:', error);
            ctx.reply(`❌ *PAIRING ERROR*\n\nError: ${error.message}\n\nPlease try again or contact the owner.`, { parse_mode: 'Markdown' });
        }
    });

    loadTelegramCommands();

    bot.launch().then(() => {
        console.log('🤖 Telegram bot started successfully!');
    }).catch(error => {
        console.error('❌ Failed to start Telegram bot:', error);
    });

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
} else {
    console.log('ℹ️ Telegram bot token not configured. Skipping Telegram bot start...');
}

// ==============================================================================
// 7. CLEANUP ON EXIT
// ==============================================================================

process.on('exit', () => {
    activeSockets.forEach((socket, number) => {
        socket.ws.close();
        activeSockets.delete(number);
        socketCreationTime.delete(number);
    });

    const sessionDir = path.join(__dirname, 'session');
    if (fs.existsSync(sessionDir)) {
        fs.emptyDirSync(sessionDir);
    }
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    if (process.env.PM2_NAME) {
        const { exec } = require('child_process');
        exec(`pm2 restart ${process.env.PM2_NAME}`);
    }
});

module.exports = router;
