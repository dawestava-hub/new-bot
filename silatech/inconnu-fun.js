const { cmd } = require('../momy');
const config = require('../config');

// ─── Shared context info ──────────────────────────────────────────────────────
const getCtx = () => ({
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
        newsletterName: config.BOT_NAME || 'SHINIGAMI MD',
        serverMessageId: 13
    }
});

// ─── Helper: pick random int ──────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── In-memory TicTacToe game store ──────────────────────────────────────────
const tttGames = {}; // key: groupJid

// =============================================================================
// 🏳️‍🌈  .gay @user
// =============================================================================
cmd({
    pattern: 'gay',
    desc: 'Check how gay someone is (random %)',
    category: 'fun',
    react: '🏳️‍🌈',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, mentioned, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups.');

        const target = mentioned && mentioned[0]
            ? mentioned[0]
            : sender;

        const percent = rand(0, 100);
        let bar = '';
        for (let i = 0; i < 10; i++) bar += i < Math.floor(percent / 10) ? '🟣' : '⬜';

        let label;
        if (percent < 20) label = '😐 Barely noticeable';
        else if (percent < 40) label = '🤔 A little curious';
        else if (percent < 60) label = '😏 Halfway there';
        else if (percent < 80) label = '🌈 Pretty gay ngl';
        else label = '🏳️‍🌈 FULL RAINBOW MODE';

        const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│  🏳️‍🌈  GAY METER  🏳️‍🌈
╰━━━━━━━━━━━━━━━━━━╯

👤 User: @${target.split('@')[0]}
📊 Gay Level: *${percent}%*
${bar}
🏷️ Status: *${label}*

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            mentions: [target],
            contextInfo: getCtx()
        }, { quoted: mek });

        await m.react('🏳️‍🌈');
    } catch (e) {
        reply('❌ Error running .gay command');
    }
});

// =============================================================================
// ❤️  .love @user
// =============================================================================
cmd({
    pattern: 'love',
    desc: 'Check how much you love someone (%)',
    category: 'fun',
    react: '❤️',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, mentioned, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups.');

        const target = mentioned && mentioned[0]
            ? mentioned[0]
            : null;

        if (!target) return reply('❌ Mention a user!\nUsage: *.love @user*');

        const percent = rand(0, 100);
        let bar = '';
        for (let i = 0; i < 10; i++) bar += i < Math.floor(percent / 10) ? '❤️' : '🖤';

        let label;
        if (percent < 20) label = '😶 Not really...';
        else if (percent < 40) label = '🙂 Just friends';
        else if (percent < 60) label = '😊 It\'s getting warm';
        else if (percent < 80) label = '😍 Deeply in love';
        else label = '💘 SOULMATES DETECTED';

        const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│     ❤️  LOVE METER  ❤️
╰━━━━━━━━━━━━━━━━━━╯

💑 @${sender.split('@')[0]}  ➜  @${target.split('@')[0]}
💗 Love Level: *${percent}%*
${bar}
🏷️ Status: *${label}*

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            mentions: [sender, target],
            contextInfo: getCtx()
        }, { quoted: mek });

        await m.react('❤️');
    } catch (e) {
        reply('❌ Error running .love command');
    }
});

// =============================================================================
// 💌  .loving @user  — romantic message
// =============================================================================
const loveMsgs = [
    "Every second with you feels like a dream I never want to wake up from. 🌙",
    "You are the reason I smile at my phone like an idiot. 😄💕",
    "If love were a crime, I'd gladly go to jail for you. 🔒❤️",
    "You're not just on my mind — you *are* my mind. 🧠💗",
    "The universe made a mistake once — luckily it corrected it by creating you. ✨",
    "I'd cross every ocean, climb every mountain, just to see your notification pop up. 📳💖",
    "You make my heart do things my cardiologist can't explain. 💓",
    "If you were a song, I'd have you on repeat forever. 🎵❤️",
    "You're the WiFi to my phone — lost without you. 📶💘",
    "I don't need stars to light up my night — I have you. 🌟"
];

