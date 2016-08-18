var parser = require('./commandParser.js');

module.exports = Message;

function Message(messageInput) {
    this.server = messageInput.server;
    this.channel = messageInput.channel;
    this.user = messageInput.author;
    this.targetChannel = messageInput.channel;
    this.command = parser.Parse(messageInput.content);
}
