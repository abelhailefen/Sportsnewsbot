// src/utils/scraping/bbc.ts
import { chromium } from 'playwright';

export type Article = {
  title: string;
  url: string;
  content: string;
  source: string;
};

export async function scrapeBBC(): Promise<Article[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Launching headless browser for BBC...');
  await page.goto('https://www.bbc.com/sport/football', { waitUntil: 'domcontentloaded' });

  // Extract article links (BBC now uses /sport/football/articles/slug)
  const articleLinks = await page.$$eval('a[href*="/sport/football/articles/"]', (links) => {
    return Array.from(new Set(links.map(link => {
      const href = link.getAttribute('href');
      return href?.startsWith('http') ? href : `https://www.bbc.com${href}`;
    })));
  });

  console.log(`🔗 Found ${articleLinks.length} BBC article links.`);

  const articles: Article[] = [];

  for (const url of articleLinks.slice(0, 5)) { // limit to top 5 for speed
    try {
      const articlePage = await browser.newPage();
      await articlePage.goto(url, { waitUntil: 'domcontentloaded' });

      const title = await articlePage.textContent('h1') || 'No title';
      const paragraphs = await articlePage.$$eval('article p', ps => ps.map(p => p.textContent || ''));
      const content = paragraphs.join('\n').trim();

      if (content) {
        articles.push({
          title: title.trim(),
          url,
          content,
          source: 'BBC Sport',
        });
        console.log(`✅ Scraped: ${title}`);
      }

      await articlePage.close();
    } catch (err) {
      console.warn(`⚠️ Failed to scrape: ${url}`);
    }
  }

  await browser.close();
  return articles;
}
