module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student_course_db",
    jwtSecret: process.env.JWT_SECRET || "fallbackSecretKeyForDevOnly"
};
