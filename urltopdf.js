const fs = require('fs');
const puppeteer = require('puppeteer');

const list = fs
  .readFileSync('urls.txt', { encoding: 'utf8', flag: 'r' })
  .trim()
  .split(`\n`);

const getFileName = (url) => {
  return new URL(url).pathname.replace(/[^\w\-_]+/g, '');
};

(async () => {
  const browser = await puppeteer.launch({ devtools: true, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  async function printPage(url, path) {
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    await page.pdf({
      path: path,
      format: 'A4',
      printBackground: false,
      displayHeaderFooter: true,
      margin: { top: `0.4in`, right: `0.4in`, bottom: `0.4in`, left: `0.4in` },
    });
  }

  async function start() {
    console.log(`Print start`);
    for (let index = 0, length = list.length; index < length; index++) {
      const url = list[index];
      const path = `${getFileName(url)}.pdf`;
      try {
        console.log(`Printing (${index + 1}/${length}): ${url}`);
        await printPage(url, path);
        console.log(`Done => ${path}`);
      } catch (err) {
        console.error(err);
      }
    }
  }

  await start();

  await page.close();
  await browser.close();
})();
