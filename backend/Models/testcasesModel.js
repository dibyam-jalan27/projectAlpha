const mongoose = require("mongoose")

const testcaseSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: [true, "Please enter Problem ID"],
    },
    testCase1: {
        type: String,
        required: [true, "Please enter Test Case 1"],
    },
    testCase2: {
        type: String,
        required: [true, "Please enter Test Case 2"],
    },
    testCase3: {
        type: String,
        required: [true, "Please enter Test Case 3"],
    },
    resultCase1:{
        type: String,
        required: [true,"Please enter output of Test Case 1"]
    },
    resultCase2:{
        type: String,
        required: [true,"Please enter output of Test Case 2"]    
    },
    resultCase3:{
        type: String,
        required: [true,"Please enter output of Test Case 3"]
    }
});

module.exports = mongoose.model("TestCases",testcaseSchema);