module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "SAIM",
    description: "إرسال إشعار عند دخول شخص أو البوت إلى المجموعة بصورة أو فيديو عشوائي",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "joinvideo");
    if (!existsSync(path)) mkdirSync(path, { recursive: true }); 

    const path2 = join(__dirname, "cache", "joinvideo", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}

module.exports.run = async function({ api, event }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    const fs = require("fs");

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "بوت"} `, threadID, api.getCurrentUserID());

        return api.sendMessage("", threadID, () => 
            api.sendMessage({
                body: `مرحباً بكم في المجموعة!
شكراً لإضافتي، أنا في خدمتك دائماً إن شاء الله.

لعرض الأوامر:
${global.config.PREFIX}مساعدة

اسم البوت: ${global.config.BOTNAME || "SAIM - BOT"}
`, 
                attachment: fs.createReadStream(__dirname + "/cache/ullash.mp4")
            }, threadID)
        );
    } else {
        try {
            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const path = join(__dirname, "cache", "joinvideo");
            const pathGif = join(path, `${threadID}.video`);

            var mentions = [], nameArray = [], memLength = [], i = 0;

            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }

            memLength.sort((a, b) => a - b);
            let msg = threadData.customJoin || 
`مرحباً {name}، 
أهلاً بك في مجموعتنا "{threadName}"!
أنت العضو رقم {soThanhVien}.
نتمنى لك وقتاً ممتعاً معنا!`;

            msg = msg
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, (memLength.length > 1) ? 'الأصدقاء' : 'الصديق')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));

            let formPush;
            if (existsSync(pathGif)) {
                formPush = { body: msg, attachment: createReadStream(pathGif), mentions };
            } else if (randomPath.length != 0) {
                const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", randomPath[Math.floor(Math.random() * randomPath.length)]);
                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions };
            } else {
                formPush = { body: msg, mentions };
            }

            return api.sendMessage(formPush, threadID);
        } catch (e) { 
            return console.log(e); 
        }
    }
             }
