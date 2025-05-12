const ytdl = require("ytdl-core");

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    const info = await ytdl.getInfo(url);
    const formats = info.formats.map((format) => ({
      url: format.url,
      quality: format.qualityLabel || "",
      ext: format.container || "",
      type: format.audioCodec ? "audio" : "video",
    }));
    res.status(200).json({ formats });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch formats", details: error.message });
  }
}
