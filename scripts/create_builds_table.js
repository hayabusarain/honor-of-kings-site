const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Setting up champion_builds table via SQL...");

  const sql = `
    CREATE TABLE IF NOT EXISTS public.champion_builds (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        champion_id TEXT NOT NULL,
        title TEXT NOT NULL,
        author_name TEXT DEFAULT '匿名',
        description TEXT,
        items JSONB DEFAULT '[]'::jsonb,
        runes JSONB DEFAULT '{}'::jsonb,
        spells JSONB DEFAULT '[]'::jsonb,
        upvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_champion_builds_champion_id ON public.champion_builds(champion_id);
    CREATE INDEX IF NOT EXISTS idx_champion_builds_upvotes ON public.champion_builds(upvotes DESC);
  `;

  // We can execute raw SQL using Supabase rpc if we have a generic 'exec_sql' function.
  // Alternatively, if we don't have rpc for raw SQL, we can't easily run DDL via JS client without an API.
  // Let's check if the table can be created via REST. No.
  console.log("Since we cannot run DDL via REST client natively, please run the following SQL in the Supabase SQL Editor:");
  console.log(sql);
}

main();
