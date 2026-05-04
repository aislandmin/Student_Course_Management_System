require("dotenv").config();
const config = require("./config/config");
const app = require("./config/express");
const connectDB = require("./config/mongoose");

connectDB();

if (process.env.NODE_ENV !== "production") {
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
}

module.exports = app;
