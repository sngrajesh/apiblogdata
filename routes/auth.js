const router = require("express").Router();
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

//Signup
router.post("/signup", async (req, res) => {
  try {
    User.find({ email: req.body.email })
      .exec()
      .then(async (user) => {
        if (user.length >= 1) {
          return res.status(409).send({
            message: "Mail already exists",
          });
        } else {
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: crypto.AES.encrypt(
              req.body.password,
              process.env.AUTH_SECRET_KEY
            ).toString(),
          });
          try {
            const u = await newUser.save();
            const { password, ...other } = u._doc;
            res.send(other).status(201);
          } catch (err) {
            err.message = "Something went wrong";
            res.status(404).json( err );
            return;
          }
        }
      });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Signin
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(404).send("Incorrect Credentials");
    }
    const originalPassword = crypto.AES.decrypt(
      user.password,
      process.env.AUTH_SECRET_KEY
    ).toString(crypto.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return res.status(401).send("Incorrect Credentials");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    const { password, ...other } = user._doc;

    res.send({ ...other, accessToken }).status(200);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
