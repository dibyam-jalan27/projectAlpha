const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Problem = require("../Models/problemModel");

// Create new problem => /api/v1/admin/problem/new
exports.newProblem = catchAsyncErrors(async (req, res, next) => {
  const problem = await Problem.create(req.body);
  const id = problem._id;

  res.status(200).json({
    success: true,
    problem,
    id
  });
});

// Get all problems => /api/v1/problems
exports.getProblems = catchAsyncErrors(async (req, res, next) => {
  const problems = await Problem.find();

  res.status(200).json({
    success: true,
    problems,
  });
});

// Get single problem details => /api/v1/problem/:id
exports.getSingleProblem = catchAsyncErrors(async (req, res, next) => {
  const problem = await Problem.findById(req.params.id);

  if (!problem) {
    return next(new ErrorHandler("Problem not found", 404));
  }

  res.status(200).json({
    success: true,
    problem,
  });
});


//Update Count => /api/v1/problem/:id
exports.updateCount = catchAsyncErrors(async (req, res, next) => {
  let problem = await Problem.findById(req.params.id);
  const {success} = req.body;
  if (!problem) {
    return next(new ErrorHandler("Problem not found", 404));
  }
  problem.countTotal = problem.countTotal + 1;
  if(req.body.success){
    problem.countAC = problem.countAC + 1;
  }
  await problem.save();

  res.status(200).json({
    success: true,
    problem,
  });
});
//Update problem => /api/v1/problem/:id
exports.updateProblem = catchAsyncErrors(async (req, res, next) => {
  let problem = await Problem.findById(req.params.id);
  if (!problem) {
    return next(new ErrorHandler("Problem not found", 404));
  }
  problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    problem,
  });
});

//Delete problem => /api/v1/problem/:id
exports.deleteProblem = catchAsyncErrors(async (req, res, next) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) {
    return next(new ErrorHandler("Problem not found", 404));
  }
  await problem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Problem deleted successfully",
  });
});
