const mongoose = require('mongoose');

const jobappliedSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    jobId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
        required: true,
        
    },
    },{
    versionKey : false,
    }
);

const Applied = mongoose.model('applied', jobappliedSchema);

module.exports = Applied;