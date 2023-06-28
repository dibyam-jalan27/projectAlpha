const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { exec } = require("child_process");
const TestCases = require("../Models/testcasesModel");

const dirCodes = path.join(__dirname, "../Codes");
const outPath = path.join(__dirname, "../Outputs");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}

//compile C
const compileC = async (filePath) => {
  return new Promise((resolve, reject) => {
    exec(
      `gcc -o ${outPath}/program ${filePath}`,
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

//compile Cpp
const compileCpp = async (filePath) => {
  return new Promise((resolve, reject) => {
    exec(
      `g++ -o ${outPath}/program ${filePath}`,
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

//compile Java
const compileJava = async (filePath) => {
  return ; 
};

//compile Python
const compilePython = async (filePath) => {
  return ;
};


//Language compile functions
const compileFunctions ={
  c:compileC,
  cpp:compileCpp,
  java:compileJava,
  py:compilePython
}

//Run code -api/v1/run
exports.runCode = catchAsyncErrors(async (req, res, next) => {
  const { language, code, input } = req.body;
  if (!language || !code) {
    return next(new ErrorHandler("Please provide language and code", 400));
  }
  try {
    const filePath = await createFile(language, code);
    const result = await compileAndExecute(language, filePath, input);
    res.json({ success: true, result });
    console.log({ success: true, result });
  } catch (err) {
    res.json({ success: false, data: err });
    console.log({ success: false, data: err });
  }
});

//Submit code api/vi/submit
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
    for (let i = 1; i <= 3; i++) {
      const inputCase = testcase[`testCase${i}`];
      const resultCase = testcase[`resultCase${i}`].replace(/\n/g, "\r\n") + "\r\n";

      const result = await compileAndExecute(language, filePath, inputCase);

      if (result !== resultCase) {
        return res.json({ success: false, result: `Testcase ${i} failed` });
      }
    }
  } catch (err) {
    res.json({ success: false, result : err });
  }
  res.json({ success: true, result: "All testcases passed" });
});

//Create file
const createFile = async (format, content) => {
  const jobID = uuid();
  const fileName = `${jobID}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  fs.writeFileSync(filePath, content);
  return filePath;
};

const compileAndExecute = async (language, filePath, input) => {
  const compileFunction = compileFunctions[language];
  if(!compileFunction){
    return new ErrorHandler("Language not supported", 404);
  }
  try{
    await compileFunction(filePath);
    const result = await executeCode(language,filePath, input);
    return result;
  }
  catch(err){
    throw new ErrorHandler("Run time error", 500);
  }
};


//execute code
const executeCode = async (language, filePath, input) => {
  return new Promise((resolve, reject) => {
    let executionCommand;

    switch (language) {
      case "c":
      case "cpp":
        executionCommand = `${outPath}/program`;
        break;
      case "java":
        executionCommand = `java ${filePath}`;
        break;
      case "py":
        executionCommand = `python ${filePath}`;
        break;
      default:
        return reject("Language not supported");
    }

    const child = exec(executionCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      }
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });

    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
};


