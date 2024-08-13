import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({
        message: "User not authenticated",
        success: false,
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err || !decode) {
        return res.status(400).json({
          message: "Invalid token",
          success: false,
        });
      }

      req.id = decode.userId;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export default isAuthenticated;
