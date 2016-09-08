var cfg = require("../config.json");

var evalPrefix = "eval";

module.exports = {
    "MODULE": {
        name: "Admin Module",
        permission: "admin",
        author: "Sqbika",
        version: 0.1,
        commands: {
            "eval": {
                name: "Eval",
                prefix: evalPrefix,
                permission: "eval",
                parameters: [],
                handler: eval,
                usage: "eval <program code>",
                help: "Evaluates code."
            }
        }
    }
}

function eval(bot, msg, args, callback) {
    try {
        bot.queueMessage(msg.channel, "```xl\nInput: " + msg.content.substring(cfg.prefix.length + 2 + evalPrefix.length) + "\nResult: " + eval(msg.content.substring(cfg.prefix.length + 2 + module.EXPORTS.MODULE.commands.eval.prefix)) + "\n```");
    } catch (err) {
        bot.queueMessage(msg.channel, "```xl\nInput: " + msg.content.substring(cfg.prefix.length + 2 + evalPrefix.length) + "\nError: " + err.message + "\n```")
        console.log(err);
    }
}