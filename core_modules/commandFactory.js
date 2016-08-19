var fs = require('fs');
var log = require('./nepify.js');
var helper = require('../helper.js');

const fspath = "./modules/";
const path = "../modules/";

var modules = [];

module.exports = CommandFactory;

function Module(moduleName, permission, subcommands, author, version) {
    this.moduleName = moduleName;
    this.permission = permission;
    this.subcommands = subcommands;
    this.author = author;
    this.version = version;
}

function Command(name, prefix, permission, parameters, handler) {
    this.name = name;
    this.prefix = prefix;
    this.permission = permission,
    this.handler = handler;
    this.parameters = parameters;
    this.onCommand = false;
}

function CommandFactory() {}

CommandFactory.prototype.modules = modules;

CommandFactory.prototype.loadModules = function(callback) {
    var self = this;
    var files = fs.readdirSync(fspath);
    files.forEach(function(f) {
        var isDir = fs.statSync(fspath + f);
        if (!isDir.isDirectory())
            self.loadModule(f, path + f, function(err, msg) {
                callback(err, msg)
            });
    });
    callback(false, "Plugins loaded.");
}

CommandFactory.prototype.loadModule = function(name, path, callback) {
    try {
        var mod = require(path);
    } catch (e) {
        callback(true, "Error loading plugin: " + path + " Stacktrace: " + e);
    }
    if (mod.MODULE !== undefined) {
        var curModule = mod.MODULE;
        modules.push(Module(curModule.name, curModule.permission, loadSubCommands(curModule.commands), curModule.author, curModule.version));
        callback(false, curModule.name + " loaded.");
    } else {
        callback(true, "Error loading module: " + name + ". Not a valid module! Skipping.");
    }
}

CommandFactory.prototype.getSubCommand = function(command) {
    modules.forEach(m => {
        m.forEach(c => {
            if (c.prefix == command)
                return c;
        });
    });
    return -1;
}

CommandFactory.prototype.getModule = function(moduleName) {
    modules.forEach(m => {
        if (m.name == moduleName) return true;
    });
    return -1;
}

function loadSubCommands(arrayOfCommands) {
    var subcmd = [];
    arrayOfCommands.forEach(cmd => {
        subcmd.push(Command(subcmd.name, subcmd.prefix, subcmd.permission, subcmd.handler, subcmd.parameters));
    });
    return subcmd;
}