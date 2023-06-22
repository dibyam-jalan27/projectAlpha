const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { exec } = require("child_process");

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
    return next(new ErrorHandler("Please provide language and code", 404));
  }
  let result = "null";
  try{
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
      await createInputFile(input);
      result = await compileJava(filePath);
      break;
    case "py":
      await createInputFileForPy(input);
      result = await compilePython(filePath);
      break;
    default:
      return next(new ErrorHandler("Please provide language and code", 404));
  }
  res.json({ success: true, data: result });
}
catch(err){
  res.json({ success: false, data: err })
}
});

//Create file
const createFile = async (format, content) => {
  const jobID = uuid();
  const fileName = `${jobID}.${format}`;
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
  const outFilePath = path.join(outPath, `${jovID}.exe`);

  return new Promise((resolve, reject) => {
    exec(
      `gcc ${filePath} -o ${outFilePath} && cd ${outPath} && .\\${jovID}.exe < Input.txt`,
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
  const outFilePath = path.join(outPath, `${jovID}.exe`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outFilePath} && cd ${outPath} && .\\${jovID}.exe < Input.txt`,
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
  const jovID = path.basename(filePath).split(".")[0];
  const outFilePath = path.join(outPath, `${jovID}.class`);

  return new Promise((resolve, reject) => {
    exec(
      `javac ${filePath} && cd ${outPath} && java ${outFilePath}`,
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
}

//Compile Python
const compilePython = async (filePath) => {
  const jovID = path.basename(filePath).split(".")[0];
  return new Promise((resolve, reject) => {
    exec(
      `python ${filePath} < Input.txt`,
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
}