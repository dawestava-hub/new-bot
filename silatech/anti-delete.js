const { cmd } = require('../momy');
const { setAntideleteStatus, getAntideleteStatus } = require('../data/Antidelete');

// Store for antilink status per chat
const antilinkStatus = new Map();

// Helper to set antilink status
const setAntilinkStatus = async (chatId, status) => {
    antilinkStatus.set(chatId, status);
};

// Helper to get antilink status
const getAntilinkStatus = async (chatId) => {
    return antilinkStatus.get(chatId) || false;
};

// Antidelete command
cmd({
    pattern: "antidelete",
    alias: ["antidel"],
    desc: "Turn Antidelete on/off",
    category: "owner",
    react: "💀"
},
async(conn, mek, m, { args, isOwner, reply, from, getUserConfigFromMongoDB, updateUserConfigInMongoDB }) => {
    if (!isOwner) return reply("*owner only command*");
    const mode = args[0]?.toLowerCase();

    const botNumber = conn.user.id.split(':')[0];
    
    if (mode === 'on' || mode === 'enable') {
        await updateUserConfigInMongoDB(botNumber, { ANTI_DELETE: 'true' });
        await setAntideleteStatus(from, true);
        await reply("*✅ anti-delete activated*");
    } else if (mode === 'off' || mode === 'disable') {
        await updateUserConfigInMongoDB(botNumber, { ANTI_DELETE: 'false' });
        await setAntideleteStatus(from, false);
        await reply("*✅ anti-delete deactivated*");
    } else {
        const userConfig = await getUserConfigFromMongoDB(botNumber);
        const current = userConfig?.ANTI_DELETE === 'true' || await getAntideleteStatus(from);
        await reply(`*anti-delete: ${current ? "ON ✅" : "OFF ❌"}*`);
    }
});

// Antilink command
cmd({
    pattern: "antilink",
    alias: ["antilnk", "nolink"],
    desc: "Turn Antilink on/off (auto-delete links)",
    category: "owner",
    react: "🔗"
},
async(conn, mek, m, { args, isOwner, reply, from, sender, isAdmins, isGroup, isBotAdmins, getUserConfigFromMongoDB, updateUserConfigInMongoDB }) => {
    if (!isGroup) return reply("*📌 group command only*");
    if (!isOwner && !isAdmins) return reply("*👑 admin only command*");
    
    const mode = args[0]?.toLowerCase();
    const botNumber = conn.user.id.split(':')[0];

    if (mode === 'on' || mode === 'enable') {
        // ✅ Vérification bot admin SUPPRIMÉE
        await updateUserConfigInMongoDB(botNumber, { ANTI_LINK: 'true' });
        await setAntilinkStatus(from, true);
        await reply("*✅ antilink activated*\n🔗 links will be auto-deleted");
    } else if (mode === 'off' || mode === 'disable') {
        await updateUserConfigInMongoDB(botNumber, { ANTI_LINK: 'false' });
        await setAntilinkStatus(from, false);
        await reply("*✅ antilink deactivated*\n🔗 links allowed");
    } else {
        const userConfig = await getUserConfigFromMongoDB(botNumber);
        const current = userConfig?.ANTI_LINK === 'true' || await getAntilinkStatus(from);
        await reply(`*antilink: ${current ? "ON ✅" : "OFF ❌"}*`);
    }
});

// Updated function to check and delete links
async function checkAndDeleteLinks(conn, mek, from, sender, isAdmins, isBotAdmins, groupMetadata) {
    try {
        const botNumber = conn.user.id.split(':')[0];
        const { getUserConfigFromMongoDB } = require('../lib/database');
        const userConfig = await getUserConfigFromMongoDB(botNumber);
        
        const isAntilinkEnabled = userConfig?.ANTI_LINK === 'true' || await getAntilinkStatus(from);
        
        if (!isAntilinkEnabled) return false;
        // ✅ Vérification bot admin SUPPRIMÉE ici aussi
        if (isAdmins) return false; // Les admins sont exemptés

        const message = mek.message;
        if (!message) return false;

        let text = '';
        if (message.conversation) {
            text = message.conversation;
        } else if (message.extendedTextMessage?.text) {
            text = message.extendedTextMessage.text;
        } else if (message.imageMessage?.caption) {
            text = message.imageMessage.caption;
        } else if (message.videoMessage?.caption) {
            text = message.videoMessage.caption;
        }

        const linkPatterns = [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
            /www\.[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
            /chat\.whatsapp\.com\/[A-Za-z0-9]+/gi,
            /whatsapp\.com\/channel\/[A-Za-z0-9]+/gi,
            /wa\.me\/[0-9]+/gi,
            /t\.me\/[A-Za-z0-9_]+/gi,
            /telegram\.me\/[A-Za-z0-9_]+/gi,
            /youtube\.com\/watch\?v=[A-Za-z0-9_-]+/gi,
            /youtu\.be\/[A-Za-z0-9_-]+/gi,
            /instagram\.com\/[A-Za-z0-9_.]+\/?/gi,
            /facebook\.com\/[A-Za-z0-9.]+\/?/gi,
            /twitter\.com\/[A-Za-z0-9_]+\/status\/[0-9]+/gi,
            /tiktok\.com\/@[A-Za-z0-9_.]+\/video\/[0-9]+/gi,
            /discord\.gg\/[A-Za-z0-9]+/gi,
            /discord\.com\/invite\/[A-Za-z0-9]+/gi,
            /\.com\b/gi,
            /\.net\b/gi,
            /\.org\b/gi,
            /\.co\b/gi,
            /\.tk\b/gi,
            /\.ml\b/gi,
            /\.ga\b/gi,
            /\.cf\b/gi,
            /\.gq\b/gi
        ];

        let foundLink = false;
        let linkType = 'link';
        
        for (const pattern of linkPatterns) {
            if (pattern.test(text)) {
                foundLink = true;
                if (pattern.toString().includes('chat.whatsapp.com')) linkType = 'WhatsApp group';
                else if (pattern.toString().includes('whatsapp.com') || pattern.toString().includes('wa.me')) linkType = 'WhatsApp';
                else if (pattern.toString().includes('t.me') || pattern.toString().includes('telegram.me')) linkType = 'Telegram';
                else if (pattern.toString().includes('youtube') || pattern.toString().includes('youtu.be')) linkType = 'YouTube';
                else if (pattern.toString().includes('instagram.com')) linkType = 'Instagram';
                else if (pattern.toString().includes('facebook.com')) linkType = 'Facebook';
                else if (pattern.toString().includes('twitter.com')) linkType = 'Twitter';
                else if (pattern.toString().includes('tiktok.com')) linkType = 'TikTok';
                else if (pattern.toString().includes('discord')) linkType = 'Discord';
                break;
            }
        }

        if (foundLink) {
            await conn.sendMessage(from, { delete: mek.key });

            const groupName = groupMetadata?.subject || 'Group';
            const warningMessage = `❌ *ANTI-LINK ACTIVATED*\n\n@${sender.split('@')[0]}, sending links is not allowed in this group!\n\n*Group:* ${groupName}\n*Link Type:* ${linkType.toUpperCase()}\n*Action:* Message Deleted`;
            
            await conn.sendMessage(from, {
                text: warningMessage,
                mentions: [sender]
            }, { quoted: mek });

            console.log(`🔗 Anti-link: Deleted ${linkType} link from ${sender} in ${groupName}`);
            return true;
        }
    } catch (error) {
        console.error("antilink error:", error.message);
    }
    
    return false;
}

module.exports = {
    checkAndDeleteLinks,
    getAntilinkStatus,
    setAntilinkStatus
};
