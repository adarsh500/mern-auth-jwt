const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const client = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('mongoDB connected', client.connection.host);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
