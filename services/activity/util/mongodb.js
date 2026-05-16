import mongoose from 'mongoose';

export async function connectMongoDB() {
    const mongoUrl = process.env.ACTIVITY_MONGODB_URL || 'mongodb://mongo-activity:27017/pollex-activity';

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    await mongoose.connect(mongoUrl);
    return mongoose.connection;
}
