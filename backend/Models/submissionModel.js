const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  solved: [
    {
      name: {
        type: String,
        required: [true, "Please enter the problem name"],
      },
      code: {
        type: String,
        default: "",
      },
      date: {
        type: Date,
        default: Date.now,
      },
      verdict:{
        type: String,
        required: [true, "Please enter the verdict"],
      },
      result: {
        time: {
          type: String,
          required: [true, "Please enter the time"],
        },
        memory: {
          type: String,
          required: [true, "Please enter the memory"],
        },
        verdict: {
          type: String,
          required: [true, "Please enter the verdict"],
        },
      },
      language: {
        type: String,
        required: [true, "Please enter the language"],
      },
    },
  ],
});

module.exports = mongoose.model("Submission", submissionSchema);