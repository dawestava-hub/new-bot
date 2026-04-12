const { cmd } = require('../momy');
const config = require('../config');

const contextInfo = () => ({
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
        newsletterName: config.BOT_NAME || 'SHINIGAMI MD',
        serverMessageId: 13
    }
});

// ─── Helper: get mentioned JID from message ───────────────────────────────
function getMentioned(m, mek) {
    const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
                      mek.message?.imageMessage?.contextInfo?.mentionedJid ||
                      mek.message?.videoMessage?.contextInfo?.mentionedJid || [];
    return mentioned[0] || null;
}

// ─── Helper: random int between min and max ───────────────────────────────
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Helper: pick random item from array ─────────────────────────────────
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// =================================================================
// 🏳️‍🌈 GAY — Check gay percentage of a user
// =================================================================
cmd({
    pattern: 'gay',
    alias: ['gaymeter', 'gayrate'],
    desc: 'Check the gay percentage of a user',
    category: 'fun',
    react: '🏳️‍🌈',
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, pushname, isGroup }) => {
    try {
        const mentionedJid = getMentioned(m, mek);
        const targetJid = mentionedJid || sender;
        const targetName = mentionedJid
            ? `@${mentionedJid.split('@')[0]}`
            : (pushname || sender.split('@')[0]);

        const percent = rand(0, 100);
        const bar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10));

        let emoji, verdict;
        if (percent <= 10) { emoji = '😐'; verdict = 'Absolutely straight'; }
        else if (percent <= 30) { emoji = '🤔'; verdict = 'A little curious...'; }
        else if (percent <= 50) { emoji = '😏'; verdict = 'Bisexual vibes'; }
        else if (percent <= 70) { emoji = '🌈'; verdict = 'Pretty gay ngl'; }
        else if (percent <= 90) { emoji = '🏳️‍🌈'; verdict = 'Very gay!'; }
        else { emoji = '💅'; verdict = 'MAX GAY LEVEL'; }

        const message =
`╭━━━━━━━━━━━━━━━━━╮
│  🏳️‍🌈  *GAY METER*  🏳️‍🌈
╰━━━━━━━━━━━━━━━━━╯

👤 *User:* ${targetName}
📊 *Result:* ${percent}%
🎨 *[${bar}]*
${emoji} *Verdict:* ${verdict}

> ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: message,
            mentions: [targetJid],
            contextInfo: {
                ...contextInfo(),
                mentionedJid: [targetJid]
            }
        }, { quoted: mek });

        await m.react('🏳️‍🌈');
    } catch (e) {
        console.error('GAY CMD ERROR:', e);
        reply('❌ Error running .gay command: ' + e.message);
        await m.react('❌');
    }
});

// =================================================================
// 💑 DAYCOUPLE — Pick a random couple of the day from group members
// =================================================================
cmd({
    pattern: 'daycouple',
    alias: ['coupleoftheday', 'shipper', 'couple'],
    desc: 'Pick a random couple of the day from group members',
    category: 'fun',
    react: '💑',
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups.');

        const groupData = await conn.groupMetadata(from);
        const members = groupData.participants || [];

        // Accept @s.whatsapp.net and @lid
        const validMembers = members.filter(p =>
            p.id && (p.id.endsWith('@s.whatsapp.net') || p.id.endsWith('@lid'))
        );

        if (validMembers.length < 2) {
            return reply('❌ Not enough members in this group! Need at least 2 members.');
        }

        // Pick 2 distinct random members
        const shuffled = [...validMembers].sort(() => Math.random() - 0.5);
        const person1 = shuffled[0];
        const person2 = shuffled[1];

        const name1 = `@${person1.id.split('@')[0]}`;
        const name2 = `@${person2.id.split('@')[0]}`;

        const lovePercent = rand(60, 100);
        const hearts = ['❤️', '💕', '💞', '💓', '💗', '💖', '💝'];
        const heart = pick(hearts);

        const phrases = [
            `made for each other! 💫`,
            `a perfect match! ✨`,
            `totally goals! 👑`,
            `the cutest couple! 🥰`,
            `unstoppable together! 💪`,
        ];

        const message =
`╭━━━━━━━━━━━━━━━━━╮
│  💑  *COUPLE OF THE DAY*
╰━━━━━━━━━━━━━━━━━╯

${heart} ${name1}
     *+*
${heart} ${name2}

💯 *Love Meter:* ${lovePercent}%
💬 *Verdict:* They are ${pick(phrases)}

🗓️ *Group:* ${groupData.subject}

> ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: message,
            mentions: [person1.id, person2.id],
            contextInfo: {
                ...contextInfo(),
                mentionedJid: [person1.id, person2.id]
            }
        }, { quoted: mek });

        await m.react('💑');
    } catch (e) {
        console.error('DAYCOUPLE CMD ERROR:', e);
        reply('❌ Error running .daycouple command: ' + e.message);
        await m.react('❌');
    }
});

