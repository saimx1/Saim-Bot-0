const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "اوامر",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "عرض قائمة الأوامر المتاحة",
  commandCategory: "النظام",
  usages: "[اسم الأمر]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  "ar": {
    "moduleInfo": "╭──────•◈•──────╮\n│ اسم الأمر: %1\n│ الوصف: %2\n│ الاستخدام: %3\n│ الفئة: %4\n│ وقت الانتظار: %5 ثانية\n│ الصلاحيات المطلوبة: %6\n│ المطور: %7\n╰──────•◈•──────╯",
    "helpList": "📜 يحتوي البوت على %1 أمرًا. استخدم: \"%2اوامر [اسم الأمر]\" لمعرفة كيفية الاستخدام.",
    "user": "مستخدم",
    "adminGroup": "مشرف المجموعة",
    "adminBot": "مشرف البوت"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined" || body.indexOf("اوامر") != 0) return;
  const splitBody = body.slice(body.indexOf("اوامر")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (args[0] == "الكل") {
    const commandList = commands.values();
    var group = [], msg = "";
    for (const commandConfig of commandList) {
      if (!group.some(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase())) group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
      else group.find(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
    }
    group.forEach(commandGroup => msg += `❄️ ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} \n${commandGroup.cmds.join(' • ')}\n\n`);

    return axios.get('https://loidsenpaihelpapi.miraiandgoat.repl.co').then(res => {
      let ext = res.data.data.substring(res.data.data.lastIndexOf(".") + 1);
      let admID = "61551846081032";

      api.getUserInfo(parseInt(admID), (err, data) => {
        if (err) { return console.log(err) }
        var obj = Object.keys(data);
        var firstname = data[obj].name.replace("@", "");
        let callback = function () {
          api.sendMessage({
            body: `✿🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃✿\n\n` + msg + `✿══════════════✿\n│ استخدم ${prefix}اوامر [اسم الأمر]\n│ استخدم ${prefix}اوامر [رقم الصفحة]\n│ المطور: Ullash ッ\n│ الإجمالي: ${commands.size}\n————————————`,
            mentions: [{
              tag: firstname,
              id: admID,
              fromIndex: 0,
            }],
            attachment: fs.createReadStream(__dirname + `/cache/472.${ext}`)
          }, event.threadID, (err, info) => {
            fs.unlinkSync(__dirname + `/cache/472.${ext}`);
            if (autoUnsend == false) {
              setTimeout(() => {
                return api.unsendMessage(info.messageID);
              }, delayUnsend * 1000);
            }
            else return;
          }, event.messageID);
        };
        request(res.data.data).pipe(fs.createWriteStream(__dirname + `/cache/472.${ext}`)).on("close", callback);
      });
    });
  };

  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 15;
    let i = 0;
    let msg = "";

    for (var [name, value] of (commands)) {
      name += ``;
      arrayInfo.push(name);
    }

    arrayInfo.sort((a, b) => a.data - b.data);
    const first = numberOfOnePage * page - numberOfOnePage;
    i = first;
    const helpView = arrayInfo.slice(first, first + numberOfOnePage);

    for (let cmds of helpView) msg += `•—»[ ${cmds} ]«—•\n`;
    const siu = `╭──────•◈•──────╮\n│ قائمة الأوامر\n╰──────•◈•──────╯`;
    const text = `╭──────•◈•──────╮\n│ استخدم ${prefix}اوامر [اسم الأمر]\n│ استخدم ${prefix}اوامر [رقم الصفحة]\n│ المطور: Ullash ッ\n│ الإجمالي: [${arrayInfo.length}]\n│ الصفحة: [${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)}]\n╰──────•◈•──────╯`;
    var link = [
      "https://tenor.com/view/sung-jin-woo-solo-leveling-jin-woo-anime-gif-27709429"
    ];
    var callback = () => api.sendMessage({ body: siu + "\n\n" + msg + text, attachment: fs.createReadStream(__dirname + "/cache/solo_leveling.gif") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/solo_leveling.gif"), event.messageID);
    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/solo_leveling.gif")).on("close", () => callback());
  }

  const leiamname = getText("moduleInfo", command.config.name, command.config.description, `${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits);

  var link = [
    "https://tenor.com/view/sung-jin-woo-solo-leveling-jin-woo-anime-gif-27709429"
  ];
  var callback = () => api.sendMessage({ body: leiamname, attachment: fs.createReadStream(__dirname + "/cache/solo_leveling.gif") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/solo_leveling.gif"), event.messageID);
  return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/solo_leveling.gif")).on("close", () => callback());
};
