const Docker = require('dockerode');

const docker = new Docker();

// Function to start a Docker container and execute code
async function executeCode(language, code, problemId) {
  const imageName = 'backend-image'; 
  // Create a container using the Docker image
  const container = await docker.createContainer({
    Image: imageName,
    Tty: true,
    HostConfig: {
      AutoRemove: true,
    },
    Env: [
      `LANGUAGE=${language}`,
      `CODE=${code}`,
      `PROBLEM_ID=${problemId}`
    ], // Set environment variables for language, code, and problem ID
    Cmd: [''], // Command to run the code inside the container
  });

  // Start the container
  await container.start();

  // Wait for the container to exit
  const data = await container.wait();

  // Get the container's output
  const output = await container.logs({ stdout: true, stderr: true });

  // Cleanup: Remove the container
  await container.remove();

  return {
    exitCode: data.StatusCode,
    output: output.toString('utf-8'),
  };
}

// Example usage
const language = 'javascript'; // Replace with the language of the submitted code
const code = 'console.log("Hello, World!");'; // Replace with the submitted code
const problemId = '123'; // Replace with the ID of the problem

executeCode(language, code, problemId)
  .then((result) => {
    console.log('Execution Result:', result);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
