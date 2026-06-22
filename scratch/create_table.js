const { Client } = require('pg');

// 1. Direct connection (IPv6)
const url1 = 'postgresql://postgres:Rakisuta1048@db.cmlhfnaftwvcnlreuplp.supabase.co:5432/postgres';
// 2. Pooler connection (IPv4) - ユーザーのプロジェクトリファレンスとリージョン(ap-northeast-2)から推測
const url2 = 'postgresql://postgres.cmlhfnaftwvcnlreuplp:Rakisuta1048@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';

async function tryConnect(connectionString) {
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log(`Connected successfully using: ${connectionString.split('@')[1]}`);
    return client;
  } catch (err) {
    console.log(`Failed to connect using: ${connectionString.split('@')[1]} - ${err.message}`);
    return null;
  }
}

async function run() {
  let client = await tryConnect(url1);
  if (!client) {
    client = await tryConnect(url2);
  }
  
  if (!client) {
    console.error('All connection attempts failed.');
    process.exit(1);
  }

  try {
    const query = `
      CREATE TABLE IF NOT EXISTS localization_dictionary (
        key_id text PRIMARY KEY,
        type text NOT NULL,
        ja text,
        en text,
        ko text,
        vi text
      );
    `;
    await client.query(query);
    console.log('Table created successfully!');
    
    // テスト用のダミーデータを投入
    const insertQuery = `
      INSERT INTO localization_dictionary (key_id, type, ja, en, ko, vi)
      VALUES 
        ('item_bf_sword', 'item', 'B.F.ソード', 'B.F. Sword', 'B.F. 대검', 'Kiếm B.F.'),
        ('item_rabadon', 'item', 'ラバドン・デスキャップ', 'Rabadon''s Deathcap', '라바돈의 죽음모자', 'Mũ Phù Thủy Rabadon')
      ON CONFLICT (key_id) DO NOTHING;
    `;
    await client.query(insertQuery);
    console.log('Dummy data inserted!');
    
  } catch (err) {
    console.error('Error executing query:', err.message);
  } finally {
    await client.end();
  }
}

run();
