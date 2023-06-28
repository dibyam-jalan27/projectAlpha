const { spawnSync } = require("child_process");
const Docker = require("dockerode");
const { performance } = require("perf_hooks");

const docker = new Docker();

exports.cSubmition = async (
  timeLimit,
  filePath,
  base,
  p_input,
  p_sh,
  p_output
) => {
  let auxContainer;

  let result = {};
  docker
    .createContainer({
      Image: "gcc",
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Cmd: ["/bin/bash"],
      OpenStdin: false,
      StdinOnce: false,
    })
    .then(function (container) {
      auxContainer = container;
      return auxContainer.start();
    })
    .then(async (data) => {
      let obj = spawnSync(
        `docker cp ${filePath}  ${auxContainer.id}:/${base}.c`,
        { encoding: "utf-8", shell: true }
      );
      if (obj.stderr.length) {
        result = {
          status: "error",
          message: "Server Error1",
        };
        cleanupFiles();
        return;
      }
      obj = spawnSync(
        `docker cp ${p_input}  ${auxContainer.id}:/${base}_input.txt`,
        { encoding: "utf-8", shell: true }
      );
      if (obj.stderr.length) {
        result = {
          status: "error",
          message: "Server Error2",
        };
        cleanupFiles();
        return;
      }
      obj = spawnSync(
        `docker exec ${auxContainer.id} gcc ${base}.c -o ${base}.exe`,
        { encoding: "utf-8", shell: true }
      );
      if (obj.stderr.length) {
        result = {
          status: "error",
          message: "Server Error3",
        };
        cleanupFiles();
        return;
      }
      obj = spawnSync(`docker cp ${p_sh} ${auxContainer.id}:/${base}_sh.sh`, {
        encoding: "utf-8",
        shell: true,
      });
      if (obj.stderr.length) {
        result = {
          status: "error",
          message: "Server Error4",
        };
        cleanupFiles();
        return;
      }
      const start = performance.now();
      obj = spawnSync(
        `docker exec ${auxContainer.id} //bin//sh ./${base}_sh.sh`,
        { encoding: "utf-8", shell: true }
      );
      if (obj.stderr.length) {
        result = {
          status: "error",
          message: "Server Error5",
        };
        cleanupFiles();
        return;
      }
      const end = performance.now();
      if (end - start > timeLimit) {
        result = {
          status: "error",
          message: "Time Limit Exceeded",
        };
        cleanupFiles();
        return;
      }
      obj = spawnSync(
        `docker cp ${auxContainer.id}:/${base}_output.txt ${p_output}`,
        { encoding: "utf-8", shell: true }
      );
      if (obj.stderr.length) {
        result = {
          status: "error",
          message: "Server Error6",
        };
        cleanupFiles();
        return;
      }
      const d1 = fs.readFileSync(p_output, {
        encoding: "utf-8",
        flag: "r",
      });
      result = {
        status: "success",
        message: d1,
      };
      cleanupFiles();
    })
    .then(function (data) {
      return auxContainer.stop();
    })
    .then(function (data) {
      return auxContainer.remove();
    })
    .then(function (data) {})
    .catch(async (err) => {
      result = {
        status: "error",
        message: "Server Error7",
      };
    });

  return result;

  function cleanupFiles() {
    fs.unlink(p_input, (err) => {});
    fs.unlink(p_sh, (err) => {});
    fs.unlink(p_output, (err) => {});
    fs.unlink(filePath, (err) => {});
  }
};
