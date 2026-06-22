require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: norra } = await supabase
    .from('wr_champion_details')
    .select('*')
    .eq('champion_id', 'Norra')
    .single();
    
  console.log('Norra in DB:', JSON.stringify(norra, null, 2));
}

run();
