
module.exports = {
    "MODULE": {
        name: "Test Module",
        permission: "test",
        author: "Sqbika",
        version: "dev-0.1",
        commands: {
            "test1": {
                name: "Test1 command",
                prefix: "test",
                permission: "test1",
                parameters: [],
                handler: test1
            },

            "test2": {
                name: "Test2 command",
                prefix: "test2",
                permission: "test2",
                parameters: [{
                    id: "name",
                    type: string,
                    req: false
                }],
                handler: test2
            }
        }
    }
}

function test1(callback) {
    callback(false, "Test1 Works.");
}

function test2(callback, args) {
    callback(false, "I've got this as a parameter: " + args.name);
}