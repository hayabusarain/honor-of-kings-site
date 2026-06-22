const fetch = require('node-fetch');

async function main() {
  const res = await fetch('https://ddragon.leagueoflegends.com/cdn/14.8.1/data/en_US/item.json');
  const data = await res.json();
  
  const map = {};
  for (const key of Object.keys(data.data)) {
    const item = data.data[key];
    // Create a simplified key for matching: alphanumeric only, lowercase
    const normalizedName = item.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    map[normalizedName] = item.image.full;
  }
  
  console.log("Kraken Slayer:", map['krakenslayer']);
  console.log("Randuins Omen:", map['randuinsomen']);
  console.log("Sundered Sky:", map['sunderedsky']);
}

main();
