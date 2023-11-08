// const mongoose = require("mongoose");

// const database = async () => {
//     await mongoose.connect(process.env.MONGO_URL);
// }

// database().then(() => {
//     console.log("Databases connected successfully");
// })
//     .catch((err) => { console.log(err) });

const mongoose = require("mongoose");
const database = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Database connected successfully ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error Connection ${error.message}`);
  }
};

module.exports = database;
