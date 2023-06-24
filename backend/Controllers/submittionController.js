const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { exec } = require("child_process");
const TestCases = require("../Models/testcasesModel");

const dirCodes = path.join(__dirname, "../Codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const outPath = path.join(__dirname, "../Outputs");

if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}

//Compile code
exports.compileCode = catchAsyncErrors(async (req, res, next) => {
  const { language, code, input } = req.body;
  if (!language || !code) {
    return next(new ErrorHandler("Please provide language and code", 400));
  }
  let result = "null";
  try {
    const filePath = await createFile(language, code);
    switch (language) {
      case "c":
        await createInputFile(input);
        result = await compileC(filePath);
        break;
      case "cpp":
        await createInputFile(input);
        result = await compileCpp(filePath);
        break;
      case "java":
        await createInputFileForPy(input);
        result = await compileJava(filePath);
        break;
      case "py":
        await createInputFileForPy(input);
        result = await compilePython(filePath);
        break;
      default:
        return next(new ErrorHandler("Please provide language and code", 400));
    }
    res.json({ success: true, result });
  } catch (err) {
    res.json({ success: false, data: err });
  }
});

//Submit code
exports.submitCode = catchAsyncErrors(async (req, res, next) => {
  const { language, code, problemId } = req.body;
  if (!language || !code || !problemId) {
    return next(
      new ErrorHandler("Please provide language, code and problemId", 404)
    );
  }
  const testcase = await TestCases.findOne({ problemId: problemId });
  if (!testcase) {
    return next(new ErrorHandler("Testcase not found", 404));
  }
  try {
    const filePath = await createFile(language, code);
    switch (language) {
      case "c":
        await createInputFile(testcase.testCase1);
        testcase.resultCase1 += "\r\n";
        let start1 = process.hrtime();
        const result1 = await compileC(filePath);
        let end1 = process.hrtime(start1);
        if(end1[0] >= 1){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result1 !== testcase.resultCase1) {
          return res.json({ success: false, result: result1 });
        }
        await createInputFile(testcase.testCase2);
        testcase.resultCase2 += "\r\n";
        let start2 = process.hrtime();
        const result2 = await compileC(filePath);
        let end2 = process.hrtime(start2);
        if(end2[0] >= 1){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result2 !== testcase.resultCase2) {
          return res.json({ success: false, result: result2 });
        }
        await createInputFile(testcase.testCase3);
        testcase.resultCase3 += "\r\n";
        let start3 = process.hrtime();
        const result3 = await compileC(filePath);
        let end3 = process.hrtime(start3);
        if(end3[0] >= 1){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result3 !== testcase.resultCase3) {
          return res.json({ success: false, result: result3 });
        }
        break;
      case "cpp":
        await createInputFile(testcase.testCase1);
        testcase.resultCase1 += "\r\n";
        let start4 = process.hrtime();
        const result4 = await compileCpp(filePath);
        let end4 = process.hrtime(start4);
        if(end4[0] >= 1){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result4 !== testcase.resultCase1) {
          return res.json({ success: false, result: result4 });
        }
        await createInputFile(testcase.testCase2);
        testcase.resultCase2 += "\r\n";
        let start5 = process.hrtime();
        const result5 = await compileCpp(filePath);
        let end5 = process.hrtime(start5);
        if(end5[0] >= 1){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result5 !== testcase.resultCase2) {
          return res.json({ success: false, result: result5 });
        }
        await createInputFile(testcase.testCase3);
        testcase.resultCase3 += "\r\n";
        let start6 = process.hrtime();
        const result6 = await compileCpp(filePath);
        let end6 = process.hrtime(start6);
        if(end6[0] >= 1){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result6 !== testcase.resultCase3) {
          return res.json({ success: false, result: result6 });
        }
        break;
      case "java":
        await createInputFileForPy(testcase.testCase1);
        testcase.resultCase1 += "\r\n";
        let start7 = process.hrtime();
        const result7 = await compileJava(filePath);
        let end7 = process.hrtime(start7);
        if(end7[0] >= 1){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result7 !== testcase.resultCase1) {
          return res.json({ success: false, result: result7 });
        }
        await createInputFileForPy(testcase.testCase2);
        testcase.resultCase2 += "\r\n";
        let start8 = process.hrtime();
        const result8 = await compileJava(filePath);
        let end8 = process.hrtime(start8);
        if(end8[0] >= 1){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result8 !== testcase.resultCase2) {
          return res.json({ success: false, result: result8 });
        }
        await createInputFileForPy(testcase.testCase3);
        testcase.resultCase3 += "\r\n";
        let start9 = process.hrtime();
        const result9 = await compileJava(filePath);
        let end9 = process.hrtime(start9);
        if(end9[0] >= 1){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result9 !== testcase.resultCase3) {
          return res.json({ success: false, result: result9 });
        }
        break;
      case "py":
        await createInputFileForPy(testcase.testCase1);
        testcase.resultCase1 += "\r\n";
        let start10 = process.hrtime();
        const result10 = await compilePython(filePath);
        let end10 = process.hrtime(start10);
        if(end10[0] >= 2){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result10 !== testcase.resultCase1) {
          return res.json({ success: false, result: result10 });
        }
        await createInputFileForPy(testcase.testCase2);
        testcase.resultCase2 += "\r\n";
        let start11 = process.hrtime();
        const result11 = await compilePython(filePath);
        let end11 = process.hrtime(start11);
        if(end11[0] >= 2){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result11 !== testcase.resultCase2) {
          return res.json({ success: false, result: result11 });
        }
        await createInputFileForPy(testcase.testCase3);
        testcase.resultCase3 += "\r\n";
        let start12 = process.hrtime();
        const result12 = await compilePython(filePath);
        let end12 = process.hrtime(start12);
        if(end12[0] >= 2){
          return res.json({ success: false, result: "Time Limit Exceeded" });
        }
        if (result12 !== testcase.resultCase3) {
          return res.json({ success: false, result: result12 });
        }
        break;
      default:
        return next(
          new ErrorHandler("Please provide language, code and problemId", 404)
        );
    }
  } catch (err) {
    return res.json({ success: false, result: err });
  }
  res.json({ success: true, result: "Accepted" });
});

