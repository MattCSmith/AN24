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

        // Log page content for debugging
        const pageContent = await page.content();
        fs.writeFileSync(
          path.join(process.cwd(), artDir, dir, "page.html"),
          pageContent
        );

        // Log console messages
        page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

        // Take a high-resolution screenshot
        await page.screenshot({ path: tempPath, fullPage: true });
        console.log(`High-resolution screenshot generated for ${dir}`);

        // Process and compress the image using sharp
        await sharp(tempPath)
          .resize({ width: 500 }) // Resize to 500px width
          .toFormat("png", { quality: 80 }) // Adjust quality; 80 is a good balance for PNG
          .toFile(screenshotPath, (err, info) => {
            if (err) {
              console.error(`Failed to process image for ${dir}:`, err);
            } else {
              console.log(`Screenshot processed and saved for ${dir}`, info);
            }
          });

        // Optionally remove the temporary high-resolution file
        fs.unlinkSync(tempPath);
      } catch (err) {
        console.error(`Failed to generate screenshot for ${dir}:`, err);
      }
    } else {
      console.log(`index.html not found for ${dir}`);
    }
  }

  await browser.close();
})();
