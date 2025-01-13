import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import urlRoutes from './Routes/urlRoutes.js'

dotenv.config();

const app = express();
const PORT= process.env.PORT||8000;
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongodb connection successful"))
.catch((err) => console.log(`Error connecting to Mongodb ${err}`));

app.use(express.json());
app.use(express.static('public'));

app.use('/api', urlRoutes);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
