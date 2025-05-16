const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require("helmet");
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const connectDb = require("./utils/connectDb")
const { strgPath } = require("./utils/multerConf")


dotenv.config();
const app = express();


connectDb();


app.use(helmet());
app.use(cors())
app.use(express.json());




app.use("/v1/auth", authRoutes)
app.use("/v1/users", userRoutes)
app.use('/v1/imgs', express.static(strgPath))




app.use((err, req, res, next) => {
  console.error(err);
  

  const statusCode = err.statusCode || 500;
  let message = ""; 
  
  if (err.name === "InformErr") {
    message = err.message;
  }


  res.status(statusCode).json({
    success: false,
    errors: message
  });
})


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`))