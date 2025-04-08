import { chromium } from "playwright";

export async function scrapeESPN() {
  console.log("Launching headless browser for ESPN...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.espn.com/soccer/", { timeout: 60000 });

  // Wait for headline titles
  await page.waitForSelector("h2.contentItem__title");

  const articles = await page.$$eval("h2.contentItem__title", (titles) => {
    return titles.map((titleElement) => {
      const title = titleElement.textContent?.trim();
      let url = null;

      // Try to find the closest anchor tag
      let parent = titleElement.parentElement;
      while (parent && !url) {
        const link = parent.querySelector("a");
        if (link?.getAttribute("href")) {
          url = link.getAttribute("href");
        }
        parent = parent.parentElement;
      }

      if (title && url) {
        return {
          title,
          url: url.startsWith("http") ? url : `https://www.espn.com${url}`,
        };
      }

      return null;
    }).filter((item): item is { title: string; url: string } => !!item);
  });

  await browser.close();

  if (articles.length === 0) {
    console.log("❌ No articles scraped.");
  } else {
    console.log(`✅ Scraped ${articles.length} articles from ESPN:\n`);
    articles.forEach((article, idx) => {
      console.log(`${idx + 1}. ${article.title}`);
      console.log(`   ${article.url}`);
    });
  }

  return articles;
}
