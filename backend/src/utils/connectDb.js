const mongoose = require("mongoose")


const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => console.log("Connected to DB"))
    .catch((err) => {
      console.error(err);
    });
}


module.exports = connectDb