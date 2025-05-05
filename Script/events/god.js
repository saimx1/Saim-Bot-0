module.exports.config = {
	name: "god",
	eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
	version: "1.0.0",
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "تسجيل إشعارات نشاط البوت!",
	envConfig: {
		enable: true
	}
};

module.exports.run = async function({ api, event, Threads }) {
	const logger = require("../../utils/log");
	if (!global.configModule[this.config.name].enable) return;

	var formReport =  "=== إشعار من البوت ===" +
					  "\n\n» رقم معرف المجموعة: " + event.threadID +
					  "\n» النشاط: {task}" +
					  "\n» تم بواسطة المستخدم صاحب المعرف: " + event.author +
					  "\n» " + Date.now() + " «",
		task = "";

	switch (event.logMessageType) {
		case "log:thread-name": {
			const oldName = (await Threads.getData(event.threadID)).name || "لا يوجد اسم سابق",
				  newName = event.logMessageData.name || "لا يوجد اسم جديد";
			task = "قام أحد المستخدمين بتغيير اسم المجموعة من: '" + oldName + "' إلى '" + newName + "'";
			await Threads.setData(event.threadID, { name: newName });
			break;
		}
		case "log:subscribe": {
			if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID()))
				task = "تمت إضافة البوت إلى مجموعة جديدة!";
			break;
		}
		case "log:unsubscribe": {
			if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID())
				task = "قام أحد المستخدمين بطرد البوت من المجموعة!";
			break;
		}
		default:
			break;
	}

	if (task.length == 0) return;

	formReport = formReport.replace(/\{task}/g, task);
	var god = "100086680386976"; // عدّل هذا إلى معرفك إذا أردت أن تصلك الإشعارات

	return api.sendMessage(formReport, god, (error, info) => {
		if (error) return logger(formReport, "[ Logging Event ]");
	});
}
