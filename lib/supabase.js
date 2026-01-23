import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  // Use ANON key for standard requests (or SERVICE_ROLE for trusted server-only actions)
  process.env.SUPABASE_KEY
);
