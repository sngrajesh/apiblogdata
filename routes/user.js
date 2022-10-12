const router = require("express").Router();
const crypto = require("crypto-js");

const User = require("../models/User");

const {
  verifyAccessTokenAndAuthorization,
  verifyAccessTokenAndAdmin,
} = require("./verifyAccessToken");

//Update user
router.put("/:id", verifyAccessTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = crypto.AES.encrypt(
      req.body.password,
      process.env.AUTH_SECRET_KEY
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete user
router.delete("/:id", verifyAccessTokenAndAuthorization, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get user with all details
router.get("/find/:id", verifyAccessTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all user
router.get("/find", verifyAccessTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find()
          .sort({
            createdAt: -1,
          })
          .limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get use stats
router.get("/stats", verifyAccessTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
