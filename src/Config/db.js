const mongoose = require("mongoose");

const connectDB = async () => {
  try {await mongoose.connect(process.env.MONGO_URI,{
    dbName:"ecommerce"
  })
    

    console.log("mongo connect");
  } catch (error) {
    console.error("dtata conncetion faild", error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
