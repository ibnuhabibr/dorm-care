const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://jnxpjjbotcipauflkkch.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueHBqamJvdGNpcGF1Zmxra2NoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwOTcxMSwiZXhwIjoyMDkxNjg1NzExfQ.20vwSMD6yzxp1UZG15voVrwfJfefzcXKcQsEJ-Ebe-Y"
);

async function createGalleryTable() {
  // Try using the query endpoint to run raw SQL via a built-in function
  const { data, error } = await supabase.rpc("exec", {
    query: `CREATE TABLE IF NOT EXISTS gallery (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      image_url TEXT NOT NULL,
      caption TEXT,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`
  }).maybeSingle();

  console.log("exec result:", data, error);
}

createGalleryTable().catch(console.error);
