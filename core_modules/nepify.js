var chalk = require('chalk');
var helper = require('../helper.js');
var io = require('fs');



module.exports = {
    
}

function Nepify() {
    var crash = io.openFileStream('../logs/crash.log');
    var error = io.openFileStream('../logs/error.log');
    var commands = io.openFileStream('../logs/commands.log');
}

Nepify.prototype.levels = [
    "CHAT",
    "COMMAND",
    "WARN",
    "ERROR",
    "CRASH"
]

Nepify.prototype.log = function (message, level) {
     switch(level)
     {
          case "CHAT":
                

          default:
            this.log("No such log level: " + level, "ERROR");
            break;
     }

}

