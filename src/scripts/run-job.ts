import { scrapeFootballNews } from "@/utils/scraping";
import { summarizeWithGemini } from "@/utils/gemini";
import { sendToTelegram } from "@/utils/telegram";

const runJob = async () => {
  try {
    const headlines = await scrapeFootballNews();
    const text = headlines.join("\n");
    const summary = await summarizeWithGemini(text);
    await sendToTelegram(`⚽ *Today's European Football Summary:*\n\n${summary}`);
    console.log("✅ News summary sent to Telegram.");
  } catch (error) {
    console.error("❌ Job failed:", error);
  }
};

runJob();
