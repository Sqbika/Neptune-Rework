var INITIALIZATION_MS = new Date();
var Discord = require('discord.js');
var config = require('./config.json');
var Nepify = require('./core_modules/nepify.js');
var helper = require('./helper.js');
var execPath = require('./core_modules/commandExec.js');
var PSystem = require('./core_modules/permission/permissionSystem.js');
var async = require('async');
var cmdFactory = new (require('./core_modules/commandFactory.js'));

Discord.Client.prototype.resolveUser = function (usrStuff, bot) {
    if (helper.isNumeric(helper.cleanIt(usrStuff)))
    {
        return bot.members.get('id', helper.cleanIt(usrStuff));
    } else if (usrStuff.id) {
        return usrStuff;
    } else {
        if (bot.members.get('nickname', usrStuff)) {
            return bot.members.get('nickname', usrStuff);
        }
        if (bot.members.get('name', usrStuff)) {
            return bot.members.get('name', usrStuff);
        }
    }

    return undefined;
}



Discord.Client.prototype.queueMessage = function(channel, message, callback) {
    function queueIt(channel, message) {
        sendAsyncMessage({
            channel: channel,
            message: message
        }, callback);
    }
    if (message.length > 1990) {
        message = "It's a bit lengthy message. Let me split it for you!\n" + message;
        var chunks = chunkMessage(message);
        //console.log(chunks.length);
        chunks.forEach(m => {
            queueIt(channel, m);
        });
    } else {
        queueIt(channel, message);
    }
}

var outbound = {};

function sendAsyncMessage(message, callback) {
    var self = this;
    function trySend(task, callback) {
        bot.sendMessage(task.channel.id, task.message, function(err, msg) {
            if (err) {
                if (err == 429) {
                    log.log("Rate Limited. Trying again in 2 seconds.", "LOG");
                    setTimeout(function() {
                        trySend(task, callback)
                    }, 2000);
                } else {
                    log.log("Cannot send message. Error:" + err, "ERROR");
                }
            } else {
                callback(msg);
            }
        });
    }
    
    if(!outbound[message.channel.id]) {
        outbound[message.channel.id] = async.queue(trySend, 1);
    }

    outbound[message.channel.id].push(message, callback);
}




function chunkMessage(message) {
    //Source: Windsdon
    //Github: https://github.com/Windsdon/discord-bot-core/blob/master/lib/discord-bot.js
    var chunkSize = 1800;
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
                chunks.push("```xl\n" + str + "\n");
            } else {
                chunks.push(str + "\n");
            }
        }
    }

    return chunks;
}

Discord.Client.prototype.pSystem = PSystem;
Discord.Client.prototype.cExec = execPath;
Discord.Client.prototype.cfactory = cmdFactory;

var DEV = false;

var log = new Nepify();
helper.init(log);
var bot = new Discord.Client();
var pSystem = new PSystem(log, helper);
var exec = new execPath(cmdFactory, pSystem, bot, helper, log);

bot.pSystem = pSystem;
bot.cExec = exec;



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
        var pCommand = exec.stringParser(msg.content);
        exec.tryExec(pCommand.subCommand, pCommand.parameters, msg.author.id, msg,function (err, errMsg){
            if (err) { 
                helper.handleCallback(err, errMsg); 
                bot.queueMessage(msg.channel, "[Error]: " + errMsg);
            }
        });
    }
});




/*Bot Command Stuff */



