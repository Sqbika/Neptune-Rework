var fs = require('fs');
var log = require('../nepify.js');
var helper = require('../../helper.js');

var permissions;

function PermissionSystem() {
    try {
        permissions = require('permissions.json');
    } catch(e) {
        log.log("No permissions.json found! Creating one.", "WARN");
        fs.writeFile("permissions.json");
        permissions = require('permissions.json');
        var config = require('../../config.json');
        permissions.users = {
            owner: config.author,
            default: []
        };
    }
};

PermissionSystem.prototype.addPermission = function (user, permission, callback) {
    try {
    if (helper.isNumeric(user))
    {
        permissions.users[user].permission.push(permission);
        callback(false, "Added permission");
    }
    else
    {
        permissions.users[user.id].permission.push(permission);
        callback(false, "Added permission");
    }
    } catch (e) {
        callback(true, "Permission Override Failed: " + e);
    }
}

PermissionSystem.prototype.removePermission = function (user, permission, callback) {
    if (helper.isNumeric(user)) {
        if (helper.scontains(permissions.users, user)) {
            if (helper.scontains(permissions.users[user], permission)) {
                helper.arrayRemove(permissions.users[user], permission);
                callback(false, "Successfully removed permission.");
            }
            callback(true, "Permission `"+ permission + "` not found on user: `" + user + "`");
        }
        callback(true, "No user " + user + " found in permission database.");
    } else {
        if (helper.scontains(permissions.users, user.id)) {
            if (helper.scontains(permissions.users[user.id], permission)) {
                helper.arrayRemove(permissions.users[user.id], permission);
                callback(false, "Successfully removed permission.");
            }
            callback(true, "Permission `"+ permission + "` not found on user: `" + user.id + "`");
        }
        callback(true, "No user " + user.id + " found in permission database.");
    }
}

PermissionSystem.prototype.hasPermission = function (user, permission, callback) {
    if (helper.isNumeric(user)) {
        if (helper.scontains(permissions.users, user)) {
            if (helper.scontains(permissions.users[user], permission)) {
                callback(false, true);
            }
            callback(false, false);
        }
        callback(true, "No user " + user + " found in permission database.");
    } else {
        if (helper.scontains(permissions.users, user.id)) {
            if (helper.scontains(permissions.users[user.id], permission)) {
                callback(false, true);
            }
            callback(false, false);
        }
        callback(true, "No user " + user.id + " found in permission database.");
    }
}