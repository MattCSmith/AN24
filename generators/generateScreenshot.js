const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const artDir = "Art"; // Adjusted to be relative to the root of the repository

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const studentDirs = fs
    .readdirSync(artDir)
    .filter((dir) => fs.lstatSync(path.join(artDir, dir)).isDirectory());

  console.log("Student directories:", studentDirs);

  for (const dir of studentDirs) {
    console.log(`CWD: ${process.cwd()}`);
    console.log(`Art directory: ${artDir}`);
    console.log("Directory:", dir);
    const projectPath = path.join(process.cwd(), artDir, dir, "index.html");
    const screenshotPath = path.join(process.cwd(), artDir, dir, "icon.png");
    const tempPath = path.join(process.cwd(), artDir, dir, "temp.png"); // Temporary path for high-resolution screenshot

    console.log(`Checking for index.html at: ${projectPath}`);

    if (fs.existsSync(projectPath)) {
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        await page.goto(`file://${projectPath}`, { waitUntil: "networkidle2" });

        // Optional: Wait for specific elements
        await page.waitForSelector("body");

        // Take a high-resolution screenshot
        await page.screenshot({ path: tempPath, fullPage: true, type: "png" });
        console.log(`High-resolution screenshot generated for ${dir}`);

        // Verify the temporary screenshot file
        const stats = fs.statSync(tempPath);
        console.log(`Temporary file size: ${stats.size} bytes`);

        // Process and compress the image using sharp
        await sharp(tempPath)
          .resize({ width: 500 }) // Resize to 500px width
          .toFormat("png", { quality: 80 }) // Adjust quality for PNG
          .toFile(screenshotPath);
        console.log(`Screenshot processed and saved to ${screenshotPath}`);
      } catch (err) {
        console.error(
          `Failed to generate or process screenshot for ${dir}:`,
          err
        );
      } finally {
        // Optionally remove the temporary high-resolution file
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    } else {
      console.log(`index.html not found for ${dir}`);
    }
  }

  await browser.close();
})();
