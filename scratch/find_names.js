const fs = require('fs');
const html = fs.readFileSync('c:/Users/81901/Desktop/HOK CAMP.html', 'utf8');

const regex = /<div class=\"hero-intro-name\">([^<]+)<\/div>/g;
let match;
const names = new Set();
while ((match = regex.exec(html)) !== null) {
  names.add(match[1].trim());
}

const allNames = Array.from(names);
console.log(allNames.filter(n => n.includes('達磨') || n.includes('鐘馗') || n.includes('裴擒虎') || n.includes('狂鉄') || n.includes('蒙?') || n.includes('タイガー') || n.includes('バイロン') || n.includes('モンヤ') || n.includes('達') || n.includes('馗') || n.includes('虎') || n.includes('鉄') || n.includes('?') || n.includes('ヤ') || n.includes('ラプ')));
