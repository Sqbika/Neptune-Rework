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
            "ping": {
                name: "Pong!",
                prefix: "ping",
                permission: "ping",
                parameters: [],
                handler: pingpong,
                usage: "ping",
                help: "Pongs back"
            }

        }
    }
}

function help (bot, msg) {
    bot.queueMessage(msg.channel, bot.cFactory.getHelpString());
} 

function pingpong(bot, msg) {
    var start = new Date();
    bot.queueMessage(msg.channel, "Pong!", function (msg) {
        msg.updateMessage("Pong!\n Took: " + (new Date - start) + " ms");
    });
}
