import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching latest TOP lane tier list...");
  const { data, error } = await supabase
    .from('champion_stats')
    .select('*')
    .eq('role', 'TOP')
    .order('win_rate', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching data:", error);
    process.exit(1);
  }

  const outPath = path.join(process.cwd(), 'src', 'data', 'top_tier.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`Saved ${data.length} champions to ${outPath}`);
}

main();