cmd({
    pattern: 'loving',
    desc: 'Send a random romantic love message to someone',
    category: 'fun',
    react: '💌',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, mentioned, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups.');

        const target = mentioned && mentioned[0] ? mentioned[0] : null;
        if (!target) return reply('❌ Mention a user!\nUsage: *.loving @user*');

        const message = loveMsgs[rand(0, loveMsgs.length - 1)];

        const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│   💌  LOVE MESSAGE  💌
╰━━━━━━━━━━━━━━━━━━╯

💝 From: @${sender.split('@')[0]}
💝 To: @${target.split('@')[0]}

"${message}"

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            mentions: [sender, target],
            contextInfo: getCtx()
        }, { quoted: mek });

        await m.react('💌');
    } catch (e) {
        reply('❌ Error running .loving command');
    }
});

// =============================================================================
// 💑  .daycouple — random couple of the day
// =============================================================================
cmd({
    pattern: 'daycouple',
    alias: ['coupleofday', 'coupleday'],
    desc: 'Pick a random couple of the day from group members',
    category: 'fun',
    react: '💑',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups.');

        const groupData = await conn.groupMetadata(from);
        const members = groupData.participants
            .filter(p => p.id && p.id.endsWith('@s.whatsapp.net'));

        if (members.length < 2) return reply('❌ Not enough members in this group!');

        // Pick 2 unique random members
        const shuffled = members.sort(() => 0.5 - Math.random());
        const p1 = shuffled[0].id;
        const p2 = shuffled[1].id;

        const compatibility = rand(60, 100);
        let bar = '';
        for (let i = 0; i < 10; i++) bar += i < Math.floor(compatibility / 10) ? '💗' : '🖤';

        let status;
        if (compatibility < 75) status = '😊 A cute duo!';
        else if (compatibility < 90) status = '💞 Very compatible!';
        else status = '💘 PERFECT MATCH!';

        const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│  💑  COUPLE OF THE DAY  💑
╰━━━━━━━━━━━━━━━━━━╯

💫 Today's couple in *${groupData.subject}*:

👫  @${p1.split('@')[0]}
        +
     @${p2.split('@')[0]}

💗 Compatibility: *${compatibility}%*
${bar}
🏷️ Status: *${status}*

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            mentions: [p1, p2],
            contextInfo: getCtx()
        }, { quoted: mek });

        await m.react('💑');
    } catch (e) {
        console.error(e);
        reply('❌ Error running .daycouple command');
    }
});

// =============================================================================
// ❌⭕  .tictactoe @user — 2-player TicTacToe
// =============================================================================

function renderBoard(board) {
    const sym = { '': '⬜', X: '❌', O: '⭕' };
    return [0, 1, 2].map(r =>
        board.slice(r * 3, r * 3 + 3).map(c => sym[c]).join('')
    ).join('\n');
}

function checkWinner(b) {
    const lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const [a, bb, c] of lines) {
        if (b[a] && b[a] === b[bb] && b[a] === b[c]) return b[a];
    }
    return b.includes('') ? null : 'draw';
}

cmd({
    pattern: 'tictactoe',
    alias: ['ttt'],
    desc: 'Start a TicTacToe game against another group member',
    category: 'fun',
    react: '❌',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, mentioned, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups.');

        const opponent = mentioned && mentioned[0] ? mentioned[0] : null;
        if (!opponent) return reply('❌ Mention your opponent!\nUsage: *.tictactoe @user*');
        if (opponent === sender) return reply('❌ You cannot play against yourself!');

        if (tttGames[from]) return reply('⚠️ A game is already in progress in this group!\nType *.tttend* to cancel it.');

        tttGames[from] = {
            board: Array(9).fill(''),
            players: { X: sender, O: opponent },
            turn: 'X',
            createdAt: Date.now()
        };

        const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│  ❌⭕  TIC TAC TOE  ❌⭕
╰━━━━━━━━━━━━━━━━━━╯

👤 ❌ @${sender.split('@')[0]}
👤 ⭕ @${opponent.split('@')[0]}

${renderBoard(tttGames[from].board)}

🎮 It's ❌ @${sender.split('@')[0]}'s turn!

📌 To play, type: *.tttplay <1-9>*
The grid positions:
1️⃣2️⃣3️⃣
4️⃣5️⃣6️⃣
7️⃣8️⃣9️⃣

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            mentions: [sender, opponent],
            contextInfo: getCtx()
        }, { quoted: mek });

        await m.react('❌');
    } catch (e) {
        reply('❌ Error starting TicTacToe');
    }
});

