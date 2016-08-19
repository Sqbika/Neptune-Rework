var fs = require('fs');

var permissions;

module.exports = PermissionSystem;

var log;
var helper;

function PermissionSystem(Log, Helper) {
    log = Log;
    helper = Helper;

    try {
        permissions = require('./permissions.json');
        log.log("Loaded permissions", "INFO");
    } catch (e) {
        log.log("No permissions.json found! Creating one.", "WARN");
        var config = require('../../config.json');
        var def = {
            config: {
                owner: config.owner,
                default: [],
                mods: [],
                admins: [],
            },
            users: {

            }
        }
        fs.writeFile("./core_modules/permission/permissions.json", JSON.stringify(def), function (err) {
            permissions = require('./permissions.json');
        });
    }
}


PermissionSystem.prototype.addPermission = function(user, permission, callback) {
    try {
        if (helper.isNumeric(user)) {
            permissions.users[user].permission.push(permission);
            callback(false, "Added permission");
        } else {
            permissions.users[user.id].permission.push(permission);
            callback(false, "Added permission");
        }
    } catch (e) {
        callback(true, "Permission Override Failed: " + e);
    }
}

PermissionSystem.prototype.removePermission = function(user, permission, callback) {
    if (helper.isNumeric(user)) {
        if (helper.scontains(Object.keys(permissions.users), user)) {
            if (helper.scontains(permissions.users[user], permission)) {
                helper.arrayRemove(permissions.users[user], permission);
                callback(false, "Successfully removed permission.");
            }
            callback(true, "Permission `" + permission + "` not found on user: `" + user + "`");
        }
        callback(true, "No user " + user + " found in permission database.");
    } else {
        if (helper.scontains(Object.keys(permissions.users), user.id)) {
            if (helper.scontains(permissions.users[user.id], permission)) {
                helper.arrayRemove(permissions.users[user.id], permission);
                callback(false, "Successfully removed permission.");
            }
            callback(true, "Permission `" + permission + "` not found on user: `" + user.id + "`");
        }
        callback(true, "No user " + user.id + " found in permission database.");
    }
}

PermissionSystem.prototype.hasPermission = function(user, permission) {
    var uID
    if (helper.isNumeric(user))
        uID = user;
    else
        uID = user.id;

    if (permissions.config.owner == uID)
        return true;

    var permissionList = [];
    if (helper.scontains(Object.keys(permissions.users), uID)) {
        if (helper.scontains(permissions.users[uID], "admins")) {
            permissionList.concat(permissions.config.admins);
        }
        if (helper.scontains(permissions.users[uID], "mods")) {
            permissionList.concat(permissions.config.mods);
        }
        if (helper.scontains(permissions.users[uID], "default")) {
            permissionList.concat(permissions.config.default);
        }
        if (helper.scontains(permissionList, permission)) {
            return true;
        } else {
            return false;
        }
    } else {
        permissions.users[uID] = ["default"];
        permissionList = permissions.config.default;
    }
}