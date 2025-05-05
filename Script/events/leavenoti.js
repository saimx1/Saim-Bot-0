module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "SAIM",
	description: "إشعار عند مغادرة شخص أو طرد شخص من المجموعة بصورة أو فيديو عشوائي",
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.onLoad = function () {
	const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const { join } = global.nodemodule["path"];

	const path = join(__dirname, "cache", "leaveGif", "randomgif");
	if (!existsSync(path)) mkdirSync(path, { recursive: true });

	return;
}

module.exports.run = async function({ api, event, Users, Threads }) {
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

	const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
	const { join } = global.nodemodule["path"];
	const { threadID } = event;
	const moment = require("moment-timezone");

	const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
	const hours = moment.tz("Asia/Dhaka").format("HH");

	const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
	const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
	const type = (event.author == event.logMessageData.leftParticipantFbId) ? "خرج بنفسه" : "تم طرده";
	const path = join(__dirname, "events", "123.mp4");
	const pathGif = join(path, `${threadID}123.mp4`);

	var msg, formPush;
	if (!existsSync(path)) mkdirSync(path, { recursive: true });

	(typeof data.customLeave == "undefined") ? msg = `
╭════ ⊰ تنبيه هام ⊱ ════╮
⚠️ شخص غادر المجموعة ⚠️
╰════ ⊰ ⊱ ════╯

{session} || {name}
لقد غادر المجموعة للتو...

نشعر بالحزن لرحيله، ونتمنى له التوفيق أينما ذهب.

⏰ التاريخ والوقت: {time}
⚙️ الحالة: {type}
✍️ شاركنا شعورك حول هذا الرحيل...
` : msg = data.customLeave;

	msg = msg
		.replace(/\{name}/g, name)
		.replace(/\{type}/g, type)
		.replace(/\{session}/g,
			hours <= 10 ? "صباح الخير" :
			hours > 10 && hours <= 12 ? "الظهيرة" :
			hours > 12 && hours <= 18 ? "المساء" : "الليل")
		.replace(/\{time}/g, time);

	const randomPath = readdirSync(join(__dirname, "cache", "leaveGif", "randomgif"));

	if (existsSync(pathGif)) {
		formPush = { body: msg, attachment: createReadStream(pathGif) }
	} else if (randomPath.length != 0) {
		const pathRandom = join(__dirname, "cache", "leaveGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
		formPush = { body: msg, attachment: createReadStream(pathRandom) }
	} else {
		formPush = { body: msg }
	}

	return api.sendMessage(formPush, threadID);
	}
