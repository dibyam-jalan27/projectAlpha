const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const TestCases = require("../Models/testcasesModel")
const Problem = require("../Models/problemModel")

//create new Testcase => /api/v1/admin/testcase/new
exports.newTestCase = catchAsyncErrors(async (req, res, next) => {
    const testcase = await TestCases.create(req.body);
    const problemId = req.body.problemId;

    const problem = await Problem.findById(problemId);

    if (!problem) {
        return next(new ErrorHandler("Problem not found", 404));
    }

    res.status(200).json({
        success: true,
        testcase,
    });
});

//Get a single testcase => /api/v1/testcase/
exports.getSingleTestCase = catchAsyncErrors(async (req, res, next) => {
    const {problemId} = req.body;

    const testcase = await TestCases.findOne({problemId: problemId});

    if (!testcase) {
        return next(new ErrorHandler("Testcase not found", 404));
    }

    res.status(200).json({
        success: true,
        testcase,
    });
});