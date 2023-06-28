const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter Problem name"],
    },
    problemStatement: {
        type: String,
        required: [true, "Please enter Problem Statement"],
    },
    countAC: {
        type: Number,
        default: 0,
    },
    countTotal: {
        type: Number,
        default: 0,
    },
    sampleTestcases:[
        {
            input :{
                type: String,
                required: true,
            },
            output:{
                type: String,
                required: true,
            }
        }
    ],
    timeLimit: {
        type: Number,
        default: 1,
        required: [true, "Please enter Time Limit"],
    },
    memoryLimit: {
        type: Number,
        default: 256,
        required: [true, "Please enter Memory Limit"],
    },
    tags:[
        {
            type: String,
            required: true,
        }
    ],
    explanation:{
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Problem", problemSchema);