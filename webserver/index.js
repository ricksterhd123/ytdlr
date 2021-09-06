const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.get('/:videoId', (req, res) => {
    console.log(req.params);
    res.sendFile(`${req.params.videoId}`, {
        root: path.join(__dirname, '../static')
    });
});

app.listen(port, () => {
    console.log(`Web server listening at http://localhost/:${port}`)
});
