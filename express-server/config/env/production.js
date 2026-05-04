module.exports = {
    port: process.env.PORT || 80,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET
};
