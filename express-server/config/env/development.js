module.exports = {
    env: "development",
    port: process.env.PORT || 5000,
    mongoUri: "mongodb://127.0.0.1:27017/student_course_db",
    jwtSecret: process.env.JWT_SECRET || "fallbackSecretKeyForDevOnly",
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
