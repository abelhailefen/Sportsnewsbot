import { chromium } from 'playwright';

export type Article = {
  title: string;
  url: string;
  content: string;
  source: string;
};

export async function scrapeSkySports(): Promise<Article[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.skysports.com/football', { waitUntil: 'domcontentloaded' });

  // Optional: wait to ensure all dynamic content loads
  await page.waitForTimeout(3000);

  const articles = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a.sdc-site-tile__headline-link'));
    const result: Article[] = [];

    anchors.forEach(anchor => {
      const title = anchor.querySelector('span.sdc-site-tile__headline-text')?.textContent?.trim();
      const url = anchor.getAttribute('href');

      if (title && url) {
        result.push({
          title,
          url: url.startsWith('http') ? url : `https://www.skysports.com${url}`,
          content: title, // Using title as placeholder for now
          source: 'Sky Sports'
        });
      }
    });

    return result;
  });

  await browser.close();
  return articles;
}
