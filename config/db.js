const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.set('strictQuery', true); // ใข้ตาม schema
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(process.env.MONGO_URI);
  console.log(`MongoDB connect: ${conn.connection.host}`);
}

module.exports = connectDB;