import { scrapeBBC } from '../utils/scrapers/bbc';
import { scrapeSkySports } from '../utils/scrapers/skysports';
import { scrapeESPN } from '../utils/scrapers/espn';

async function scrapeAll() {
  console.log(" Starting scraping for all sports news sources...");

  // Scrape BBC
  console.log("\n Scraping BBC Sport...");
  const bbcArticles = await scrapeBBC();
  if (bbcArticles.length > 0) {
    console.log(`Scraped ${bbcArticles.length} articles from BBC:`);
    bbcArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} - ${article.url}`);
    });
  } else {
    console.log("No articles scraped from BBC.");
  }

  // Scrape Sky Sports
  console.log("\n Scraping Sky Sports...");
  const skySportsArticles = await scrapeSkySports();
  if (skySportsArticles.length > 0) {
    console.log(`Scraped ${skySportsArticles.length} articles from Sky Sports:`);
    skySportsArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} - ${article.url}`);
    });
  } else {
    console.log("No articles scraped from Sky Sports.");
  }

  // Scrape ESPN
  console.log("\nScraping ESPN...");
  const espnArticles = await scrapeESPN();
  if (espnArticles.length > 0) {
    console.log(` Scraped ${espnArticles.length} articles from ESPN:`);
    espnArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} - ${article.url}`);
    });
  } else {
    console.log("No articles scraped from ESPN.");
  }

  // Check if we scraped any articles
  if (bbcArticles.length === 0 && skySportsArticles.length === 0 && espnArticles.length === 0) {
    console.log("No articles scraped from any sources.");
    return;
  }

  console.log("\nScraping completed!");
}

// Call the scrapeAll function
scrapeAll().catch((error) => {
  console.error("Error during scraping:", error);
});
