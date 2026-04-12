const { cmd } = require('../momy');
const config = require('../config');

const myquoted = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© SHINIGAMI-MD",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN: SHINIGAMI MD\nORG:SHINIGAMI-MD;\nTEL;type=CELL;type=VOICE;waid=554488138425:+554488138425\nEND:VCARD`
    }
  }
};

const fancyStyles = [
  t => [...t].map(c => {
    const n = c.charCodeAt(0);
    if (n >= 65 && n <= 90) return String.fromCodePoint(0x1D400 + n - 65);
    if (n >= 97 && n <= 122) return String.fromCodePoint(0x1D41A + n - 97);
    return c;
  }).join(''),

  t => [...t].map(c => {
    const n = c.charCodeAt(0);
    if (n >= 65 && n <= 90) return String.fromCodePoint(0x1D468 + n - 65);
    if (n >= 97 && n <= 122) return String.fromCodePoint(0x1D482 + n - 97);
    return c;
  }).join(''),

  t => [...t].map(c => {
    const n = c.charCodeAt(0);
    if (n >= 65 && n <= 90) return String.fromCodePoint(0x1D434 + n - 65);
    if (n >= 97 && n <= 122) return String.fromCodePoint(0x1D44E + n - 97);
    return c;
  }).join(''),

  t => [...t].map(c => {
    const n = c.charCodeAt(0);
    if (n >= 65 && n <= 90) return String.fromCodePoint(0x1D4D0 + n - 65);
    if (n >= 97 && n <= 122) return String.fromCodePoint(0x1D4EA + n - 97);
    return c;
  }).join(''),

  t => [...t].map(c => {
    const n = c.charCodeAt(0);
    if (n >= 65 && n <= 90) return String.fromCodePoint(0x1D538 + n - 65);
    if (n >= 97 && n <= 122) return String.fromCodePoint(0x1D552 + n - 97);
    return c;
  }).join(''),

  t => [...t].map(c => {
    const n = c.charCodeAt(0);
    if (n >= 65 && n <= 90) return String.fromCodePoint(0x1D56C + n - 65);
    if (n >= 97 && n <= 122) return String.fromCodePoint(0x1D586 + n - 97);
    return c;
  }).join(''),

  t => [...t].map(c => {
    const n = c.charCodeAt(0);
    if (n >= 65 && n <= 90) return String.fromCodePoint(0x1D5A0 + n - 65);
    if (n >= 97 && n <= 122) return String.fromCodePoint(0x1D5BA + n - 97);
    return c;
  }).join(''),

  t => [...t].map(c => {
    const n = c.charCodeAt(0);
    if (n >= 65 && n <= 90) return String.fromCodePoint(0x1D5D4 + n - 65);
    if (n >= 97 && n <= 122) return String.fromCodePoint(0x1D5EE + n - 97);
    return c;
  }).join(''),

  t => [...t].map(c => {
    const n = c.charCodeAt(0);
    if (n >= 65 && n <= 90) return String.fromCodePoint(0x1D608 + n - 65);
    if (n >= 97 && n <= 122) return String.fromCodePoint(0x1D622 + n - 97);
    return c;
  }).join(''),

  t => [...t].map(c => {
    const n = c.charCodeAt(0);
    if (n >= 65 && n <= 90) return String.fromCodePoint(0x1D63C + n - 65);
    if (n >= 97 && n <= 122) return String.fromCodePoint(0x1D656 + n - 97);
    return c;
  }).join(''),

  t => [...t].map(c => {
    const map = 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ';
    const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const i = alpha.indexOf(c);
    return i !== -1 ? map[i] : c;
  }).join(''),

  t => [...t].map(c => {
    const map = { a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z' };
    return map[c.toLowerCase()] || c;
  }).join('').split('').reverse().join(''),

  t => [...t].map(c => {
    const map = { a:'卂',b:'乃',c:'匚',d:'刀',e:'乇',f:'下',g:'厶',h:'卄',i:'工',j:'丁',k:'长',l:'乚',m:'从',n:'几',o:'口',p:'尸',q:'囚',r:'尺',s:'丂',t:'丅',u:'凵',v:'リ',w:'山',x:'乂',y:'丫',z:'乙' };
    return map[c.toLowerCase()] || c;
  }).join(''),

  t => [...t].map(c => {
    const map = { a:'α',b:'в',c:'¢',d:'∂',e:'є',f:'ƒ',g:'g',h:'н',i:'ι',j:'נ',k:'к',l:'ℓ',m:'м',n:'η',o:'σ',p:'ρ',q:'q',r:'я',s:'ѕ',t:'т',u:'υ',v:'ν',w:'ω',x:'χ',y:'у',z:'z' };
    return map[c.toLowerCase()] || c;
  }).join(''),

  t => [...t].map(c => {
    const map = { a:'Λ',b:'ß',c:'¢',d:'Ð',e:'É',f:'£',g:'G',h:'Ħ',i:'Ì',j:'J',k:'K',l:'Ł',m:'M',n:'N',o:'Ø',p:'Þ',q:'Q',r:'Ř',s:'Š',t:'Ŧ',u:'Ú',v:'V',w:'W',x:'X',y:'Ý',z:'Ž' };
    return map[c.toLowerCase()] || c;
  }).join(''),

  t => [...t].map(c => {
    const map = { a:'₳',b:'฿',c:'₵',d:'Đ',e:'Ɇ',f:'₣',g:'₲',h:'Ħ',i:'ł',j:'J',k:'₭',l:'Ⱡ',m:'₥',n:'₦',o:'Ø',p:'₱',q:'Q',r:'Ɽ',s:'₴',t:'₮',u:'Ʉ',v:'V',w:'₩',x:'Ӿ',y:'Ɏ',z:'Ƶ' };
    return map[c.toLowerCase()] || c;
  }).join(''),

  t => [...t].map(c => {
    const map = { a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃' };
    return map[c.toLowerCase()] || c;
  }).join(''),

  t => [...t].map(c => {
    const map = { a:'a̷',b:'b̷',c:'c̷',d:'d̷',e:'e̷',f:'f̷',g:'g̷',h:'h̷',i:'i̷',j:'j̷',k:'k̷',l:'l̷',m:'m̷',n:'n̷',o:'o̷',p:'p̷',q:'q̷',r:'r̷',s:'s̷',t:'t̷',u:'u̷',v:'v̷',w:'w̷',x:'x̷',y:'y̷',z:'z̷' };
    return map[c.toLowerCase()] || c;
  }).join(''),

  t => [...t].map(c => {
    const map = { a:'a͎',b:'b͎',c:'c͎',d:'d͎',e:'e͎',f:'f͎',g:'g͎',h:'h͎',i:'i͎',j:'j͎',k:'k͎',l:'l͎',m:'m͎',n:'n͎',o:'o͎',p:'p͎',q:'q͎',r:'r͎',s:'s͎',t:'t͎',u:'u͎',v:'v͎',w:'w͎',x:'x͎',y:'y͎',z:'z͎' };
    return map[c.toLowerCase()] || c;
  }).join(''),

  t => [...t].map(c => {
    const map = { a:'ꋫ',b:'ꃃ',c:'ꉗ',d:'ꁕ',e:'ꂵ',f:'ꄘ',g:'ꁍ',h:'ꍩ',i:'ꂑ',j:'ꀭ',k:'ꀗ',l:'꒒',m:'ꂵ',n:'ꁹ',o:'ꄲ',p:'ꉣ',q:'ꁷ',r:'ꋪ',s:'ꌚ',t:'꓄',u:'ꐇ',v:'ꏝ',w:'ꅐ',x:'ꉧ',y:'ꐞ',z:'ꁴ' };
    return map[c.toLowerCase()] || c;
  }).join('')
];

const styleNames = [
  'Bold Serif', 'Bold Script', 'Italic Serif', 'Bold Italic Script',
  'Double Struck', 'Bold Fraktur', 'Sans Serif', 'Bold Sans',
  'Italic Sans', 'Bold Italic Sans', 'Full Width', 'Upside Down',
  'Chinese Style', 'Greek Mix', 'Euro Mix', 'Coin Style',
  'Cursive Bold', 'Strikethrough', 'Underwave', 'Aesthetic'
];

cmd({
  pattern: "fancy",
  alias: ["fancytext", "styletext"],
  desc: "Convert text into 20 fancy styles",
  category: "general",
  react: "✨",
  filename: __filename
},
async (conn, mek, m, { from, sender, reply, q }) => {
  try {
    if (!q) {
      return reply(`Usage: .fancy your text here\n\nExample: .fancy inconnu boy`);
    }

    const menu = fancyStyles.map((fn, i) =>
      `*${i + 1}.* ${fn(q)}`
    ).join('\n');

    const sentMsg = await conn.sendMessage(from, {
      text: `Fancy styles for: *${q}*\n\nReply with a number (1-20) to choose:\n\n${menu}\n\n_Reply this message with your choice_`,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
          newsletterName: 'SHINIGAMI MD',
          serverMessageId: 13
        }
      }
    }, { quoted: myquoted });

    const messageID = sentMsg.key.id;

    const messageHandler = async (msgData) => {
      if (!msgData.messages) return;
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const isReply = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
      const senderID = receivedMsg.key.remoteJid;

      if (isReply && senderID === from) {
        const choice = parseInt(receivedText?.trim());

        if (!choice || choice < 1 || choice > 20) {
          await conn.sendMessage(senderID, {
            text: `Invalid choice. Reply with a number between 1 and 20.`,
            contextInfo: {
              mentionedJid: [sender],
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
                newsletterName: 'SHINIGAMI MD',
                serverMessageId: 13
              }
            }
          }, { quoted: myquoted });
        } else {
          const styled = fancyStyles[choice - 1](q);
          await conn.sendMessage(senderID, {
            text: `*Style ${choice} - ${styleNames[choice - 1]}*\n\n${styled}`,
            contextInfo: {
              mentionedJid: [sender],
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.CHANNEL_JID_1 || '120363403408693274@newsletter',
                newsletterName: 'SHINIGAMI MD',
                serverMessageId: 13
              }
            }
          }, { quoted: myquoted });
        }

        conn.ev.off('messages.upsert', messageHandler);
      }
    };

    conn.ev.on('messages.upsert', messageHandler);
    setTimeout(() => conn.ev.off('messages.upsert', messageHandler), 60000);

  } catch (error) {
    console.error('Fancy error:', error.message);
    reply(`Fancy command failed. Please try again.`);
  }
});
