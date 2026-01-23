// lib/telegram.js
import "dotenv/config";

export async function sendMessage(text) {
  const res = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    }
  );

  const data = await res.json();
  if (!data.ok) throw new Error(data.description);
}
