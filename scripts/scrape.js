const fs = require('fs');
const path = require('path');

const PROVINCES = [
  { id: 63, name: 'Western' },
  { id: 64, name: 'Central' },
  { id: 65, name: 'Southern' },
  { id: 66, name: 'Northern' },
  { id: 67, name: 'Eastern' },
  { id: 68, name: 'North-Western' },
  { id: 69, name: 'North-Central' },
  { id: 70, name: 'Uva' },
  { id: 71, name: 'Sabaragamuwa' }
];

function cleanText(txt) {
  if (!txt) return '';
  return txt
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSlashNames(str) {
  // e.g. "1: බස්නාහිර/ மேற்கு/ Western" or "1: කොළඹ/ கொழும்பு/ Colombo" or "3: කොළඹ/ கொழும்பு/ Colombo"
  const clean = cleanText(str);
  // remove leading number prefix if present like "1: " or "01: "
  const stripped = clean.replace(/^\d+\s*:\s*/, '');
  const parts = stripped.split('/').map(s => s.trim());
  return {
    raw: clean,
    si: parts[0] || '',
    ta: parts[1] || '',
    en: parts[2] || parts[0] || ''
  };
}

async function scrapeAll() {
  console.log('Starting full data scraping from MOHA...');

  const allDistricts = [];
  for (const p of PROVINCES) {
    const form = new URLSearchParams();
    form.append('action', 'province');
    form.append('query', p.id.toString());
    const res = await fetch('http://moha.gov.lk:8090/lifecode/views/fetch.php', {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    const regex = /<option value="(\d+)">(\d+):\s*([^<]+)<\/option>/g;
    let match;
    while ((match = regex.exec(data.output)) !== null) {
      allDistricts.push({
        provinceId: p.id,
        provinceName: p.name,
        districtId: parseInt(match[1]),
        districtOrder: parseInt(match[2]),
        districtName: match[3].trim()
      });
    }
  }

  console.log(`Found ${allDistricts.length} districts across 9 provinces.`);

  const allGNDs = [];
  const dsdMap = new Map(); // key: DSD nameEn or DSD code
  let totalRows = 0;

  for (const dist of allDistricts) {
    console.log(`Fetching district ${dist.districtName} (ID: ${dist.districtId}, Province: ${dist.provinceName})...`);
    const form = new URLSearchParams();
    form.append('province', dist.provinceId.toString());
    form.append('district', dist.districtId.toString());

    let html = '';
    let retries = 3;
    while (retries > 0) {
      try {
        const res = await fetch('http://moha.gov.lk:8090/lifecode/views/rpt_gn_list.php', {
          method: 'POST',
          body: form
        });
        html = await res.text();
        break;
      } catch (err) {
        retries--;
        console.warn(`Retry fetching district ${dist.districtName} (${retries} left)...`);
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    // Parse table rows
    // <tr>
    // <td><b>LIFe Code</b></td>
    // <td><b>GN Code</b></td>
    // <td>Name in Sinhala</td>
    // <td>Name in Tamil</td>
    // <td>Name in English</td>
    // <td>MPA Code</td>
    // <td>Province</td>
    // <td>District</td>
    // <td>Divisional Secretariat</td>
    // </tr>

    const trRegex = /<tr>([\s\S]*?)<\/tr>/g;
    let trMatch;
    let districtCount = 0;

    while ((trMatch = trRegex.exec(html)) !== null) {
      const rowContent = trMatch[1];
      if (rowContent.includes('<th>')) continue; // skip header

      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
      const tds = [];
      let tdMatch;
      while ((tdMatch = tdRegex.exec(rowContent)) !== null) {
        tds.push(cleanText(tdMatch[1]));
      }

      if (tds.length >= 9) {
        const lifeCode = tds[0];
        const gnCode = tds[1];
        const nameSi = tds[2];
        const nameTa = tds[3];
        const nameEn = tds[4];
        const mpaCode = tds[5];
        const provinceParsed = parseSlashNames(tds[6]);
        const districtParsed = parseSlashNames(tds[7]);
        const dsdParsed = parseSlashNames(tds[8]);

        // DSD key
        const dsdKey = `${districtParsed.en}__${dsdParsed.en}`;
        if (!dsdMap.has(dsdKey)) {
          dsdMap.set(dsdKey, {
            nameEn: dsdParsed.en,
            nameSi: dsdParsed.si,
            nameTa: dsdParsed.ta,
            districtEn: districtParsed.en,
            districtSi: districtParsed.si,
            districtTa: districtParsed.ta,
            provinceEn: provinceParsed.en,
            provinceSi: provinceParsed.si,
            provinceTa: provinceParsed.ta
          });
        }

        allGNDs.push({
          lifeCode,
          gnCode,
          nameEn,
          nameSi,
          nameTa,
          mpaCode: mpaCode || null,
          dsdEn: dsdParsed.en,
          dsdSi: dsdParsed.si,
          dsdTa: dsdParsed.ta,
          districtEn: districtParsed.en,
          districtSi: districtParsed.si,
          districtTa: districtParsed.ta,
          provinceEn: provinceParsed.en,
          provinceSi: provinceParsed.si,
          provinceTa: provinceParsed.ta
        });

        districtCount++;
        totalRows++;
      }
    }
    console.log(`  -> Scraped ${districtCount} GNDs for ${dist.districtName}`);
  }

  console.log(`\nScraping complete!`);
  console.log(`Total GNDs: ${allGNDs.length}`);
  console.log(`Total Unique DSDs: ${dsdMap.size}`);

  const outputDir = path.join(__dirname, '../src/data/raw');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'moha_gnd_full.json'),
    JSON.stringify(allGNDs, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, 'moha_dsd_full.json'),
    JSON.stringify(Array.from(dsdMap.values()), null, 2)
  );

  console.log('Saved raw JSON files to src/data/raw/');
}

scrapeAll().catch(console.error);
