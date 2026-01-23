import { supabase } from "./supabase.js";

/**
 * Returns true if asin exists in DB
 * @param {string} asin
 * @returns {Promise<boolean>}
 */
export async function hasPosted(asin) {
  if (!asin) return false;
  const { data, error } = await supabase
    .from("posted_products")
    .select("asin")
    .eq("asin", asin)
    .maybeSingle();

  if (error) {
    console.error("Supabase hasPosted error:", error);
    throw error;
  }
  return !!data;
}

/**
 * Mark ASIN as posted (inserts or updates last_posted_at)
 * @param {{asin:string, priceText?:string|null, url?:string|null, telegramMessageId?:number|null, itemName?:string|null}} input
 */
export async function markPosted({
  asin,
  priceText = null,
  url = null,
  telegramMessageId = null,
  itemName = null
}) {
  if (!asin) throw new Error("asin required");

  const payload = {
    asin,
    last_posted_at: new Date().toISOString(),
    last_price_text: priceText,
    last_url: url,
    telegram_message_id: telegramMessageId,
    item_name: itemName
  };

  const { error } = await supabase
    .from("posted_products")
    .upsert(payload, { onConflict: "asin" });

  if (error) {
    console.error("Supabase markPosted error:", error);
    throw error;
  }
}

/**
 * Optional: shouldPost if last_posted_at older than ttlDays (returns boolean)
 * @param {string} asin
 * @param {number} ttlDays
 */
export async function shouldPostWithTTL(asin, ttlDays = 30) {
  const { data, error } = await supabase
    .from("posted_products")
    .select("last_posted_at")
    .eq("asin", asin)
    .maybeSingle();

  if (error) throw error;
  if (!data) return true; // never posted
  const last = new Date(data.last_posted_at);
  const cutoff = Date.now() - ttlDays * 24 * 60 * 60 * 1000;
  return last.getTime() < cutoff;
}
