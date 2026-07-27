const fs = require('fs');

const mappedItems = JSON.parse(fs.readFileSync('./src/data/hok_items.json', 'utf8'));
const cnItems = JSON.parse(fs.readFileSync('./scratch/cn_items.json', 'utf8'));

let mismatchCount = 0;
let checkedCount = 0;

console.log("=== Mapping Verification ===");

mappedItems.forEach(item => {
  const cnItem = cnItems.find(c => c.item_id === item.id);
  
  if (!cnItem) {
    console.log(`[ERROR] Mapped item ID ${item.id} (${item.name}) not found in Chinese API data!`);
    mismatchCount++;
    return;
  }
  
  // Verify prices match
  if (parseInt(item.totalPrice) !== parseInt(cnItem.total_price)) {
    console.log(`[MISMATCH] Price mismatch for ${item.name} (CN: ${cnItem.item_name}): JA price ${item.totalPrice} vs CN price ${cnItem.total_price}`);
    mismatchCount++;
  }
  
  checkedCount++;
});

console.log(`\nChecked ${checkedCount} items.`);
console.log(`Found ${mismatchCount} mismatches.`);

// Print a few random samples for manual inspection
console.log("\n=== Random Samples ===");
const samples = [0, 20, 50, 80, 105];
samples.forEach(i => {
  if (mappedItems[i]) {
    const item = mappedItems[i];
    const cnItem = cnItems.find(c => c.item_id === item.id);
    console.log(`JA: ${item.name} (${item.price}G)  |  CN: ${cnItem ? cnItem.item_name : 'N/A'} (${cnItem ? cnItem.total_price : 'N/A'}G)`);
  }
});
