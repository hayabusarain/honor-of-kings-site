const fs = require('fs');
const jaDDragon = JSON.parse(fs.readFileSync('C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\runesReforged_ja.json', 'utf8'));
const enDDragon = JSON.parse(fs.readFileSync('C:\\Users\\81901\\.gemini\\antigravity\\brain\\b480f433-46b1-471d-8680-a277fd5851f3\\runesReforged_en.json', 'utf8'));

const targets = ['Unflinching', 'Unshakeable', 'Hubris', 'Tyrant', 'Chain', 'Future'];

console.log("Searching English DDragon:");
enDDragon.forEach(style => {
  style.slots.forEach(slot => {
    slot.runes.forEach(rune => {
      const match = targets.filter(t => rune.name.toLowerCase().includes(t.toLowerCase()));
      if (match.length > 0) {
        console.log(`Found: ${rune.name} (${rune.key}, id: ${rune.id}, icon: ${rune.icon})`);
      }
    });
  });
});
