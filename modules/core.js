module.exports = {
    "MODULE": {
        name: "Core Module",
        permission: "core",
        author: "Sqbika",
        version: "0.21",
        commands: {
            "help": {
                name: "Prints out Help",
                prefix: "help",
                permission: "help",
                parameters: [],
                handler: help,
                usage: "help",
                help: "Prints out avaliable commands."
            },

        }
    }
}

function help (bot, msg) {
    bot.queueMessage(msg.channel, bot.cFactory.getHelpString);
} 