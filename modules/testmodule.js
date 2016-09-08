
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
                handler: test1,
                usage: "test1",
                help: "Test command 1"
            },

            "test2": {
                name: "Test2 command",
                prefix: "test2",
                permission: "test2",
                parameters: [{
                    id: "name",
                    type: "string",
                    req: true
                }],
                handler: test2,
                usage: "test2 <string>",
                help: "Prints out string with some text"
            }
        }
    }
}

function test1(bot, msg) {
    bot.queueMessage(msg.channel, "Test1 Module Works.");
}

function test2(bot, msg, args) {
    bot.queueMessage(msg.channel, "Test2 Module returned parameter: " + args[0]);
}