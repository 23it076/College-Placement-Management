const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dropCollection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        await mongoose.connection.db.dropCollection('companies');
        console.log('Dropped companies collection');
        process.exit();
    } catch (error) {
        console.error('Error dropping collection:', error);
        process.exit(1);
    }
};

dropCollection();
