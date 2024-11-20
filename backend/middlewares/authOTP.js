const jwt = require("jsonwebtoken");

// Middleware to extract the user from the JWT token
const protect = (req, res, next) => {
  let token;

  // Check if the token is present in the headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract token from header

      // Verify token and extract user data
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user (including email) to the request object
      req.user = decoded;

      next();
    } catch (error) {
      console.error("Not authorized, token failed");
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = protect;
