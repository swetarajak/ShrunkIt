import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    unique: true,
  },
  customUrl :{
    type: String,
    unique: true
  },
  qrCode: {
   type:String
  },
  analytics: {
    visits: {
      type: Number,
      default: 0
    },
    referrers:[{ type: String }]
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Url = mongoose.model("Url", urlSchema);

export default Url;
 