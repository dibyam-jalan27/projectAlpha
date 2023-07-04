const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Submission = require("../Models/submissionModel");

//Get all submissions of a user
exports.getSubmissions = catchAsyncErrors(async (req, res, next) => {
  let submissions = await Submission.findOne({ userId: req.params.id});

  if(!submissions){
    submissions = Submission.create({ userId: req.params.id});
  }

  res.status(200).json({
    success: true,
    submissions,
  });
});

//Add new submission
exports.addSubmission = catchAsyncErrors(async (req, res, next) => {

  const {name, code, result, language} = req.body;
  let submission = await Submission.findOne({ userId: req.params.id});

  let problem = {
    name,
    code,
    result,
    language,
    verdict:result.verdict
  }

  if (!submission) {
    const solved = [];
    solved.push(problem);
    submission = Submission.create({ userId: req.params.id, solved });
    return res.status(200).json({
      success: true,
      submission,
    });
  }

  if(!submission.solved){
    submission.solved = [];
  }
  submission.solved.push(problem);
  await submission.save();

  res.status(200).json({
    success: true,
    submission,
  });
});
