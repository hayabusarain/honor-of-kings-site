fetch('https://liquipedia.net/honorofkings/Butterfly').then(r=>r.text()).then(t=>console.log(t.match(/src=\"([^\"]+Butterfly[^\"]*\.png)\"/i))).catch(console.error);
