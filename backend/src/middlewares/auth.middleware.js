import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token. Please log in." });}
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};