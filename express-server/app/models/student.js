const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const StudentSchema = new Schema(
    {
        studentNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            trim: true,
            default: ""
        },

        city: {
            type: String,
            trim: true,
            default: ""
        },

        phoneNumber: {
            type: String,
            trim: true,
            default: ""
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: ""
        },

        program: {
            type: String,
            trim: true,
            default: ""
        },

        // custom fields
        favoriteTopic: {
            type: String,
            trim: true,
            default: ""
        },

        strongestSkill: {
            type: String,
            trim: true,
            default: ""
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", StudentSchema);


