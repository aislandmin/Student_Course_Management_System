const bcrypt = require("bcryptjs");
const connectDB = require("./config/mongoose");
const Student = require("./app/models/student");

async function run() {
    try {
        await connectDB();

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = new Student({
            studentNumber: "Admin001",
            password: hashedPassword,
            firstName: "System",
            lastName: "Admin",
            email: "admin@example.com",
            program: "Software Engineering",
            role: "admin"
        });

        await admin.save();
        console.log("Admin created:", admin.studentNumber);
    } catch (err) {
        console.error("Error creating admin:", err);
    } finally {
        process.exit(0);
    }
}

run();
