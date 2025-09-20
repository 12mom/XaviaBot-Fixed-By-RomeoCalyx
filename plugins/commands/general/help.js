module.exports.config = {
  name: "اوامر",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "حمودي سان 🇸🇩",
  description: "قائمة الأوامر كاملة",
  commandCategory: "النظام",
  usages: "[Name module]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "💖✨ 「 %1 」 ✨💖\n🌸 %2 🌸\n\n📌 Usage: %3\n📂 Category: %4\n⏳ Waiting time: %5 seconds\n👑 Permission: %6\n\n💝 Coded with love by %7 💝",
    "helpList": "🌷💖 There are %1 lovely commands in Dora Bot! 💖🌷\nUse: ✨ “%2help nameCommand” ✨ to see how to use each one! 🌸\n━━━━━━━━━━━━━━━━━━━",
    "user": "🌸 Sweet User 🌸",
    "adminGroup": "💎 Group Princess (Admin) 💎",
    "adminBot": "👑 Dora’s Magical Admin 👑"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "cmd" || body.indexOf("help") != 0) return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  return api.sendMessage(
    getText("moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      ((command.config.hasPermssion == 0) ? getText("user") :
        (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 100;
    let i = 0;

    let msg = "✧･ﾟ: *✧･ﾟ:* 　　 *:･ﾟ✧*:･ﾟ✧\n";
    msg += "💖🌸 Bot Commands ᏴϴᏆ. ぐ愛 🌸💖\n";
    msg += "✧･ﾟ: *✧･ﾟ:* 　　 *:･ﾟ✧*:･ﾟ✧\n\n";

    for (var [name] of (commands)) {
      arrayInfo.push(name);
    }

    arrayInfo.sort();

    const startSlice = numberOfOnePage * page - numberOfOnePage;
    i = startSlice;
    const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

    for (let item of returnArray) {
      msg += `🌸✨ ${++i}. 『${item}』 ✨🌸\n`;
      msg += `💖 Description: ${commands.get(item).config.description}\n`;
      msg += "━━━━━━━━━━━━━━━ 💕\n\n";
    }

    msg += `💗✧･ﾟ:* *:･ﾟ✧💗\n`;
    msg += `📖 Page: (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})\n`;
    msg += `👑 Prefix: °${prefix}°\n`;
    msg += `📜 Total Commands: ${arrayInfo.length}\n`;
    msg += "💗✧･ﾟ:* *:･ﾟ✧💗";

    return api.sendMessage(msg, threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
        return api.unsendMessage(info.messageID);
      }
    });
  }

  return api.sendMessage(
    getText("moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      ((command.config.hasPermssion == 0) ? getText("user") :
        (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
      command.config.credits
    ),
    threadID,
    messageID
  );
};
