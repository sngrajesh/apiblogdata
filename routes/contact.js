const router = require("express").Router();
const Contact = require("../models/Contact");

const { verifyAccessTokenAndAdmin } = require("./verifyAccessToken");

router.post("/", async (req, res) => {
  const newCat = new Contact(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete Contact
router.delete("/:id", verifyAccessTokenAndAdmin, async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedContact);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:email", verifyAccessTokenAndAdmin, async (req, res) => {
  try {
    const cont = await Contact.find(
        { email: req.params.email },
    );

    res.status(200).json(cont);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", verifyAccessTokenAndAdmin, async (req, res) => {
  try {
    const cont = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(cont);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
