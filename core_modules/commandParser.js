var config = require('../config.json');

module.exports = Parse;

function Parse(string) {
    var aStr = string.match(/\w+|"[^"]+"/g), i = aStr.length;
    while(i--){
        aStr[i] = aStr[i].replace(/"/g,"");
    }

    this.prefix = aStr[0];
    this.subCommand = aStr[1];
    this.parameters = aStr.slice(1,aStr.length-1);
}