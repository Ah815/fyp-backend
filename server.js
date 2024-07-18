const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const vendorRouter = require("./routes/vendor");
const categoryRouter = require("./routes/category");
const foodRouter = require("./routes/food");
const cartRouter = require("./routes/cart");

dotenv.config();

const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Db Connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", authRouter);
app.use("/api/users", userRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/category", categoryRouter);
app.use("/api/food", foodRouter);
app.use("/api/cart", cartRouter);

app.get('/home', (req, res) => {
  res.send('GET request to homepage')
})

app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
