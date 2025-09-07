// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  // ✅ Read token from cookie instead of Authorization header
  const token = req.cookies?.accessToken;

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "cyberveer-website",
      audience: "cyberveer-users",
    });
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

