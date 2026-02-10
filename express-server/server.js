const config = require("./config/config");
const connectDB = require("./config/mongoose");
const app = require("./config/express");

connectDB();

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
