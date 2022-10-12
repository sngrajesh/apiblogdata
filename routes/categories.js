const router = require("express").Router();
const Category = require("../models/Category");

const { verifyAccessTokenAndAdmin } = require("./verifyAccessToken");

router.post("/", verifyAccessTokenAndAdmin, async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete category
router.delete("/:id", verifyAccessTokenAndAdmin, async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
