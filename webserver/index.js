const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("<h1>Youtube mp3 downloader</h1>");
});

app.get('/:videoId', (req, res) => {
    res.sendFile(`${req.params.videoId}`, {
        root: path.join(__dirname, '../static')
    });
});

app.listen(port, () => {
    console.log(`Web server listening at http://localhost/:${port}`);
});
