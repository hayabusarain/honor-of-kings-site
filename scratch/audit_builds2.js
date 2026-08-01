const fs = require('fs');

const pathJa = 'public/data/skills/ja.json';
const pathEn = 'public/data/skills/en.json';

const dataJa = JSON.parse(fs.readFileSync(pathJa, 'utf-8'));
const dataEn = JSON.parse(fs.readFileSync(pathEn, 'utf-8'));

const itemPoolEn = {};
const itemPoolJa = {};
Object.values(dataEn).forEach(h => {
    if(h.meta && h.meta.recommended_items) {
        h.meta.recommended_items.forEach(i => itemPoolEn[i.id] = i);
    }
});
Object.values(dataJa).forEach(h => {
    if(h.meta && h.meta.recommended_items) {
        h.meta.recommended_items.forEach(i => itemPoolJa[i.id] = i);
    }
});

const findItem = (name) => {
    const found = Object.values(itemPoolEn).find(i => i.nameEn.toLowerCase().includes(name.toLowerCase()));
    return found ? found.id : null;
};

const templates = {
    Marksman: ["spark dagger", "endless blade", "shadow blade", "breaker", "blood edge", "Famous sword"],
    Mage: ["Reverberation", "Wise man's anger", "void staff", "Philosopher's Book", "mask of pain", "moonlight staff"],
    Fighter: ["shadow ax", "moonlight staff", "breaker", "endless blade", "witch's cloak", "Famous sword"],
    Tank: ["Crimson Cloak", "bad omen", "witch's cloak", "Conqueror's", "spike armor", "protection of the wise man"],
    Support: ["Shield", "witch's cloak", "bad omen", "frozen breath", "protection of the wise man", "Conqueror's"]
};

const mappedTemplates = {};
for (const [role, itemNames] of Object.entries(templates)) {
    mappedTemplates[role] = itemNames.map(name => findItem(name)).filter(id => id);
}

const hardcodedNames = {
    '537': 'Devara',
    '631': 'Florentino',
    '635': 'Lorion',
    '640': 'Annette'
};

const hardcodedRoles = {
    '537': 'Mage',
    '631': 'Fighter',
    '635': 'Mage',
    '640': 'Support'
};

const log = [];

for (const id in dataEn) {
    if (parseInt(id) >= 186 && parseInt(id) <= 640) {
        const heroEn = dataEn[id];
        const heroJa = dataJa[id];
        
        let heroRole = (heroEn.role || heroEn.class || '').toLowerCase();
        let heroName = heroEn.hero_name || hardcodedNames[id] || `Hero_${id}`;
        
        let buildTemplate = null;
        let templateType = '';
        
        if (hardcodedRoles[id]) {
            templateType = hardcodedRoles[id];
            buildTemplate = mappedTemplates[templateType];
        } else if (heroRole.includes('marksman') || heroRole.includes('shooter')) {
            buildTemplate = mappedTemplates.Marksman;
            templateType = 'Marksman';
        } else if (heroRole.includes('mage')) {
            buildTemplate = mappedTemplates.Mage;
            templateType = 'Mage';
        } else if (heroRole.includes('warrior') || heroRole.includes('assassin') || heroRole.includes('fighter')) {
            buildTemplate = mappedTemplates.Fighter;
            templateType = 'Fighter';
        } else if (heroRole.includes('tank')) {
            buildTemplate = mappedTemplates.Tank;
            templateType = 'Tank';
        } else if (heroRole.includes('support')) {
            buildTemplate = mappedTemplates.Support;
            templateType = 'Support';
        }

        if (buildTemplate && heroEn.meta && heroEn.meta.recommended_items) {
            let hasWrongItems = false;
            
            const itemIds = heroEn.meta.recommended_items.map(i => i.id);
            
            if (templateType === 'Mage' || templateType === 'Support') {
                if (itemIds.includes(findItem('endless blade')) || itemIds.includes(findItem('shadow ax')) || itemIds.includes(findItem('spark dagger')) || itemIds.includes(findItem('blood edge'))) {
                    hasWrongItems = true;
                }
            } else if (templateType === 'Marksman' || templateType === 'Fighter') {
                if (itemIds.includes(findItem('Reverberation')) || itemIds.includes(findItem('void staff')) || itemIds.includes(findItem("Wise man's anger"))) {
                    hasWrongItems = true;
                }
            }

            if (hasWrongItems || ['Devara', 'Florentino', 'Lorion', 'Annette'].includes(heroName)) {
                const newItemsEn = buildTemplate.map(iId => itemPoolEn[iId]).filter(x => x);
                const newItemsJa = buildTemplate.map(iId => itemPoolJa[iId]).filter(x => x);
                
                if (newItemsEn.length > 0) {
                    heroEn.meta.recommended_items = newItemsEn;
                    heroJa.meta.recommended_items = newItemsJa;
                    
                    // Prevent duplicate logs for Devara which was already processed
                    let existing = null;
                    try {
                         existing = require('./scratch/build_audit_group2.json');
                    } catch (e) {}
                    
                    log.push({
                        hero_id: id,
                        name: heroName,
                        role: templateType,
                        action: 'Updated recommended items'
                    });
                }
            }
        }
    }
}

fs.writeFileSync(pathEn, JSON.stringify(dataEn, null, 2));
fs.writeFileSync(pathJa, JSON.stringify(dataJa, null, 2));

if (!fs.existsSync('scratch')) {
    fs.mkdirSync('scratch');
}
fs.writeFileSync('scratch/build_audit_group2.json', JSON.stringify(log, null, 2));
console.log("Audit complete. Updated " + log.length + " heroes.");
