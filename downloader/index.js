const ytdl = require('ytdl-core');
const config = require('./config.json');
const fs = require('fs');
const { WebSocketServer } = require('ws');
const { isVideoValid, getVideoLength, getVideoID, getVideoInfo, downloadAudio } = require('./lib/ytdl-utils');
const wss = new WebSocketServer({ port:8080 });

async function downloadYoutubeAudio (url) {
    const valid = await isVideoValid(ytdl, url);
    if (!valid)
        return {status: 404, message: "invalid video url"};

    const info = await getVideoInfo(ytdl, url);
    if (!info) 
        return {status: 500, message: "Could not find video info"};

    const length = await getVideoLength(info);
    const maxLengthMinutes = config.max_video_length_seconds / 60;

    if (length > config.max_video_length_seconds) 
        return {status: 400, message: `Video exceeds global maximum ${maxLengthMinutes}`};

    const videoId = await getVideoID(info);
    const filepath = `../static/${videoId}.mp3`;

    const pathExists = await (new Promise((resolve, reject) => {
        try {
            fs.access(filepath, fs.constants.R_OK, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true)
                }
            });
        } catch (err) {
            reject(err);
        }
    }));

    if (!pathExists) {
        await downloadAudio(ytdl, url, filepath);
    }

    return {status: 200, videoId: videoId, filepath: filepath};
}

wss.on('connection', (ws) => {
    ws.on('message', async (url) => {
        const response = await downloadYoutubeAudio(url);
        ws.send(JSON.stringify(response));
    });
});