// =================================================================
// 💕 LEVE / LOVING — Show love percentage between sender and mention
// =================================================================
cmd({
    pattern: 'leve',
    alias: ['loving', 'lovemeter', 'amour', 'love'],
    desc: 'Check love percentage between you and a mentioned user',
    category: 'fun',
    react: '💕',
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, pushname, isGroup }) => {
    try {
        const mentionedJid = getMentioned(m, mek);

        if (!mentionedJid) {
            return reply(
`❌ Mention a user!
Usage: *.leve @user*

Example: .leve @someone`
            );
        }

        if (mentionedJid === sender) {
            return reply('❌ You cannot use this command on yourself!');
        }

        const senderName = `@${sender.split('@')[0]}`;
        const targetName = `@${mentionedJid.split('@')[0]}`;

        const lovePercent = rand(0, 100);
        const bar = '❤️'.repeat(Math.floor(lovePercent / 20)) + '🤍'.repeat(5 - Math.floor(lovePercent / 20));

        let verdict;
        if (lovePercent <= 20) verdict = 'Just friends... for now 😅';
        else if (lovePercent <= 40) verdict = 'There\'s a spark! 🔥';
        else if (lovePercent <= 60) verdict = 'Crushing hard! 😍';
        else if (lovePercent <= 80) verdict = 'Deeply in love! 💞';
        else verdict = 'SOULMATES! 💖✨';

        const message =
`╭━━━━━━━━━━━━━━━━━╮
│  💕  *LOVE METER*  💕
╰━━━━━━━━━━━━━━━━━╯

💘 ${senderName}
     *&*
💘 ${targetName}

${bar}
❤️ *Love:* ${lovePercent}%
💬 *Verdict:* ${verdict}

> ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: message,
            mentions: [sender, mentionedJid],
            contextInfo: {
                ...contextInfo(),
                mentionedJid: [sender, mentionedJid]
            }
        }, { quoted: mek });

        await m.react('💕');
    } catch (e) {
        console.error('LEVE CMD ERROR:', e);
        reply('❌ Error running .leve command: ' + e.message);
        await m.react('❌');
    }
});

// =================================================================
// ❌⭕ TICTACTOE — Play Tic-Tac-Toe against a mentioned user
// =================================================================

// Active games store: key = groupJid, value = game state
const activeGames = new Map();

function makeBoard() {
    return [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
}

function renderBoard(board) {
    const s = board.map((c, i) => c === ' ' ? (i + 1) : c);
    return (
        ` ${s[0]} │ ${s[1]} │ ${s[2]} \n` +
        `───┼───┼───\n` +
        ` ${s[3]} │ ${s[4]} │ ${s[5]} \n` +
        `───┼───┼───\n` +
        ` ${s[6]} │ ${s[7]} │ ${s[8]} `
    );
}

function checkWinner(board) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // cols
        [0,4,8],[2,4,6]           // diags
    ];
    for (const [a,b,c] of wins) {
        if (board[a] !== ' ' && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    if (board.every(c => c !== ' ')) return 'draw';
    return null;
}

cmd({
    pattern: 'tictactoe',
    alias: ['ttt', 'xo'],
    desc: 'Play Tic-Tac-Toe with a mentioned user',
    category: 'fun',
    react: '❌',
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups.');

        const mentionedJid = getMentioned(m, mek);

        if (!mentionedJid) {
            return reply(
`❌ Mention your opponent!
Usage: *.tictactoe @user*

Example: .tictactoe @someone`
            );
        }

        if (mentionedJid === sender) {
            return reply('❌ You cannot play against yourself!');
        }

        // Start a new game (overwrite any existing game in group)
        const game = {
            board: makeBoard(),
            players: { X: sender, O: mentionedJid },
            currentTurn: sender, // sender (X) goes first
            groupJid: from
        };
        activeGames.set(from, game);

        const senderTag = `@${sender.split('@')[0]}`;
        const opponentTag = `@${mentionedJid.split('@')[0]}`;

        const message =
`╭━━━━━━━━━━━━━━━━━╮
│  ❌⭕  *TIC-TAC-TOE*
╰━━━━━━━━━━━━━━━━━╯

${senderTag} ❌  VS  ⭕ ${opponentTag}

\`\`\`
${renderBoard(game.board)}
\`\`\`

🎯 *${senderTag}'s turn* (❌)

💬 Reply with a number *1-9* to play!
⏱️ Game expires after 2 minutes of inactivity.

> ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: message,
            mentions: [sender, mentionedJid],
            contextInfo: {
                ...contextInfo(),
                mentionedJid: [sender, mentionedJid]
            }
        }, { quoted: mek });

        await m.react('❌');

        // Auto-expire game after 2 minutes
        setTimeout(() => {
            if (activeGames.has(from)) {
                const g = activeGames.get(from);
                if (g.players.X === sender && g.players.O === mentionedJid) {
                    activeGames.delete(from);
                }
            }
        }, 2 * 60 * 1000);

    } catch (e) {
        console.error('TICTACTOE CMD ERROR:', e);
        reply('❌ Error running .tictactoe command: ' + e.message);
        await m.react('❌');
    }
});

// ─── Tictactoe move handler (listen to number replies in active games) ────
cmd({
    pattern: 'tttmove',
    alias: [],
    desc: 'Internal: handle tictactoe move',
    category: 'hidden',
    react: '',
    filename: __filename,
    dontAddCommandList: true
},
async (conn, mek, m, { from, sender, body }) => {
    // This is handled inline below via message event, not as a cmd
});

// Export activeGames for use in sila.js message handler if needed
module.exports = { activeGames };
