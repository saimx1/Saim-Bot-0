module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "0.0.1",
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "استماع لخروج الأعضاء"
};

module.exports.run = async({ event, api, Threads, Users }) => {
  let data = (await Threads.getData(event.threadID)).data || {};
  if (data.antiout == false) return;
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? "خروج ذاتي" : "تم إخراجه";

  if (type == "خروج ذاتي") {
    api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
      if (error) {
        api.sendMessage(`عذراً، لم أتمكن من إعادة ${name} إلى المجموعة.\nقد يكون قام بحظر البوت أو أن إعدادات حسابه تمنع إضافته مجدداً.`, event.threadID);
      } else {
        api.sendMessage(`اسمع، ${name} هذه المجموعة ليست مكاناً للخروج بدون إذن!\nلقد غادرت دون موافقة، وها أنا أعيدك بأسلوبي الخاص.`, event.threadID);
      }
    });
  }
}
