import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortenUrl: {
    type: String,
    // required: true,
    unique: true,
  },
  qrCode: {
    type: Buffer,
    // required: true,
    unique: true
  },
});

const Url = mongoose.model("Url", urlSchema);

export default Url;
 