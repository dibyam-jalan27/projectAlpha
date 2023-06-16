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
    inputFormat: {
        type: String,
        required: [true, "Please enter Input Format"],
    },
    outputFormat: {
        type: String,
        required: [true, "Please enter Output Format"],
    },
    constraints: {
        type: String,
        required: [true, "Please enter Constraints"],
    },
    sampleInput: {
        type: String,
        required: [true, "Please enter Sample Input"],
    },
    sampleOutput: {
        type: String,
        required: [true, "Please enter Sample Output"],
    },
    explanation: {
        type: String,
        required: [true, "Please enter Explanation"],
    },
    difficulty: {
        type: String,
        required: [true, "Please enter Difficulty"],
    },
    timeLimit: {
        type: Number,
        required: [true, "Please enter Time Limit"],
    },
    memoryLimit: {
        type: Number,
        required: [true, "Please enter Memory Limit"],
    },
    tags: {
        type: [String],
        required: [true, "Please enter Tags"],
    },

});

module.exports = mongoose.model("Problem", problemSchema);