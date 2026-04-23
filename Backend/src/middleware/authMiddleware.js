import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // must contain id & role
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;

// ------------------ ROLE MIDDLEWARES ------------------

export const requireHeadAdmin = (req, res, next) => {
  if (req.user.role !== "headadmin") {
    return res.status(403).json({ message: "Access denied: Head Admin only" });
  }
  next();
};

export const requireAdminOrHead = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "headadmin") {
    return next();
  }
  return res.status(403).json({ message: "Admins only" });
};
