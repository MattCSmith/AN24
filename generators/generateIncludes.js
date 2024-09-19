const fs = require("fs");
const path = require("path");

const artDir = "./Art";
const outputFile = "./includes.js"; // Path to your includes.js file

// Function to generate the includes.js content
function generateIncludes() {
  const studentDirs = fs
    .readdirSync(artDir)
    .filter((dir) => fs.lstatSync(path.join(artDir, dir)).isDirectory());

  let includesContent = "const includes = [\n";

  studentDirs.forEach((dir) => {
    const projectPath = path.join(artDir, dir);

    // Use directory name as project name
    const projectName = dir;

    // Here you can automate fetching the author information using GitHub's API,
    // but for now let's assume directory name is enough.
    const authorName = dir; // You can replace this with actual GitHub user details if available
    const projectUrl = `./Art/${dir}/index.html`;

    includesContent += `  { projectName: "${projectName}", authorName: "${authorName}", url: "${projectUrl}" },\n`;
  });

  includesContent += "];\n";

  // Write the content to includes.js file
  fs.writeFileSync(outputFile, includesContent);
  console.log(`Generated includes.js with ${studentDirs.length} projects.`);
}

generateIncludes();
