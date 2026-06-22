import fetch from 'node-fetch';

async function run() {
  try {
    const res = await fetch('https://ddragon.leagueoflegends.com/cdn/14.10.1/data/ja_JP/champion.json');
    const data = await res.json();
    const keys = Object.keys(data.data);
    const kaisaKey = keys.find(k => k.toLowerCase() === 'kaisa');
    console.log('Kai\'Sa key in DDragon:', kaisaKey);
  } catch (e) {
    console.error(e);
  }
}
run();
