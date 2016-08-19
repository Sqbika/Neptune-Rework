var helper = require('../helper.js');
var log = require('./nepify.js');
var factory;
var pSystem;
var bot;

module.exports = CommandExecutor;

function CommandExecutor(cmdFactory, PSystem, DBot) {
    factory = cmdFactory;
    pSystem = PSystem;
    bot = DBot;
}

CommandExecutor.prototype.tryExec = function (command, parameters, userID, callback) {
    var command = factory.getSubCommand(command);
    
    if (command == -1)
        callback(true, "Command Not Found.");
    if (pSystem.hasPermission(userID, command.permission, function (err, msg) { helper.handleCallback(err, msg) })) {
        try {
            log.log("User " + userID + " issued command: " + command, "LOG");
            command.handler(function (err, msg) {
                callback(err, msg);
            }, argParser(command, parameters));
        } catch (e) {
            log.log("Error occured while executing command. Error: " + e, "ERROR");
            callback(e, "Error executing command.");
        }
    }
}

CommandExecutor.prototype.stringParser = function (string) {
    var aStr = string.match(/\w+|"[^"]+"/g), i = aStr.length;
    while(i--){
        aStr[i] = aStr[i].replace(/"/g,"");
    }

    this.prefix = aStr[0];
    this.subCommand = aStr[1];
    this.parameters = aStr.slice(2,aStr.length-1);
}

CommandExecutor.prototype.argParser = function (command, parameters) {
    var result = {};
    for (var i = 0; i < Object.keys(command.parameters).length; i++) {
        result[command.parameters[i].id] = parameters[i];
    }
    return result;
}