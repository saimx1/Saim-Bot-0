module.exports.config = {
  name: "autosend",
  eventType: [],
  version: "0.0.1",
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "إرسال تلقائي للرسائل في وقت محدد"
};

module.exports.run = async({ event, api, Threads, Users }) => {
  const moment = require("moment-timezone");
  time = moment.tz('Asia/Dhaka').format('HH:mm:ss');
  var cantsend = [];
  var allThread = global.data.allThreadID || [];

  if (time == "17:22:00") { // هذا هو التوقيت الذي يتم فيه الإرسال التلقائي
    for (const idThread of allThread) {
      if (isNaN(parseInt(idThread)) || idThread == event.threadID) ""
      else {
        api.sendMessage("اختبار" + args.join(" ") , idThread, (error, info) => {
          if (error) cantsend.push(idThread);
        });
      }
    }

    for (var id of global.config.ADMINBOT) {
      api.sendMessage(
        `حدثت أخطاء أثناء إرسال الرسائل تلقائياً للمجموعات التالية:\n${cantsend.join("\n")}`,
        id
      );
    }
  }
}
