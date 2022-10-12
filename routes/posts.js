const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

const { verifyAccessTokenAndAdmin } = require("./verifyAccessToken");

//Like Post
router.put("/likei/:slug", async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { likes: 1 } },
      { new: true }
    );
    res
      .status(200)
      .json({ likes: post.likes, message: "Post liked succesfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
//Like Post
router.put("/liked/:slug", async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc : { likes: -1 } },
      { new: true }
    );
    res
      .status(200)
      .json({ likes: post.likes, message: "Post unliked succesfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//CREATE POST
router.post("/", verifyAccessTokenAndAdmin, async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", verifyAccessTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.id);
    if ((user.username === post.username) | user.isAdmin) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", verifyAccessTokenAndAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);
    if ((user.username === post.username) | user.isAdmin) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You have no permission to delete your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
    }).exec();
    res.status(200).json({  result :post});
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", paginatedResults(Post), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const catName = req.query.cat;
    const sortPost = req.query.sort;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {
      limit: limit,
    };

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
      };
    }

    try {
      if (catName) {
        results.totalPost = await model.count({
          categories: {
            $in: [catName],
          },
        });

        if (sortPost) {
          if (sortPost === "new") {
            results.results = await model
              .find({
                categories: {
                  $in: [catName],
                },
              })
              .sort({ _id: -1 })
              .limit(limit)
              .skip(startIndex)
              .exec();
          } else if (sortPost === "old") {
            results.results = await model
              .find({
                categories: {
                  $in: [catName],
                },
              })
              .sort({ _id: 1 })
              .limit(limit)
              .skip(startIndex)
              .exec();
          } else {
            results.results = await model
              .find({
                categories: {
                  $in: [catName],
                },
              })
              .limit(limit)
              .skip(startIndex)
              .exec();
          }
        } else {
          results.results = await model
            .find({
              categories: {
                $in: [catName],
              },
            })
            .limit(limit)
            .skip(startIndex)
            .exec();
        }
      } else {
        if (sortPost) {
          if (sortPost === "new") {
            results.totalPost = await model.count();
            results.results = await model
              .find()
              .sort({ _id: -1 })
              .limit(limit)
              .skip(startIndex)
              .exec();
          } else if (sortPost === "old") {
            results.totalPost = await model.count();
            results.results = await model
              .find()
              .sort({ _id: 1 })
              .limit(limit)
              .skip(startIndex)
              .exec();
          }
        } else {
          results.totalPost = await model.count();
          results.results = await model
            .find()
            .limit(limit)
            .skip(startIndex)
            .exec();
        }
      }
      if (endIndex < results.totalPost) {
        results.next = {
          page: page + 1,
        };
      }
      res.paginatedResults = results;
      next();
    } catch (err) {
      res.status(500).json( err );
    }
  };
}

module.exports = router;
