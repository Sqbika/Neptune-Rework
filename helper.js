var log = require('./core_modules/nepify.js');

module.exports = {
    parseUgly: parseUgly,
    whiteSpace: whiteSpace,
    arrayRemove: remove,
    isNumeric: isNumeric,
    escapeRegExp: escapeRegExp,
    cleanIt: cleanIt,
    forHumans: forHumans,
    parseData: parseData,
    scontains: scontains,
    handleCallback: HandleCallback
}


function HandleCallback(err, msg) {
    if (err)
        log.log(msg, "ERROR");
    else
        log.log(msg, "INFO");
}

var data = ['B', 'KB', 'MB', 'GB', 'TB'];

function parseData(byte) {
    var more = true;
    var value = byte;
    var level = 0;
    while (more) {
        value = value / 1024;
        level += 1;
        if (value < 1024)
            more = false;
    }
    return value.toFixed(2) + " " + data[level];
}

function forHumans(seconds) {
    if (seconds == undefined)
        return "0 seconds";
    var levels = [
        [Math.floor(seconds / 31536000), 'years'],
        [Math.floor((seconds % 31536000) / 604800), 'weeks'],
        [Math.floor(((seconds % 31536000) % 604800) / 86400), 'days'],
        [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'], //thx Zephy
        [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
        [((((seconds % 31536000) % 86400) % 3600) % 60), 'seconds'],
    ];
    var returntext = '';

    for (var i = 0, max = levels.length; i < max; i++) {
        if (levels[i][0] === 0) continue;
        if (levels[i][0] === 0.00) continue;
        returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1]);
    };
    return returntext.trim();
}

function scontains(array, it) {
    return array.indexOf(it) != -1
}

function cleanIt(input) {
    return input.replace(/<@[&!]*(\d+)>/, "$1");
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function remove(arr, thing) {
    if (scontains(arr, thing)) {
        return arr.slice(0, arr.indexOf(thing)).concat(arr.slice(arr.indexOf(thing) + 1, arr.length));
    } else {
        return arr;
    }
}

function whiteSpace(strs) {
    var maxSize = 0;
    var strs = strs;
    strs.forEach((v) => {
        if (v.length > maxSize) {
            maxSize = v.length;
        }
    });

    for (var i = 0; i < strs.length; i++) {
        strs[i] = strs[i] + (new Array(maxSize - strs[i].length + 1)).join(" ");
        if (strs[i].length == 0)
            strs[i] = (new Array(maxSize)).join(" ");
    }
    return strs;
}

var parseUgly = function(timeout) {
    timeout = timeout.replace(/\s+/g, '');
    var SECONDS = /(\d+) *(?:seconds|seconds|sec|s)/i;
    var MINUTES = /(\d+) *(?:minutes|minute|min|m)/i;
    var HOURS = /(\d+) *(?:hours|hour|h)/i;
    var DAYS = /(\d+) *(?:days|days|d)/i;
    var WEEKS = /(\d+) *(?:weeks|week|w)/i;


    var delta = 0;

    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    var days = 0;
    var years = 0;
    var weeks = 0;

    var s = SECONDS.exec(timeout);
    if (s && s[1]) {
        delta += +s[1];
        seconds += +s[1];
    }

    var s = MINUTES.exec(timeout);
    if (s && s[1]) {
        delta += (+s[1] * 60);
        minutes += +s[1];
    }

    var s = HOURS.exec(timeout);
    if (s && s[1]) {
        delta += (+s[1] * 60 * 60);
        hours += +s[1]
    }

    var s = DAYS.exec(timeout);
    if (s && s[1]) {
        delta += (+s[1] * 60 * 60 * 24);
        days += +s[1]
    }

    var s = WEEKS.exec(timeout);
    if (s && s[1]) {
        delta += (+s[1] * 60 * 60 * 24 * 7);
        days += +s[1]
    }

    if (isNaN((hours + minutes + seconds)) || delta < 1) return false;
    return {
        absolute: new Date().getTime() + (delta * 1000),
        relative: (delta * 1000),
        seconds: seconds,
        minutes: minutes,
        hours: hours,
        days: days,
        weeks: weeks,
        years: years,
        delta: delta
    };
};