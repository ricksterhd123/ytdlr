// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', async () => {
    console.log("Connected to websocket");
});

ws.on('message', (message) => {
    console.log(message.toString('utf-8'));
});

const commandRegex = /^\!download (.*)$/;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log(client.user);
});

client.on('messageCreate', async (message) => {
    if (message.author.id != client.user.id) {
        const matches = message.content.match(commandRegex)
        if (matches) {
            message.channel.send("We got: " + matches[1]);
        }
    }
});

// Login to Discord with your client's token
client.login(token);
