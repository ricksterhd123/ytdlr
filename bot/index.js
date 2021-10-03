const { Client, Intents } = require('discord.js');
const { token, hostname } = require('./config.json');
const WebSocket = require('ws');
const ws = new WebSocket('ws://downloader:8080');
const commandRegex = /^\$download (.*)$/;
let queue = [];

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log("Discord bot connected!");
    client.user.setUsername('[SW]YTMP3');
});

client.on('messageCreate', async (message) => {
    if (message.author.id != client.user.id) {
        const matches = message.content.match(commandRegex)
        if (matches) {
            const msgId = message.id;
            const url = matches[1];

            // console.log(message);
            // add message to queue
            queue.push(message);

            // send request to wss
            ws.send(JSON.stringify({ msgId: msgId, url: url }));
        }
    }
});

ws.on('open', async () => {
    console.log("Connected to the websocket");
});

ws.on('message', async (message) => {
    message = JSON.parse(message);

    const msgId = message.msgId;
    const index = queue.findIndex(m => m.id == msgId);

    if (index == -1)
        return console.error("Could not find index of message on queue");
    
    const discordMessage = queue[index];

    if (!discordMessage)
        return console.error("Discord message undefined");

    const status = message.status;

    if (status != 200) {
        discordMessage.reply(message.error);
    } else {
        await discordMessage.reply(`https://${hostname}/${message.videoId}.mp3`);
    }
    queue.splice(index, 1);
});

client.login(token);
