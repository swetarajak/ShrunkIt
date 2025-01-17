import Url from "../models/urlModels.js";
import QRCode from "qrcode";

export const shortenUrl = async (req, res) => {
  const { originalUrl, customUrl } = req.body;
  if (!originalUrl) {
    return res.status(400).send("Original Url is required");
  }

  const shortUrl = customUrl ? customUrl : shortid.generate();

  const existingUrl = await URL.findOne({ shortUrl });

  if (existingUrl) {
    return res.status(400).send("Custom URL is already taken");
  }

  const urlData = new Url({
    originalUrl,
    shortUrl,
    createdBy: req.user ? req.user.id : null,
  });
  try {
    await urlData.save();
    res.status(201).json({ message: "URL shortened successfully", shortUrl });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
