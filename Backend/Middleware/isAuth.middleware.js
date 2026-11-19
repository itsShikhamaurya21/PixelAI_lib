
import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;

    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token. Please login again.",
      });
    }

    return res.status(500).json({
      message: "Authentication error",
    });
  }
};

export default isAuth;
