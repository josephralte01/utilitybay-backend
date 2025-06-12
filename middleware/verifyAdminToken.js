// middleware/verifyAdminToken.js

module.exports = function verifyAdminToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token || token !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  next();
};
