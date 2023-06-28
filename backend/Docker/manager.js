const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs");

const dirCodes = path.join(__dirname, "../Codes");
const outPath = path.join(__dirname, "../Outputs");
const inPath = path.join(__dirname, "../Inputs");
const shellPath = path.join(__dirname, "../Scripts");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

if (!fs.existsSync(shellPath)) {
  fs.mkdirSync(shellPath, { recursive: true });
}

if (!fs.existsSync(inPath)) {
  fs.mkdirSync(inPath, { recursive: true });
}

if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}

const createFile = (format, content) => {
  const jobID = uuid();
  const fileName = `${jobID}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  fs.writeFileSync(filePath, content);
  return filePath;
};

const createInput = (content, base) => {
  const fileName = `${base}_input.txt`;
  const p_input = path.join(inPath, fileName);
  fs.writeFileSync(p_input, content);
  return p_input;
};

const createShell = (format, base) => {
  const fileName = `${base}_sh.sh`;
  const p_sh = path.join(shellPath, fileName);
  let content;
  switch (format) {
    case "cpp":
      content = `#!/bin/bash

      g++ ${base}.cpp -o ${base}.exe
      ./${base}.exe < ${base}_input.txt > ${base}_output.txt
      `;
      break;
    case "py":
      content = `#!/bin/bash

        python3 ${base}.py < ${base}_input.txt > ${base}_output.txt
        `;
      break;
    case "java":
      content = `#!/bin/bash

        javac ${base}.java
        java ${base} < ${base}_input.txt > ${base}_output.txt
        `;
      break;
    case "js":
      content = `#!/bin/bash

        node ${base}.js < ${base}_input.txt > ${base}_output.txt
        `;
      break;
    case "c":
      content = `#!/bin/bash
            
        gcc ${base}.c -o ${base}.exe
        ./${base}.exe < ${base}_input.txt > ${base}_output.txt
        `;
      break;
    default:
      return null;
  }
  fs.writeFileSync(p_sh, content);
  return p_sh;
};

const createOutput = (base) => {
  const fileName = `${base}_output.txt`;
  const p_output = path.join(outPath, fileName);
  return p_output;
};


