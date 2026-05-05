// const dns = require("dns");
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/mongoose");
const Student = require("./app/models/student");
const Course = require("./app/models/course");

async function seed() {
    try {
        await connectDB();

        console.log("Cleaning database...");
        await Student.deleteMany({});
        await Course.deleteMany({});

        console.log("Seeding data...");

        // 1. Create System Administrator (Special Student Number)
        const adminPassword = await bcrypt.hash("password123", 10);
        const admin = new Student({
            studentNumber: "admin001", // Special ID for Admin
            password: adminPassword,
            firstName: "System",
            lastName: "Administrator",
            email: "admin@centennial.ca",
            program: "Administration",
            role: "admin",
            favoriteTopic: "Data Integrity",
            strongestSkill: "System Security"
        });
        await admin.save();
        console.log("- Admin Created: System Administrator (ADMIN001)");

        // 2. Create Students
        const studentPassword = await bcrypt.hash("password123", 10);
        const studentsData = [
            // Original Students
            {
                studentNumber: "301234567",
                password: studentPassword,
                firstName: "Alice",
                lastName: "Smith",
                email: "alice@centennial.ca",
                program: "Software Engineering",
                favoriteTopic: "React Hooks",
                strongestSkill: "Frontend Development",
                role: "student"
            },
            {
                studentNumber: "301112233",
                password: studentPassword,
                firstName: "Bob",
                lastName: "Johnson",
                email: "bob@centennial.ca",
                program: "Software Engineering Technology",
                favoriteTopic: "Node.js Streams",
                strongestSkill: "Backend Logic",
                role: "student"
            },
            {
                studentNumber: "301000001",
                password: studentPassword,
                firstName: "Charlie",
                lastName: "Brown",
                email: "charlie@centennial.ca",
                program: "Cybersecurity",
                favoriteTopic: "Network Security",
                strongestSkill: "Python Scripting",
                role: "student"
            },
            {
                studentNumber: "301000002",
                password: studentPassword,
                firstName: "Diana",
                lastName: "Prince",
                email: "diana@centennial.ca",
                program: "Computer Systems",
                favoriteTopic: "OS Kernels",
                strongestSkill: "Low-level C",
                role: "student"
            },
            {
                studentNumber: "301000003",
                password: studentPassword,
                firstName: "Ethan",
                lastName: "Hunt",
                email: "ethan@centennial.ca",
                program: "Data Science",
                favoriteTopic: "Machine Learning",
                strongestSkill: "Statistics",
                role: "student"
            },
            {
                studentNumber: "301000004",
                password: studentPassword,
                firstName: "Fiona",
                lastName: "Gallagher",
                email: "fiona@centennial.ca",
                program: "Web Development",
                favoriteTopic: "CSS Grid",
                strongestSkill: "UI Design",
                role: "student"
            },
            {
                studentNumber: "301000005",
                password: studentPassword,
                firstName: "George",
                lastName: "Costanza",
                email: "george@centennial.ca",
                program: "Business Information Systems",
                favoriteTopic: "Agile Methodologies",
                strongestSkill: "Risk Management",
                role: "student"
            }
        ];

        const createdStudents = await Student.insertMany(studentsData);
        console.log(`- ${createdStudents.length} Students created`);

        // 3. Create Courses
        const coursesData = [
            // Original Courses
            {
                courseCode: "COMP308",
                courseName: "Emerging Technologies",
                section: "001",
                semester: "Winter 2026",
                students: [createdStudents[0]._id, createdStudents[1]._id, admin._id]
            },
            {
                courseCode: "COMP229",
                courseName: "Web Application Development",
                section: "004",
                semester: "Fall 2025",
                students: [createdStudents[5]._id, createdStudents[0]._id]
            },
            // Additional Courses
            {
                courseCode: "COMP123",
                courseName: "Programming I",
                section: "001",
                semester: "Winter 2026",
                students: [createdStudents[2]._id, createdStudents[3]._id]
            },
            {
                courseCode: "COMP212",
                courseName: "Programming II",
                section: "002",
                semester: "Fall 2025",
                students: [createdStudents[4]._id, admin._id]
            },
            {
                courseCode: "COMP311",
                courseName: "Data Warehouse",
                section: "003",
                semester: "Winter 2026",
                students: [createdStudents[4]._id, createdStudents[6]._id]
            },
            {
                courseCode: "COMP214",
                courseName: "Advanced Database",
                section: "001",
                semester: "Fall 2025",
                students: []
            },
            {
                courseCode: "COMP214",
                courseName: "Advanced Database",
                section: "002",
                semester: "Fall 2025",
                students: []
            }
        ];

        await Course.insertMany(coursesData);
        console.log(`- ${coursesData.length} Courses created`);

        console.log("\nDatabase seeded successfully! ");
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        process.exit(0);
    }
}

seed();
