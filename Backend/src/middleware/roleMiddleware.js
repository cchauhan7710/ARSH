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
