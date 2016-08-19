var INITIALIZATION_MS = new Date();
var Discord = require('discord.js');
var config = require('./config.json');
var Nepify = require('./core_modules/nepify.js');
var helper = require('./helper.js');
var execPath = require('./core_modules/commandExec.js');
var PSystem = require('./core_modules/permission/permissionSystem.js');

var cmdFactory = new (require('./core_modules/commandFactory.js'));


Discord.Client.prototype.queueMessage = function(channel, message) {
    function queueIt(channel, message) {
        messageQueue.push({
            channel: channel,
            message: message
        });
    }
    if (message.length > 1990) {
        sendIt(channel, "It's a bit length message. Let me split it for you!");
        var chunks = chunkMessage(message);
        chunks.forEach(m => queueIt(channel, message));
    } else {
        queueIt(channel, message);
    }
    rollChat();
}

var messageQueue = [];

function trySend(msg, callback) {
    bot.sendMessage(msg.channel, msg.message, function(err, msg) {
        if (err) {
            if (err == 429) {
                log.log("Rate Limited. Trying again in 2 seconds.", "LOG");
                setTimeout(function() {
                    trySend(callback)
                }, 2000);
            } else log.log("Cannot send message. Error:" + err, "ERROR");
        }
        else {
            callback(err, msg);
        }
    });
}

function rollChat() {
    var msg = messageQueue.shift();
    trySend(msg, function (err, msg) {
        if (!err) {
            rollChat();
        }
    });
}

Discord.Client.prototype.chunkMessage = function(message) {
    //Source: Windsdon
    //Github: https://github.com/Windsdon/discord-bot-core/blob/master/lib/discord-bot.js
    chunkSize = chunkSize || 1990;
    var preChunks = [];
    message.split("\n").forEach(function(v) {
        if (v.length < chunkSize) {
            preChunks.push(v);
        } else {
            var vParts = [""];
            v.split(" ").forEach(function(vv) {
                if (vv.length > chunkSize) {
                    var vvParts = vv.match(new RegExp('.{1,' + chunkSize + '}', 'g'));
                    vParts = vParts.concat(vvParts);
                } else {
                    if (vParts[vParts.length - 1].length + vv.length < chunkSize) {
                        vParts[vParts.length - 1] += " " + vv
                    } else {
                        vParts.push(vv);
                    }
                }
            });
            vParts.forEach(function(v) {
                preChunks.push(v);
            });
        }
    });

    var chunks = [""];
    while (preChunks.length > 0) {
        var str = preChunks.shift();
        if (chunks[chunks.length - 1].length + str.length < chunkSize) {
            chunks[chunks.length - 1] += str + "\n";
        } else {
            if (/```/gi.test(chunks[chunks.length - 1])) {
                chunks[chunks.length - 1] += "```";
                chunks.push("```" + str + "\n");
            } else {
                chunks.push(str + "\n");
            }
        }
    }

    return chunks;
}

var DEV = false;

var log = new Nepify();
helper.init(log);
var bot = new Discord.Client();
var pSystem = new PSystem(log, helper);
var exec = new execPath(cmdFactory, pSystem, bot, helper, log);


process.argv.forEach(function(val, index, array) {
    if (val === "dev") DEV = true;
});

if (DEV) {
    var auth = require('./login/dev_bot.json');
} else {
    var auth = require('./login/bot.json');
}


////

/* Initializaton phase */
cmdFactory.loadModules(function (err, msg) {
    helper.handleCallback(err, msg);
});



bot.loginWithToken(auth.key);

bot.on("ready", function() {
    var readyTime = (new Date() - INITIALIZATION_MS);
    bot.setPlayingGame(config.playing);
    if (config.extendedLog) {
        log.log("Logged in, Took " + readyTime + " ms", "INFO");

    }
});

bot.on("message", function(msg) {
    if (msg.content.split(' ')[0] == config.prefix) {
        if (msg.content.split(' ')[1] == "eval"){
            try {
            bot.sendMessage(msg.channel, eval(msg.content.substring(9)));
            } catch (e) { bot.sendMessage(msg.channel, e) }
        } else {
        var pCommand = exec.stringParser(msg.content);
        exec.tryExec(pCommand.subCommand, pCommand.parameters, msg.author.id, function (err, errMsg){
            if (!err) {
                bot.queueMessage(msg.channel, errMsg);
            } else { 
                helper.handleCallback(err, errMsg); 
                bot.queueMessage(msg.channel, "[Error]: " + errMsg);
            }
        });
        }
    }
});




/*Bot Command Stuff */



