const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const artDir = "Art"; // Adjusted to be relative to the root of the repository

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const studentDirs = fs
    .readdirSync(artDir)
    .filter((dir) => fs.lstatSync(path.join(artDir, dir)).isDirectory());

  console.log("Student directories:", studentDirs);

  for (const dir of studentDirs) {
    const projectPath = path.join(process.cwd(), artDir, dir, "index.html");
    const screenshotPath = path.join(process.cwd(), artDir, dir, "icon.png");

    console.log(`Checking for index.html at: ${projectPath}`);

    if (fs.existsSync(projectPath)) {
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        await page.goto(`file://${projectPath}`, { waitUntil: "networkidle2" });

        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot generated for ${dir}`);
      } catch (err) {
        console.error(`Failed to generate screenshot for ${dir}:`, err);
      }
    } else {
      console.log(`index.html not found for ${dir}`);
    }
  }

  await browser.close();
})();
