var chalk = require('chalk');
var io = require('fs');

module.exports = Nepify;

var crash;
var error;
var commands;

function Nepify() {
    crash = io.createWriteStream('./logs/crash.log');
    error = io.createWriteStream('./logs/error.log');
    commands = io.createWriteStream('./logs/commands.log');
}

Nepify.prototype.levels = [
    "CHAT",
    "COMMAND",
    "INFO",
    "WARN",
    "ERROR",
    "CRASH"
]

Nepify.prototype.log  = function (message, level) {
     switch(level)
     {
          case "CHAT":
                console.log("[" + chalk.cyan(message.server.name) + "][" + chalk.yellow(message.channel.name) + " - [" + chalk.green(message.author.username) + "] - " + chalk.white(message.content));
                break;
          case "LOG":
                console.log(`[${chalk.blue("Log")}] - ${message}`);
                break;
          case "COMMAND":
                commands.write(`[Command] ${message}`);
                break;
          case "INFO":
                console.log(`[${chalk.yellow("Info")}] - ${message}`);
                break;
          case "WARN":
                console.log(`[${chalk.red("WARN")}] - ${message}`);
                break;
          case "ERROR":
                console.log(`[${chalk.red("ERROR")}] - ${message}`);
                error.write(`[ERROR] ${message}`);
                break;
          case "CRASH":
                console.log(`${chalk.red("Crash Happened!")}\n ${message}`);
                crash.write(`Crash happened at: ${new Date()} \n Stacktrace:\n${message}`);
                break;
          default:
            log("No such log level: " + level, "ERROR");
            break;
     }
}

