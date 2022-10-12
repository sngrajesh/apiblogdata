const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(403).json("Invalid Token");
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json("Invalid Authentication");
  }
};

const verifyAccessTokenAndAuthorization = (req, res, next) => {
  verifyAccessToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not authorized");
    }
  });
};

const verifyAccessTokenAndAdmin = (req, res, next) => {
  verifyAccessToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not authorized");
    }
  });
};

module.exports = {
  verifyAccessToken,
  verifyAccessTokenAndAuthorization,
  verifyAccessTokenAndAdmin,
};
