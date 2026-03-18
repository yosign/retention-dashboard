import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto(`${baseUrl}/retention`, {
    waitUntil: "networkidle",
    timeout: 20000,
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "retention-final.png", fullPage: true });
  console.log("retention done");

  await page.goto(`${baseUrl}/payback`, {
    waitUntil: "networkidle",
    timeout: 20000,
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "payback-final.png", fullPage: true });
  console.log("payback done");

  await browser.close();
})();
