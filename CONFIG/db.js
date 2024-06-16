require('dotenv').config();
const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      w: 'majority'  // Specify write concern if necessary
    });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.log("DB connection failed!", error.message);
  }
};

dbConnect();