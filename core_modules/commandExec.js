var helper;
var log;
var factory;
var pSystem;
var bot;
var config = require('../config.json');

module.exports = CommandExecutor;

function CommandExecutor(cmdFactory, PSystem, DBot, Helper, Log) {
    factory = cmdFactory;
    pSystem = PSystem;
    bot = DBot;
    helper = Helper;
    log = Log;
}

CommandExecutor.prototype.tryExec = function(command, parameters, userID, message, callback) {
    var command = factory.getSubCommand(command);
    var self = this;
    if (command == -1) {
        callback(true, "Command Not Found.");
    } else if (hardCodedMethodsCauseICantCode(command, bot, message)) {
        //lol useless whitespace >.>
    } else if (pSystem.hasPermission(userID, command.permission, function(err, msg) {
            helper.handleCallback(err, msg)
        })) {
        try {
            var args = self.argParser(command, parameters);
            if (checkParameters(args, command)) {
                log.log("User " + userID + " issued command: " + command.prefix, "LOG");
                command.handler(bot, message, args, function(err, msg) {
                    callback(err, msg);
                });
            } else {
                callback(true, "Parameter error. \nUsage: " + prefix + command.usage);
            }
        } catch (e) {
            log.log("Error occured while executing command. Error: " + e, "ERROR");
            callback(e, "Error executing command.");
        }
    } else {
        callback(true, "No Permission!");
    }
}

function hardCodedMethodsCauseICantCode(command, bot, message) {
    switch(command) {
        case "help":
            bot.queueMessage(message.channel, cmdFactory.getHelpString());
            return true;
        default:
            return false;
    }
}

CommandExecutor.prototype.stringParser = function(string) {
    var aStr = string.match(/\w+|"[^"]+"/g),
        i = aStr.length;
    while (i--) {
        aStr[i] = aStr[i].replace(/"/g, "");
    }

    var result = {};

    result.prefix = aStr[0];
    result.subCommand = aStr[1];
    result.parameters = aStr.slice(2, aStr.length);
    return result;
}

CommandExecutor.prototype.argParser = function(command, parameters) {
    var result = {};
    if (parameters) {
        for (var i = 0; i < Object.keys(command.parameters).length; i++) {
            result[command.parameters[i].id] = parameters[i];
        }
    }
    return result;
}

function checkParameters(issued, command) {
    var result = true;
    Object.keys(command.parameters).forEach(param => {
        param = command.parameters[param];
        if (param.req) {
            if (issued[param.id]) {
                if (typeof(issued[param.id]) !== param.type) {
                    result = false;
                }
            } else {
                result = false;
            }
        }
    });
    return result;
}