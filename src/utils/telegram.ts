import fetch from 'node-fetch';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''; 
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// Function to send a message to Telegram
async function sendToTelegram(message: string) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
  
    if (!response.ok) {
      throw new Error(`Telegram error: ${await response.text()}`);
    }
  }