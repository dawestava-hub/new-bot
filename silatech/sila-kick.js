const config = require('../config')
const { cmd, commands } = require('../momy')
const { isUrl } = require('../lib/functions')

cmd({
    pattern: "kick",
    react: "👢",
    alias: ["remove", "kickout"],
    desc: "Remove a member from group",
    category: "group",
    use: ".kick @user",
    filename: __filename
},
    async (conn, mek, m, { from, reply, isGroup, sender, isOwner, isAdmins, isBotAdmins, mentionedJid }) => {
        try {
            if (!isGroup) return reply("❌ This command only works in groups");

            if (!isAdmins && !isOwner) {
                return reply("❌ Only group admins can use this command");
            }

            if (!isBotAdmins) {
                return reply("❌ Please make the bot an admin first");
            }

            if (!mentionedJid || mentionedJid.length === 0) {
                return reply("❌ Please tag the member to remove\n\nExample:\n.kick @user");
            }

            for (let user of mentionedJid) {
                await conn.groupParticipantsUpdate(from, [user], "remove");
            }

            reply(
                "👢 MEMBER REMOVED 👢\n\n" +
                "Due to not following group rules\n\n" +
                "👑 SHINIGAMI MD WHATSAPP BOT 👑"
            );

        } catch (e) {
            console.error("Kick Error:", e);
            reply("❌ Failed to remove member");
        }
    });
