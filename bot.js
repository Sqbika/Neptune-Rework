var INITIALIZATION_MS = new Date();
var discord = require('discordj.js');
var helper = require('./helper.js');

var DEV = false;

process.argv.forEach(function (val, index, array) { 
    if (val === "dev") DEV = true;
});

if (DEV) {
    var auth = require('./login/dev_bot.json');
} else {
    var auth = require('./login/bot.json');
}

var bot = new Discord.Client();
////

/* Initializaton phase */

bot.loginWithToken(auth.key);

bot.on("ready", function () {
    
});