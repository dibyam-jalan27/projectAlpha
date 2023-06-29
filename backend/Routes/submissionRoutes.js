// Import required modules and libraries
const express = require("express");
const router = express.Router();
const { spawnSync } = require("child_process");
const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { performance } = require("perf_hooks");
const TestCases = require("../Models/testcasesModel");
const Problem = require("../Models/problemModel");

// Initialize Express app and Docker client
const docker = new Docker();

// Define the API endpoint for running the script
router.route("/submit").post(async (req, res) => {
  try {
    // Extract the code language and input from the request body
    const { language, problemId } = req.body;

    // Check if the code language is supported (e.g., 'cpp', 'c', 'py', or 'java' in this example)
    if (
      language !== "cpp" &&
      language !== "c" &&
      language !== "py" &&
      language !== "java"
    ) {
      return res.status(400).json({ error: "Unsupported code language" });
    }

    const { testCase } = await TestCases.findOne({ problemId: problemId });
    const { timeLimit, memoryLimit } = await Problem.findOne({
      _id: problemId,
    });

    // Code and input from the request body
    const code = req.body.code;

    // Create necessary directories if they don't exist
    const dirCodes = path.join(__dirname, "../Codes");
    const outPath = path.join(__dirname, "../Outputs");
    const inPath = path.join(__dirname, "../Inputs");
    const shellPath = path.join(__dirname, "../Scripts");

    [dirCodes, outPath, inPath, shellPath].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Helper function to create a file
    const createFile = (format, content) => {
      const jobID = uuid();
      const fileName = `${jobID}.${format}`;
      const filePath = path.join(dirCodes, fileName);
      fs.writeFileSync(filePath, content);
      return filePath;
    };

    // Helper function to create an input file
    const createInput = (content, base) => {
      const fileName = `${base}_input.txt`;
      const p_input = path.join(inPath, fileName);
      fs.writeFileSync(p_input, content);
      return p_input;
    };

    // Helper function to create a shell script for compilation
    const createCompileShell = (base, language) => {
      const fileName = `${base}_compile.sh`;
      const p_sh = path.join(shellPath, fileName);

      let content = "";
      if (language === "cpp") {
        content = `#!/bin/bash
g++ ${base}.cpp -o ${base}.exe
`;
      } else if (language === "c") {
        content = `#!/bin/bash
gcc ${base}.c -o ${base}.out
`;
      }

      fs.writeFileSync(p_sh, content);
      return p_sh;
    };

    // Helper function to create a shell script for execution
    const createExecuteShell = (base, language) => {
      const fileName = `${base}_execute.sh`;
      const p_sh = path.join(shellPath, fileName);

      let content = "";
      if (language === "cpp") {
        content = `#!/bin/bash
./${base}.exe < ${base}_input.txt > ${base}_output.txt
`;
      } else if (language === "c") {
        content = `#!/bin/bash
./${base}.out < ${base}_input.txt > ${base}_output.txt
`;
      } else if (language === "py") {
        content = `#!/bin/bash
python ${base}.py < ${base}_input.txt > ${base}_output.txt
`;
      } else if (language === "java") {
        content = `#!/bin/bash
java ${base}.java < ${base}_input.txt > ${base}_output.txt
`;
      }

      fs.writeFileSync(p_sh, content);
      return p_sh;
    };

    // Helper function to create an output file
    const createOutput = (base) => {
      const fileName = `${base}_output.txt`;
      const p_output = path.join(outPath, fileName);
      return p_output;
    };

    // Generate a unique filename base
    const base = uuid();

    // Create the code file
    const filePath = createFile(language, code);

    const results = [];

    for (let i = 0; i < testCase.length; i++) {
      const input = testCase[i].input;
      const output = testCase[i].output;

      // Create the input file
      const p_input = createInput(input, base);

      // Create the compilation shell script
      const p_compile_sh = createCompileShell(base, language);

      // Create the execution shell script
      const p_execute_sh = createExecuteShell(base, language);

      // Create the output file
      const p_output = createOutput(base);

      let CE = false;

      // Create a container using Docker
      let auxContainer;
      try {
        const image =
          language === "py"
            ? "python:latest"
            : language === "java"
            ? "openjdk:latest"
            : "gcc";
        auxContainer = await docker.createContainer({
          Image: image,
          AttachStdin: false,
          AttachStdout: true,
          AttachStderr: true,
          Tty: true,
          Cmd: ["/bin/bash"],
          OpenStdin: false,
          StdinOnce: false,
        });

        // Start the container
        await auxContainer.start();

        // Copy the code file to the container
        spawnSync(
          `docker cp ${filePath} ${auxContainer.id}:/${base}.${language}`,
          {
            encoding: "utf-8",
            shell: true,
          }
        );

        // Copy the input file to the container
        spawnSync(
          `docker cp ${p_input} ${auxContainer.id}:/${base}_input.txt`,
          {
            encoding: "utf-8",
            shell: true,
          }
        );

        // Copy the compilation shell script to the container
        spawnSync(
          `docker cp ${p_compile_sh} ${auxContainer.id}:/${base}_compile.sh`,
          {
            encoding: "utf-8",
            shell: true,
          }
        );

        // Execute the compilation shell script inside the container
        let obj = spawnSync(
          `docker exec ${auxContainer.id} //bin//bash ./${base}_compile.sh`,
          {
            encoding: "utf-8",
            shell: true,
          }
        );
        if (obj.stderr) {
          CE = true;
          results.push({ verdict: "CE", time: "0", memory: "0" });
          continue;
        }

        // Copy the execution shell script to the container
        spawnSync(
          `docker cp ${p_execute_sh} ${auxContainer.id}:/${base}_execute.sh`,
          {
            encoding: "utf-8",
            shell: true,
          }
        );

        // Execute the execution shell script inside the container
        const start = performance.now();
        obj = spawnSync(
          `docker exec ${auxContainer.id} //bin//bash ./${base}_execute.sh`,
          {
            encoding: "utf-8",
            shell: true,
            timeout: timeLimit * 1000,
          }
        );
        const end = performance.now();
        if (obj.stderr) {
          CE = true;
          results.push({ verdict: "CE", time: "0", memory: "0" });
          continue;
        }

        // Copy the output file from the container to the host
        spawnSync(
          `docker cp ${auxContainer.id}:/${base}_output.txt ${p_output}`,
          {
            encoding: "utf-8",
            shell: true,
          }
        );

        // Stop and remove the container
        await auxContainer.stop();
        await auxContainer.remove();

        // Calculate the execution time
        const executionTime = end - start;

        // Read the output file from the host
        const outputContent = fs.readFileSync(p_output, "utf-8");

        // Send the response with the output, execution time, and memory usage (assuming 0 for now)
        const verdict = outputContent.trim === output ? "AC" : "WA";

        results.push({ verdict, time: executionTime, memory: "0" });
      } catch (err) {
        console.error(err);
        if (!CE) {
          res.status(500).json({ error: "Internal Server Error" });
        }
      } finally {
        // Remove the code file from the host
        fs.unlinkSync(filePath);

        // Remove the input file from the host
        fs.unlinkSync(p_input);

        // Remove the compilation shell script from the host
        fs.unlinkSync(p_compile_sh);

        // Remove the execution shell script from the host
        fs.unlinkSync(p_execute_sh);

        // Remove the output file from the host
        fs.unlinkSync(p_output);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