cmd({
    pattern: 'tttplay',
    desc: 'Play a move in TicTacToe (1-9)',
    category: 'fun',
    react: '🎮',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, args, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups.');

        const game = tttGames[from];
        if (!game) return reply('❌ No active game! Start one with *.tictactoe @user*');

        const currentPlayer = game.players[game.turn];
        if (sender !== currentPlayer)
            return reply(`⏳ It's not your turn! Waiting for @${currentPlayer.split('@')[0]}`, from, { mentions: [currentPlayer] });

        const pos = parseInt(args[0]);
        if (isNaN(pos) || pos < 1 || pos > 9)
            return reply('❌ Choose a valid position between 1 and 9.');

        const idx = pos - 1;
        if (game.board[idx] !== '')
            return reply('❌ That cell is already taken! Choose another.');

        game.board[idx] = game.turn;

        const winner = checkWinner(game.board);
        const boardStr = renderBoard(game.board);

        if (winner === 'draw') {
            delete tttGames[from];
            return await conn.sendMessage(from, {
                text: `${boardStr}\n\n🤝 *It's a DRAW!* Nobody wins this time.\n\n> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`,
                contextInfo: getCtx()
            }, { quoted: mek });
        }

        if (winner) {
            const winnerJid = game.players[winner];
            delete tttGames[from];
            const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│   🏆  GAME OVER!  🏆
╰━━━━━━━━━━━━━━━━━━╯

${boardStr}

🎉 Winner: ${winner} @${winnerJid.split('@')[0]}

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;
            return await conn.sendMessage(from, {
                text: msg,
                mentions: [winnerJid],
                contextInfo: getCtx()
            }, { quoted: mek });
        }

        // Switch turn
        game.turn = game.turn === 'X' ? 'O' : 'X';
        const nextPlayer = game.players[game.turn];

        const msg =
`${boardStr}

🎮 It's ${game.turn} @${nextPlayer.split('@')[0]}'s turn!
Type *.tttplay <1-9>* to play.

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            mentions: [nextPlayer],
            contextInfo: getCtx()
        }, { quoted: mek });

    } catch (e) {
        reply('❌ Error processing move');
    }
});

cmd({
    pattern: 'tttend',
    desc: 'Cancel the current TicTacToe game',
    category: 'fun',
    react: '🛑',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isGroup, isAdmins }) => {
    try {
        if (!isGroup) return reply('❌ Groups only.');
        const game = tttGames[from];
        if (!game) return reply('❌ No active game to cancel.');
        const isPlayer = Object.values(game.players).includes(sender);
        if (!isPlayer && !isAdmins) return reply('❌ Only players or admins can cancel the game.');
        delete tttGames[from];
        reply('🛑 Game cancelled.');
        await m.react('🛑');
    } catch (e) {
        reply('❌ Error cancelling game');
    }
});

// =============================================================================
// 🎱  .8ball <question> — Magic 8-Ball
// =============================================================================
const eightBallAnswers = [
    '✅ It is certain.', '✅ It is decidedly so.', '✅ Without a doubt.',
    '✅ Yes, definitely!', '✅ You may rely on it.', '✅ As I see it, yes.',
    '✅ Most likely.', '✅ Outlook good.', '✅ Yes.',
    '✅ Signs point to yes.',
    '🤔 Reply hazy, try again.', '🤔 Ask again later.',
    '🤔 Better not tell you now.', '🤔 Cannot predict now.',
    '🤔 Concentrate and ask again.',
    '❌ Don\'t count on it.', '❌ My reply is no.',
    '❌ My sources say no.', '❌ Outlook not so good.',
    '❌ Very doubtful.'
];

cmd({
    pattern: '8ball',
    alias: ['magic8', 'eightball'],
    desc: 'Ask the magic 8-ball a yes/no question',
    category: 'fun',
    react: '🎱',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, args }) => {
    try {
        const question = args.join(' ').trim();
        if (!question) return reply('❓ Ask a question!\nUsage: *.8ball will I be rich?*');

        const answer = eightBallAnswers[rand(0, eightBallAnswers.length - 1)];

        const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│      🎱  MAGIC 8-BALL  🎱
╰━━━━━━━━━━━━━━━━━━╯

❓ *Question:* ${question}

🎱 *Answer:* ${answer}

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            contextInfo: getCtx()
        }, { quoted: mek });

        await m.react('🎱');
    } catch (e) {
        reply('❌ Error running .8ball');
    }
});

// =============================================================================
// 🎰  .ship @user1 @user2 — Compatibility meter between 2 users
// =============================================================================
cmd({
    pattern: 'ship',
    desc: 'Ship two users together and get their compatibility score',
    category: 'fun',
    react: '💘',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, mentioned, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ Groups only.');

        let p1, p2;
        if (mentioned && mentioned.length >= 2) {
            p1 = mentioned[0]; p2 = mentioned[1];
        } else if (mentioned && mentioned.length === 1) {
            p1 = sender; p2 = mentioned[0];
        } else {
            return reply('❌ Mention at least one user!\nUsage: *.ship @user1 @user2*');
        }
        if (p1 === p2) return reply('❌ You can\'t ship someone with themselves!');

        const score = rand(0, 100);
        let bar = '';
        for (let i = 0; i < 10; i++) bar += i < Math.floor(score / 10) ? '💗' : '🖤';

        let label;
        if (score < 20) label = '💀 No chance';
        else if (score < 40) label = '😬 Awkward at best';
        else if (score < 60) label = '🙂 Could work!';
        else if (score < 80) label = '💞 Strong connection!';
        else label = '💘 PERFECT SHIP!';

        const shipName = `${p1.split('@')[0].slice(0, 4)}${p2.split('@')[0].slice(0, 4)}`;

        const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│     💘  SHIP METER  💘
╰━━━━━━━━━━━━━━━━━━╯

💫 @${p1.split('@')[0]} 💗 @${p2.split('@')[0]}
🚢 Ship name: *${shipName}*

📊 Compatibility: *${score}%*
${bar}
🏷️ Status: *${label}*

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            mentions: [p1, p2],
            contextInfo: getCtx()
        }, { quoted: mek });

        await m.react('💘');
    } catch (e) {
        reply('❌ Error running .ship');
    }
});

// =============================================================================
// 🔮  .wouldyourather — "Would you rather" random dilemma
// =============================================================================
const wyrQuestions = [
    ['be able to fly', 'be invisible'],
    ['have unlimited money', 'be immortal'],
    ['lose your memories', 'lose all your friends'],
    ['be famous but hated', 'unknown but loved'],
    ['only eat sweet food forever', 'only eat salty food forever'],
    ['always be 10 minutes late', 'always be 2 hours early'],
    ['speak every language', 'play every instrument'],
    ['have no phone for a year', 'have no music for a year'],
    ['be the funniest person alive', 'be the smartest person alive'],
    ['fight 100 duck-sized horses', 'fight 1 horse-sized duck'],
    ['know when you\'ll die', 'know how you\'ll die'],
    ['live in the past', 'live in the future'],
    ['have a rewind button in life', 'have a pause button in life'],
    ['be always hot', 'be always cold'],
    ['lose your sense of smell', 'lose your sense of taste']
];

cmd({
    pattern: 'wouldyourather',
    alias: ['wyr', 'rather'],
    desc: 'Get a random "Would you rather" question',
    category: 'fun',
    react: '🔮',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const q = wyrQuestions[rand(0, wyrQuestions.length - 1)];

        const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│   🔮  WOULD YOU RATHER?  🔮
╰━━━━━━━━━━━━━━━━━━╯

🅰️ *${q[0].toUpperCase()}*

         ── OR ──

🅱️ *${q[1].toUpperCase()}*

💬 Reply A or B and defend your choice!

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            contextInfo: getCtx()
        }, { quoted: mek });

        await m.react('🔮');
    } catch (e) {
        reply('❌ Error running .wouldyourather');
    }
});

// =============================================================================
// 🤔  .truth — Random truth question
// =============================================================================
const truthQuestions = [
    "What's the most embarrassing thing you've done in public?",
    "Have you ever lied to get out of trouble? What was the lie?",
    "What's a secret you've never told anyone in this group?",
    "Who in this group do you find the most attractive?",
    "What's the weirdest dream you've ever had?",
    "Have you ever cheated on a test or exam?",
    "What's the most childish thing you still do?",
    "Have you ever ghosted someone? Why?",
    "What's your biggest insecurity?",
    "What's something you've done that you'd never want your parents to find out?",
    "Have you ever sent a text to the wrong person? What did it say?",
    "What's the longest you've gone without showering?",
    "Have you ever pretended to be sick to avoid something?",
    "What's the most embarrassing song on your playlist?",
    "Have you ever had a crush on a friend's partner?"
];

cmd({
    pattern: 'truth',
    desc: 'Get a random truth question for truth or dare',
    category: 'fun',
    react: '🤔',
    filename: __filename
}, async (conn, mek, m, { from, mentioned, sender, reply, isGroup }) => {
    try {
        const target = mentioned && mentioned[0] ? mentioned[0] : sender;
        const question = truthQuestions[rand(0, truthQuestions.length - 1)];

        const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│      🤔  TRUTH  🤔
╰━━━━━━━━━━━━━━━━━━╯

🎯 @${target.split('@')[0]}, your TRUTH is:

❓ *"${question}"*

💬 You must answer honestly!

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            mentions: [target],
            contextInfo: getCtx()
        }, { quoted: mek });

        await m.react('🤔');
    } catch (e) {
        reply('❌ Error running .truth');
    }
});

// =============================================================================
// 😈  .dare — Random dare challenge
// =============================================================================
const dares = [
    "Send a voice note singing 'Happy Birthday' right now.",
    "Change your WhatsApp status to 'I love SHINIGAMI MD' for 10 minutes.",
    "Tag 3 people in this group and tell them something nice.",
    "Send a selfie with a funny face in the next 2 minutes.",
    "Type a message using only emojis for the next 5 minutes.",
    "Confess your last lie to the group.",
    "Send a voice note saying 'I am the silliest person in this group'.",
    "Let the next person who messages you choose your WhatsApp profile picture for a day.",
    "Send a screenshot of your most recent conversation.",
    "Write a love poem (minimum 4 lines) about someone in this group.",
    "Send a voice note doing your best impression of an animal.",
    "Reveal your top 3 most contacted people on WhatsApp.",
    "Send a 'good morning' voice note to a family member right now.",
    "Change your name in this group to 'DARE COMPLETED' for 1 hour.",
    "Reply to every message in this group with a compliment for the next 10 minutes."
];

cmd({
    pattern: 'dare',
    desc: 'Get a random dare challenge for truth or dare',
    category: 'fun',
    react: '😈',
    filename: __filename
}, async (conn, mek, m, { from, mentioned, sender, reply }) => {
    try {
        const target = mentioned && mentioned[0] ? mentioned[0] : sender;
        const dare = dares[rand(0, dares.length - 1)];

        const msg =
`╭━━━━━━━━━━━━━━━━━━╮
│       😈  DARE  😈
╰━━━━━━━━━━━━━━━━━━╯

🎯 @${target.split('@')[0]}, your DARE is:

🔥 *"${dare}"*

⚠️ No chickening out!

> Powered by ${config.BOT_NAME || 'SHINIGAMI MD'}`;

        await conn.sendMessage(from, {
            text: msg,
            mentions: [target],
            contextInfo: getCtx()
        }, { quoted: mek });

        await m.react('😈');
    } catch (e) {
        reply('❌ Error running .dare');
    }
});
