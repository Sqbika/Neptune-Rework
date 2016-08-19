var fs = require('fs');

const fspath = "./modules/";
const path = "../modules/";

var modules = [];

module.exports = CommandFactory;

function Module(ModuleName, Permission, Subcommands, Author, Version) {
    this.moduleName = ModuleName;
    this.permission = Permission;
    this.subcommands = Subcommands;
    this.author = Author;
    this.version = Version;
}

function Command(Name, Prefix, Permission, Parameters, Handler) {
    this.name = Name;
    this.prefix = Prefix;
    this.permission = Permission,
    this.handler = Handler;
    this.parameters = Parameters;
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
        modules.push(new Module(curModule.name, curModule.permission, loadSubCommands(curModule.commands), curModule.author, curModule.version));
        callback(false, curModule.name + " loaded.");
    } else {
        callback(true, "Error loading module: " + name + ". Not a valid module! Skipping.");
    }
}

CommandFactory.prototype.getSubCommand = function(command) {
    var result = -1;
    modules.forEach(m => {
        m.subcommands.forEach(c => {
            if (c.prefix == command) {
                result = c;
            }
        });
    });
    return result;
}

CommandFactory.prototype.getModule = function(moduleName) {
    modules.forEach(m => {
        if (m.name == moduleName) return true;
    });
    return -1;
}

function loadSubCommands(arrayOfCommands) {
    var subcmd = [];
    Object.keys(arrayOfCommands).forEach(cmd => {
        subcmd.push(new Command(arrayOfCommands[cmd].name, arrayOfCommands[cmd].prefix, arrayOfCommands[cmd].permission, arrayOfCommands[cmd].parameters, arrayOfCommands[cmd].handler));
    });
    return subcmd;
}