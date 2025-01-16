import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
const SECRET = process.env.JWT_SECRET;

// User registration
export const register = async ( req, res ) => {
    try{
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: 'User already exists' })
        }
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// User Login
export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: '1d' });
        res.status(200).json({ token });

    
        
    }catch (err) {
        res.status(400).json({ message: err.message });
    }
}