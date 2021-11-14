const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"

const connectDB =  () => { 
    try {
        mongoose.connect(mongoURI, () => {
            console.log('MongoDB Connected...');
        });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;