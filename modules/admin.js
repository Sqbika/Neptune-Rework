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
            },

            "addPerm": {
                name: "Permission Adder",
                prefix: "addPerm",
                permission: "addPerm",
                parameters: [{
                    id: "user",
                    type: "user resolvable",
                    req: true
                }, {
                    id: "permission",
                    type: "string",
                    req: true
                }],
                handler: addPerm,
                usage: "addPerm [user] [permission]",
                help: "Add permission to User"
            },
            
            "removePerm": {
                name: "Permission Remover",
                prefix: "removePerm",
                permission: "removePerm",
                parameters: [{
                    id: "user",
                    type: "user resolvable",
                    req: true
                }, {
                    id: "permission",
                    type: "string",
                    req: true
                }],
                handler: removePerm,
                usage: "removePerm [user] [permission]",
                help: "Remove permission from User"
            }
        }
    }
}

function eval(bot, msg, args, callback) {
    try {
        bot.queueMessage(msg.channel, "```xl\nInput: " + msg.content.substring(cfg.prefix.length + 2 + evalPrefix.length) + "\nResult: " + eval(msg.content.substring(cfg.prefix.length + 2 + module.exports.MODULE.commands.eval.prefix)) + "\n```");
    } catch (err) {
        bot.queueMessage(msg.channel, "```xl\nInput: " + msg.content.substring(cfg.prefix.length + 2 + evalPrefix.length) + "\nError: " + err.message + "\n```")
        console.log(err);
    }
}

function addPerm (bot, msg, args) {
    bot.pSystem.addPermission(args[0], args[1], function (err, errMSG) {
        bot.queueMessage(msg.channel, errMSG);
    });
}

function removePerm(bot, msg, args) {
    bot.pSystem.removePermission(args[0], args[1], function (err, errMSG) {
        bot.queueMessage(msg.channel, errMSG);
    });
}