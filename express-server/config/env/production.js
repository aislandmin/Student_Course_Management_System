module.exports = {
    env: "production",
    port: process.env.PORT || 80,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    clientOrigin: process.env.CLIENT_ORIGIN // Set this to your Vercel URL in dashboard
};
