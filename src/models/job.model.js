const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyName : {
        type : String,
        required : true
    },
    position : {
        type : String,
        required : true,
    },
    contract : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },

},{
    versionKey : false,

}
);

const Job = mongoose.model('job', jobSchema);

module.exports = Job;