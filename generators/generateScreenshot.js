const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const artDir = "./Art"; // Directory where student projects are stored

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // Set to false to debug
  const studentDirs = fs
    .readdirSync(artDir)
    .filter((dir) => fs.lstatSync(path.join(artDir, dir)).isDirectory());

  for (const dir of studentDirs) {
    const projectPath = path.resolve(__dirname, artDir, dir, "index.html");
    const screenshotPath = path.join(artDir, dir, "icon.png");

    if (fs.existsSync(projectPath)) {
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        await page.goto(`file://${projectPath}`, { waitUntil: "networkidle2" });

        // Optionally, wait for specific elements
        // await page.waitForSelector('body');

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
