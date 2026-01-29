import "dotenv/config";

const BASE_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

async function callTelegram(method, payload) {
  const res = await fetch(`${BASE_URL}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram error: ${data.description}`);
  return data.result;
}

export async function sendPhoto(photoUrl, caption) {
  return callTelegram("sendPhoto", {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    photo: photoUrl,
    caption: caption,
    parse_mode: "HTML",
  });
}
