const html = \<a href=\"/honorofkings/Daji\" title=\"Daji\"><img alt=\"Daji\" src=\"/commons/images/thumb/3/39/Daji_Hero_Icon.png/180px-Daji_Hero_Icon.png\" decoding=\"async\" width=\"120\" height=\"120\" srcset=\"/commons/images/thumb/3/39/Daji_Hero_Icon.png/270px-Daji_Hero_Icon.png 1.5x, /commons/images/thumb/3/39/Daji_Hero_Icon.png/360px-Daji_Hero_Icon.png 2x\" /></a></div></div>
<div class=\"gallerytext\"><a href=\"/honorofkings/Daji\" title=\"Daji\">Daji</a></div>\;

const regex = /<a href=\"\/honorofkings\/([^\"]+)\"[^>]*title=\"[^\"]+\"[^>]*>.*?<img[^>]+src=\"([^\"]+)\"/gs;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log('Matched name:', match[1], 'URL:', match[2]);
}
