const fs = require('fs');
const path = require('path');

const gndRaw = require('../src/data/raw/moha_gnd_full.json');
const dsdRaw = require('../src/data/raw/moha_dsd_full.json');

function cleanString(str) {
  if (!str) return '';
  return str
    .replace(/[\u200B\u200E\u200F\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// 1. Process Districts
const districtMap = new Map();
let distId = 1;

for (const d of dsdRaw) {
  const nameEn = cleanString(d.districtEn);
  if (!districtMap.has(nameEn)) {
    districtMap.set(nameEn, {
      id: distId++,
      nameEn: nameEn,
      nameSi: cleanString(d.districtSi),
      nameTa: cleanString(d.districtTa),
      provinceEn: cleanString(d.provinceEn),
      provinceSi: cleanString(d.provinceSi),
      provinceTa: cleanString(d.provinceTa)
    });
  }
}

const districts = Array.from(districtMap.values()).sort((a, b) => a.id - b.id);

// 2. Process DSDs
const dsdList = [];
let dsdId = 1;
for (const d of dsdRaw) {
  dsdList.push({
    id: dsdId++,
    nameEn: cleanString(d.nameEn),
    nameSi: cleanString(d.nameSi),
    nameTa: cleanString(d.nameTa),
    districtEn: cleanString(d.districtEn),
    districtSi: cleanString(d.districtSi),
    districtTa: cleanString(d.districtTa),
    provinceEn: cleanString(d.provinceEn),
    provinceSi: cleanString(d.provinceSi),
    provinceTa: cleanString(d.provinceTa)
  });
}

// 3. Process GNDs
const gndList = [];
let gndId = 1;
for (const g of gndRaw) {
  gndList.push({
    id: gndId++,
    lifeCode: cleanString(g.lifeCode),
    gnCode: cleanString(g.gnCode),
    mpaCode: g.mpaCode ? cleanString(g.mpaCode) : '',
    nameEn: cleanString(g.nameEn),
    nameSi: cleanString(g.nameSi),
    nameTa: cleanString(g.nameTa),
    dsdEn: cleanString(g.dsdEn),
    dsdSi: cleanString(g.dsdSi),
    dsdTa: cleanString(g.dsdTa),
    districtEn: cleanString(g.districtEn),
    districtSi: cleanString(g.districtSi),
    districtTa: cleanString(g.districtTa),
    provinceEn: cleanString(g.provinceEn),
    provinceSi: cleanString(g.provinceSi),
    provinceTa: cleanString(g.provinceTa)
  });
}

console.log(`Summary:`);
console.log(`- Districts: ${districts.length}`);
console.log(`- DSDs: ${dsdList.length}`);
console.log(`- GNDs: ${gndList.length}`);

// Write src/data/districts.ts
const districtsCode = `import type { District } from "../types";

export const districts: District[] = ${JSON.stringify(districts, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, '../src/data/districts.ts'), districtsCode, 'utf8');

// Write src/data/dsd.ts
const dsdCode = `import type { DSD } from "../types";

export const dsds: DSD[] = ${JSON.stringify(dsdList, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, '../src/data/dsd.ts'), dsdCode, 'utf8');

// Write src/data/gnd.ts
// Format compactly for GNDs to keep bundle size efficient
const gndCode = `import type { GND } from "../types";

export const gnds: GND[] = ${JSON.stringify(gndList)};
`;
fs.writeFileSync(path.join(__dirname, '../src/data/gnd.ts'), gndCode, 'utf8');

console.log('Successfully generated src/data/ files!');
