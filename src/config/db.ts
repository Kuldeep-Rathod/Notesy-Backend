import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Notesy';

export const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            dbName: 'Notesy',
        });
        const connection = mongoose.connection;
        console.log(`MongoDB connected to ${connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
