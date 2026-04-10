const config = require('./config');
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
}

module.exports = {
    // ===========================================================
    // 1. BASIC CONFIGURATION (Session & Database)
    // ===========================================================
    SESSION_ID: process.env.SESSION_ID || "SHINIGAMI MD",
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://kxshrii:i7sgjXF6SO2cTJwU@kelumxz.zggub8h.mongodb.net/',

    // ===========================================================
    // 2. BOT INFORMATION
    // ===========================================================
    PREFIX: process.env.PREFIX || '.',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '5544997461113',
    BOT_NAME: "SHINIGAMI MD",
    BOT_FOOTER: '> © MADE IN BY INCONNU BOY',

    // Work mode: public, private, group, inbox
    WORK_TYPE: process.env.WORK_TYPE || "public",

    // ===========================================================
    // 3. AUTOMATIC FEATURES (STATUS)
    // ===========================================================
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || 'true', // Automatically view statuses
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'true', // Automatically like statuses
    AUTO_LIKE_EMOJI: ['⚔️', '🔥', '⚡', '💀', '🩸', '🛡️', '🎯', '💣', '🏹', '🔪', '🗡️', '🏆', '💎', '🌟', '💥', '🌪️', '☠️', '👑', '⚙️', '🔰', '💢', '💫', '🌀', '❤️', '💗', '🤍', '🖤', '👀', '😎', '✅', '😁', '🌙', '☄️', '🌠', '🌌', '💚'],

    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'false', // Reply to statuses
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || '🖥️', // Reply message

    // ===========================================================
    // 4. CHAT & PRESENCE FEATURES
    // ===========================================================
    READ_MESSAGE: process.env.READ_MESSAGE || 'false', // Mark messages as read (Blue Tick)
    AUTO_TYPING: process.env.AUTO_TYPING || 'false', // Show "Typing..."
    AUTO_RECORDING: process.env.AUTO_RECORDING || 'false', // Show "Recording..."
    VIEWONCE_DETECT: process.env.VIEWONCE_DETECT || 'true',

    // ===========================================================
    // 5. GROUP MANAGEMENT
    // ===========================================================
    WELCOME_ENABLE: process.env.WELCOME_ENABLE || 'true',
    GOODBYE_ENABLE: process.env.GOODBYE_ENABLE || 'true',
    WELCOME_MSG: process.env.WELCOME_MSG || 'true',
    GOODBYE_MSG: process.env.GOODBYE_MSG || 'true',
    GROUP_EVENTS: process.env.GROUP_EVENTS || 'false',
    WELCOME_IMAGE: process.env.WELCOME_IMAGE || null,
    GOODBYE_IMAGE: process.env.GOODBYE_IMAGE || null,

    // Anti-links and anti-delete default settings
    ANTI_LINK: process.env.ANTI_LINK || 'true',
    ANTI_DELETE: process.env.ANTI_DELETE || 'false',

    // Custom anti-link warning message
    ANTI_LINK_MSG: process.env.ANTI_LINK_MSG || '❌ *ANTI-LINK ACTIVATED*\n\n@{sender}, sending links is not allowed in this group!\n\n*Group:* {group}\n*Link Type:* {linkType}\n*Action:* Message Deleted',

    GROUP_INVITE_LINK: process.env.GROUP_INVITE_LINK || 'https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks',

    // ===========================================================
    // 6. SECURITY & ANTI-CALL
    // ===========================================================
    ANTI_CALL: process.env.ANTI_CALL || 'false', // Reject calls
    REJECT_MSG: process.env.REJECT_MSG || '🔒 NO CALLS ALLOWED 🔒',

    // ===========================================================
    // ===========================================================
// 7. IMAGES & LINKS
// ===========================================================
IMAGE_PATH: 'https://files.catbox.moe/xoac4l.jpg',
CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbC6It7K0IBkQwaKYd2J',
GROUP_LINK_1: 'https://chat.whatsapp.com/DJMA7QOT4V8FuRD6MpjPpt',

// ===========================================================
// 8. CHANNEL JIDS (NEWSLETTER/CHANNEL)
// ===========================================================
CHANNEL_JID_1: '120363403408693274@newsletter',

// Newsletter reaction settings

    // Newsletter reaction settings
    NEWSLETTER_AUTO_FOLLOW: process.env.NEWSLETTER_AUTO_FOLLOW || 'true',
    NEWSLETTER_REACTION_EMOJIS: ['⚔️', '🔥', '⚡', '💀', '🩸', '🛡️', '🎯', '💣', '🏹', '🔪', '🗡️', '🏆', '💎', '🌟', '💥', '🌪️', '☠️', '👑', '⚙️', '🔰', '💢', '💫', '🌀', '❤️', '💗', '🤍', '🖤', '👀', '😎', '✅', '😁', '🌙', '☄️', '🌠', '🌌', '💚'],

    // ===========================================================
    // 9. AUTO-BIO SETTINGS
    // ===========================================================
    AUTO_BIO: process.env.AUTO_BIO || 'true',
    BIO_LIST: [
        "🔐 Shinigami - Your ultimate WhatsApp bot",
        "🚀 made in by inconnu boy",
        "💫 Always at your service!",
        "🎯 Fast, Secure & Reliable",
        "🤖 Shinigami - Your digital assistant",
        "⚡ Multi-device bot with MongoDB",
        "🔒 Secure & Private Bot",
        "🌟 Version 1.0.0 - New Features!"
    ],

    // ===========================================================
    // 11. EXTERNAL API (Optional)
    // ===========================================================
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '8526421940:AAFU39FEU61U3ORKIe8NuqzBACydzqcOgSI',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '7303596375',

    // ===========================================================
    // 12. BUTTON & LIST MESSAGE SETTINGS
    // ===========================================================
    BUTTON_FOOTER: process.env.BUTTON_FOOTER || '> © MADE IN BY INCONNU BOY',
    LIST_TITLE: process.env.LIST_TITLE || 'SHINIGAMI MD',
    LIST_BUTTON_TEXT: process.env.LIST_BUTTON_TEXT || 'SELECT OPTION',

    // ===========================================================
    // 14. AUTO-REPLY MESSAGES
    // ===========================================================
    AUTO_REPLY_ENABLE: process.env.AUTO_REPLY_ENABLE || 'true',
    AUTO_REPLIES: {
        'hi': '*👋 𝙷𝚎𝚕𝚕𝚘! 𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚑𝚎𝚕𝚙 𝚢𝚘𝚞 𝚝𝚘𝚍𝚊𝚢?*',
        'mambo': '*💫 𝙿𝚘𝚊 𝚜𝚊𝚗𝚊! 𝙽𝚒𝚔𝚞𝚜𝚊𝚒𝚍𝚒𝚎 𝙺𝚞𝚑𝚞𝚜𝚞?*',
        'hey': '*⚡ 𝙷𝚎𝚢 𝚝𝚑𝚎𝚛𝚎! 𝚄𝚜𝚎 .𝚖𝚎𝚗𝚞 𝚏𝚘𝚛 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜*',
        'vip': '*👑 𝙷𝚎𝚕𝚕𝚘 𝚅𝙸𝙿! 𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚊𝚜𝚜𝚒𝚜𝚝 𝚢𝚘𝚞?*',
        'mkuu': '*🔥 𝙷𝚎𝚢 𝚖𝚔𝚞𝚞! 𝙽𝚒𝚔𝚞𝚜𝚊𝚒𝚍𝚒𝚎 𝙺𝚞𝚑𝚞𝚜𝚞?*',
        'boss': '*🎯 𝚈𝚎𝚜 𝚋𝚘𝚜𝚜! 𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚑𝚎𝚕𝚙 𝚢𝚘𝚞?*',
        'habari': '*🌟 𝙽𝚣𝚞𝚛𝚒 𝚜𝚊𝚗𝚊! 𝙷𝚊𝚋𝚊𝚛𝚒 𝚢𝚊𝚔𝚘?*',
        'hello': '*🤖 𝙷𝚒 𝚝𝚑𝚎𝚛𝚎! 𝚄𝚜𝚎 .𝚖𝚎𝚗𝚞 𝚏𝚘𝚛 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜*',
        'bot': '*⚙️ 𝚈𝚎𝚜, 𝙸 𝚊𝚖 shinigami-md ! 𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚊𝚜𝚜𝚒𝚜𝚝 𝚢𝚘𝚞?*',
        'menu': '*📜 𝚃𝚢𝚙𝚎 .𝚖𝚎𝚗𝚞 𝚏𝚘𝚛 𝚊𝚕𝚕 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜!*',
        'owner': '*👑 𝙲𝚘𝚗𝚝𝚊𝚌𝚝 𝚘𝚠𝚗𝚎𝚛 𝚞𝚜𝚒𝚗𝚐 .𝚘𝚠𝚗𝚎𝚛*',
        'thanks': '*✨ 𝚈𝚘𝚞\'𝚛𝚎 𝚠𝚎𝚕𝚌𝚘𝚖𝚎!*',
        'thank you': '*💫 𝙰𝚗𝚢𝚝𝚒𝚖𝚎! 𝙻𝚎𝚝 𝚖𝚎 𝚔𝚗𝚘𝚠 𝚒𝚏 𝚢𝚘𝚞 𝚗𝚎𝚎𝚍 𝚑𝚎𝚕𝚙*'
    }
};
