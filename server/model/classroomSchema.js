const mongoose = require('mongoose')

const classRoomSchema = new mongoose.Schema({
    building: {
        type: String,
    },
    classroomNo: {
        type: String,
    },

})
module.exports = mongoose.model('Classroom', classRoomSchema);