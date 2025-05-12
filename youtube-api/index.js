const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("YouTube Format Fetch API is live!");
});

app.get("/fetch-formats", async (req, res) => {
    const url = req.query.url;

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    try {
        const info = await ytdl.getInfo(url);
        const formats = info.formats.map(format => ({
            url: format.url,
            quality: format.qualityLabel || "",
            ext: format.container || "",
            type: format.audioCodec ? "audio" : "video"
        }));
        res.json({ formats });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch formats", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
