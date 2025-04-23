import mongoose from 'mongoose';

export const connectDB = async (uri: string) => {
    try {
        await mongoose.connect(uri, {
            dbName: 'Notesy',
        });
        const connection = mongoose.connection;
        console.log(`MongoDB connected to ${connection.host}`);
    } catch (error) {
        console.log(error);
    }
};
