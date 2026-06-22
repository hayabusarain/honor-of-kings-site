async function scrape() {
  const r = await fetch('https://pvp.qq.com/web201605/herodetail/105.shtml');
  const b = await r.arrayBuffer();
  const html = new TextDecoder('gbk').decode(b);
  
  const skillNames = [...html.matchAll(/<p class=\"skill-name\"><b>(.*?)<\/b>/g)].map(m => m[1]);
  const skillDescs = [...html.matchAll(/<p class=\"skill-desc\">(.*?)<\/p>/g)].map(m => m[1]);
  
  console.log("Names:", skillNames);
  console.log("Descriptions:", skillDescs.map(d => d.substring(0, 50) + "..."));
}

scrape().catch(console.error);
