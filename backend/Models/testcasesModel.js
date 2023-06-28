const mongoose = require("mongoose")

const testcaseSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: [true, "Please enter Problem ID"],
    },
    testCase:[
        {
            input: {
                type: String,
                required: [true, "Please enter input"],
            },
            output: {
                type: String,
                required: [true, "Please enter output"],
            },
        }
    ]
});

module.exports = mongoose.model("TestCases",testcaseSchema);