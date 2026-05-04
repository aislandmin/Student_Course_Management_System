const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
        trim: true
    },
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    section: {
        type: String,
        trim: true,
        default: ""
    },
    semester: {
        type: String,
        trim: true,
        default: ""
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: "Student"
    }]
});

// A course offering is uniquely identified by courseCode + semester + section
CourseSchema.index({ courseCode: 1, semester: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Course', CourseSchema);
