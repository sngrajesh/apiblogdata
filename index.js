const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/posts");
const contact = require("./routes/contact");
const categoryRouter = require("./routes/categories");

//Db connection
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Error:", err.message);
  });

//Routes
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/contact", contact);
app.use("/api/v1/category", categoryRouter);

app.get("/", (req, res) => {
  res.send("Thanks for visiting");
  console.log("Test is successful");
});

const port = process.env.PORT || 8500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
