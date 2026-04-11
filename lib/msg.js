const { proto, getContentType, jidNormalizedUser } = require('@whiskeysockets/baileys');

const sms = (conn, m) => {
    if (!m) return m;
    let M = proto.WebMessageInfo;
    
    if (m.key) {
        m.id = m.key.id;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = jidNormalizedUser(m.fromMe ? conn.user.id : (m.participant ? m.participant : m.key.participant ? m.key.participant : m.chat));
    }
    
    if (m.message) {
        m.mtype = getContentType(m.message);
        
        // Gestion ViewOnce / Ephemeral
        if (m.mtype === 'viewOnceMessageV2' || m.mtype === 'viewOnceMessage') {
             m.message = m.message[m.mtype].message;
             m.mtype = getContentType(m.message);
        }
        
        m.msg = m.message[m.mtype];
        
        // Récupération du texte (body)
        m.body = (m.mtype === 'conversation') ? m.message.conversation : 
                 (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : 
                 (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : 
                 (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                 (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : 
                 (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : 
                 (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : 
                 (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : '';
                 
        // ─── Build m.quoted from contextInfo (reply detection) ───────────────
        // This allows commands to use m.quoted to detect replied-to messages
        try {
            const ctx = m.mtype === 'extendedTextMessage'
                ? m.message.extendedTextMessage?.contextInfo
                : m.msg?.contextInfo;

            if (ctx && ctx.quotedMessage) {
                const qMsg = ctx.quotedMessage;
                const qMtype = getContentType(qMsg);
                const qMsgContent = qMsg[qMtype];

                m.quoted = {
                    key: {
                        remoteJid: m.chat,
                        fromMe: ctx.participant === (conn.user?.id?.split(':')[0] + '@s.whatsapp.net'),
                        id: ctx.stanzaId,
                        participant: ctx.participant
                    },
                    message: qMsg,
                    mtype: qMtype,
                    msg: qMsgContent,
                    mimetype: qMsgContent?.mimetype || '',
                    sender: ctx.participant || '',
                };
            }
        } catch (e) {
            // ignore quoted parsing errors
        }

        // Alias pour répondre facilement
        m.reply = (text, chatId = m.chat, options = {}) => {
            return conn.sendMessage(chatId, { text: text }, { quoted: m, ...options });
        };
    }
    return m;
};

module.exports = { sms };
                                             
