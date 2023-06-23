const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const TestCases = require("../Models/testcasesModel")

//create new Testcase => /api/v1/admin/testcase/new
exports.newTestCase = catchAsyncErrors(async (req, res, next) => {
    const testcase = await TestCases.create(req.body);

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