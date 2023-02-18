import mongoose from 'mongoose';

const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection successful');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDb;
