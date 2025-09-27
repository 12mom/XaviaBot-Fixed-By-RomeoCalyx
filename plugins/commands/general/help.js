async function onCall({ message, args, getLang, userPermissions, prefix }) {
    const { commandsConfig } = global.plugins;
    const commandName = args[0]?.toLowerCase();

    if (!commandName) {
        let commands = {};
        const language = message.thread?.data?.language || global.config.LANGUAGE || 'ar_SY';

        // ترتيب الأوامر وتجميعها حسب الفئة
        for (const [key, value] of commandsConfig.entries()) {
            if (!!value.isHidden) continue;
            if (!!value.isAbsolute ? !global.config?.ABSOLUTES.some(e => e == message.senderID) : false) continue;
            if (!value.hasOwnProperty("permissions")) value.permissions = [0, 1, 2];
            if (!value.permissions.some(p => userPermissions.includes(p))) continue;
            if (!commands.hasOwnProperty(value.category)) commands[value.category] = [];
            commands[value.category].push(value._name && value._name[language] ? value._name[language] : key);
        }

        // إرسال الرسالة الأولى
        await message.reply("👀 أين المساعدة؟ أنا لا أراها ...");

        // تقسيم الأوامر لصفحات (كل صفحة 20)
        const allCategories = Object.keys(commands);
        let allCommands = [];
        allCategories.forEach(category => {
            const cmds = commands[category].map(c => `⭐🍭 ${c} 🍭⭐`);
            allCommands.push(`⌈ ✨ ${category.toUpperCase()} ✨ ⌋\n${cmds.join("\n")}`);
        });

        const flatCommands = allCommands.join("\n\n").split("\n");
        const pageSize = 20;
        for (let i = 0; i < flatCommands.length; i += pageSize) {
            const page = flatCommands.slice(i, i + pageSize).join("\n");
            await message.reply(`${page}\n\n⭐🍭 Dora Bot 🍭⭐\nالمطور: 𝓗𝓪𝓶𝓸𝓸𝓭𝔂 𝓢𝓪𝓷 🇸🇩`);
        }
    } else {
        const command = commandsConfig.get(getCommandName(commandName, commandsConfig));
        if (!command) return message.reply(getLang("help.commandNotExists", { command: commandName }));

        const isHidden = !!command.isHidden;
        const isUserValid = !!command.isAbsolute ? global.config?.ABSOLUTES.some(e => e == message.senderID) : true;
        const isPermissionValid = command.permissions.some(p => userPermissions.includes(p));
        if (isHidden || !isUserValid || !isPermissionValid)
            return message.reply(getLang("help.commandNotExists", { command: commandName }));

        message.reply(getLang("help.commandDetails", {
            name: command.name,
            aliases: command.aliases.join(", "),
            version: command.version || "1.0.0",
            description: command.description || '',
            usage: `${prefix}${commandName} ${command.usage || ''}`,
            permissions: command.permissions.map(p => getLang(String(p))).join(", "),
            category: command.category,
            cooldown: command.cooldown || 3,
            credits: command.credits || ""
        }).replace(/^ +/gm, ''));
    }
}
