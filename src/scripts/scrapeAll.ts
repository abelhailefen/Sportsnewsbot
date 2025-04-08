import { scrapeBBC } from '../utils/scrapers/bbc';
import { scrapeSkySports } from '../utils/scrapers/skysports';
import { scrapeESPN } from '../utils/scrapers/espn';
import { sendToTelegram } from '../utils/telegram'; 
import axios from 'axios';
import dotenv from 'dotenv';
// Define the function to summarize articles using Gemini
/* async function summarizeWithGemini(articleTitle: string, articleUrl: string) {
    dotenv.config();
    const geminiApiUrl = 'const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;';
    const geminiApiKey = process.env.GEMINI_API_KEY;  
    try {
      const response = await axios.post(
        geminiApiUrl,
        {
          title: articleTitle,
          url: articleUrl,
        },
        {
          headers: {
            'Authorization': `Bearer ${geminiApiKey}`,
          }
        }
      );
      return response.data.summary;  // Assuming the response has a 'summary' field
    } catch (error) {
      console.error(` Error summarizing article: ${articleTitle}`, error);
      return null;
    }
  } */


async function scrapeAll() {
  console.log(" Starting scraping for all sports news sources...");

  // Scrape BBC
  try {
    const bbcArticles = await scrapeBBC();
    
    if (bbcArticles.length === 0) {
        await sendToTelegram("⏳ No new articles found on BBC Sport today.");
        return;
    }

    // Remove duplicates
    const uniqueArticles = bbcArticles.filter((article, index, self) =>
        index === self.findIndex(a => a.url.split('#')[0] === article.url.split('#')[0])
    );

    let message = `<b>Latest BBC Sports News (${uniqueArticles.length}):</b>\n\n`;
    message += uniqueArticles.map(
        (article, i) => `${i+1}. <a href="${article.url}">${article.title}</a>`
    ).join('\n');

    await sendToTelegram(message);
    console.log("Articles sent to Telegram");

} catch (error) {
    console.error("Error during scraping:", error);
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
