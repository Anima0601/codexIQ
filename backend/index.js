
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/review'); 

const app = express();
const PORT = process.env.PORT || 5000;


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); 
    }
};

connectDB();

app.use(express.json()); 
app.use(cors());       


app.use('/api/auth', authRoutes); 
app.use('/api/user', userRoutes); 
app.use('/api', reviewRoutes);   

app.get('/', (req, res) => {
    res.send('DevMate Backend API is running!');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});