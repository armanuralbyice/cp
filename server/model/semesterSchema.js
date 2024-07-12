const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
    season: {
        type: String,
        enum: ['spring', 'summer', 'fall'],
        required: true,
    },
    year: {
        type: Number,
        default: new Date().getFullYear(),
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

semesterSchema.virtual('semesterName').get(function () {
    return `${this.season} ${this.year}`;
});
semesterSchema.index({ season: 1, year: 1 }, { unique: true });

const Semester = mongoose.model('Semester', semesterSchema);

module.exports = Semester;