//Create file
const createFile = async (format, content) => {
  const jobID = uuid();
  const fileName = format === "java" ? `Main.java` : `${jobID}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  fs.writeFileSync(filePath, content);
  return filePath;
};

//Create Input.txt
const createInputFile = async (input) => {
  const filePath = path.join(outPath, "Input.txt");
  fs.writeFileSync(filePath, input);
};

//Create Input.txt for py
const createInputFileForPy = async (input) => {
  const filePath = path.join(dirCodes, "Input.txt");
  fs.writeFileSync(filePath, input);
};

//Compile C
const compileC = async (filePath) => {
  const jovID = path.basename(filePath).split(".")[0];
  const outfilePath = path.join(outPath, `${jovID}.exe`);

  return new Promise((resolve, reject) => {
    exec(
      `gcc ${filePath} -o ${outfilePath} && cd ${outPath} && .\\${jovID}.exe < Input.txt`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};

//Compile Cpp
const compileCpp = async (filePath) => {
  const jovID = path.basename(filePath).split(".")[0];
  const outfilePath = path.join(outPath, `${jovID}.exe`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outfilePath} && cd ${outPath} && .\\${jovID}.exe < Input.txt`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};

//Compile Java
const compileJava = async (filePath) => {
  const jovID = "Main";

  return new Promise((resolve, reject) => {
    exec(
      `cd ${dirCodes} && javac Main.java  && java ${jovID} < Input.txt`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};

//Compile Python
const compilePython = async (filePath) => {
  return new Promise((resolve, reject) => {
    exec(
      `cd ${dirCodes} && python ${filePath} < Input.txt`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};
