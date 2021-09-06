const fs = require('fs');
const ytdl = require("ytdl-core");

async function isVideoValid(ytdl, url) {
    try {
        return await ytdl.getInfo(url) && true;
    } catch (err) {
        return false;
    }
}

async function getVideoInfo(ytld, url) {
    return await ytdl.getInfo(url);
}

async function getVideoID(info) {
    return info.videoDetails.videoId;
}

async function getVideoLength(info) {
    return info.videoDetails.lengthSeconds;
}

async function downloadAudio(ytdl, url, filepath) {
    const info = await ytdl.getInfo(url);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const format = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' });
    await ytdl.downloadFromInfo(info, { format: format }).pipe(fs.createWriteStream(filepath));
}

module.exports = {
    isVideoValid,
    getVideoLength,
    downloadAudio,
    getVideoID,
    getVideoInfo
};
