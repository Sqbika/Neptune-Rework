var Clever = require('./submodules/clever.js');
var cb = new Clever;

module.exports = {
    "MODULE": {
        name: "Cleverbot",
        permission: "cbot",
        author: "Zephy",
        version: "something something beta",
        commands: {
            "cb": {
                name: "Talk with a bot",
                prefix: "cb",
                permission: "help",
                parameters: [],
                handler: cbot,
                usage: "cb <text>",
                help: "cb to talk with bot"
            }
        }
    }
}

function cbot(bot, msg) {
    Clever.prepare(function() {
        cb.write(msg.content.substring(7), function(response) {
            bot.queueMessage(msg.channel, "[CB] - " + response.message);
        });
    })
}