const jwt = require("jsonwebtoken");
const config = require("../../config/config");

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret); // ⬅️ use config.jwtSecret
        req.user = decoded; // { id, role }
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
