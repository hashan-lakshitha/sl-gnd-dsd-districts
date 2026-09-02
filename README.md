# sl-gnd-dsd-districts

Complete, official Sri Lanka administrative divisions data library sourced from the **Ministry of Home Affairs (MOHA)**.

- 🏛️ **25 Districts** — Trilingual names (English, සිංහල, தமிழ்)
- 🗺️ **340 DSDs** — Divisional Secretariat Divisions (Trilingual)
- 📍 **14,020 GNDs** — Grama Niladhari Divisions (Trilingual)
- 🏷️ **Official Codes** — LIFe Code, GN Code & MPA Code
- 🔗 **Full Hierarchy** — Province → District → DSD → GND
- 🔍 **Search & Filter** — Fast search by trilingual name, code, DSD, district, or province
- 📦 **TypeScript Ready** — Comprehensive type definitions included
- ⚡ **Dual Format** — Works with ESM (`import`) & CommonJS (`require`)

---

## Installation

```bash
npm install sl-gnd-dsd-districts
```

---

## Quick Start

```typescript
import {
  getDistricts,
  getDistrictByName,
  getDSDsByDistrict,
  getGNDsByDSD,
  getGNDByLifeCode,
  getGNDByCode,
  searchGND,
  getDSDHierarchy,
  getStats,
} from "sl-gnd-dsd-districts";

// Overall stats
console.log(getStats());
// { provinces: 9, districts: 25, dsds: 340, gnds: 14020 }

// 1. Districts (Trilingual)
const colombo = getDistrictByName("Colombo"); // or getDistrictByName("කොළඹ")
console.log(colombo?.nameSi); // "කොළඹ"
console.log(colombo?.nameTa); // "கொழும்பு"

// 2. DSDs in a district
const colomboDSDs = getDSDsByDistrict("Colombo");
console.log(colomboDSDs.length); // 13

// 3. GNDs in a DSD
const kaduwelaGNDs = getGNDsByDSD("Kaduwela");
console.log(kaduwelaGNDs.length); // 57

// 4. Lookup GND by official codes
const gndByLife = getGNDByLifeCode("1-1-03-005");
console.log(gndByLife?.nameEn); // "Sammanthranapura"
console.log(gndByLife?.nameSi); // "සම්මන්ත්‍රණපුර"

// Lookup by GN Code or MPA Code
const gndByMpa = getGNDByCode("480A");
console.log(gndByMpa?.nameEn); // "Dedigamuwa"

// 5. Search GNDs by partial name or code (English / Sinhala / Tamil)
const results = searchGND("Malabe");
console.log(results);
// [
//   { lifeCode: "1-1-09-070", gnCode: "070", nameEn: "Malabe North", nameSi: "මාළ‍‍ෙඔ උතුර", dsdEn: "Kaduwela", districtEn: "Colombo" },
//   { lifeCode: "1-1-09-125", gnCode: "125", nameEn: "Malabe East", nameSi: "මාලබේ නැගෙනහිර", dsdEn: "Kaduwela", districtEn: "Colombo" },
//   { lifeCode: "1-1-09-130", gnCode: "130", nameEn: "Malabe West", nameSi: "මාල‍බේ බටහිර", dsdEn: "Kaduwela", districtEn: "Colombo" }
// ]

// 6. Full DSD Hierarchy
const kaduwelaHierarchy = getDSDHierarchy("Kaduwela");
console.log(kaduwelaHierarchy?.gndCount); // 57
```

---

## API Reference

### Raw Data Exports

| Export | Type | Description |
|--------|------|-------------|
| `districts` | `District[]` | All 25 districts with trilingual names |
| `dsds` | `DSD[]` | All 340 DSDs with trilingual names and parent relationships |
| `gnds` | `GND[]` | All 14,020 GNDs with trilingual names, codes, DSD and district mapping |
| `provinces` | `ProvinceInfo[]` | All 9 provinces with trilingual names |
| `PROVINCES` | `readonly string[]` | 9 province names in English |

---

### District Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getDistricts()` | `District[]` | All 25 districts |
| `getDistrictByName(name)` | `District \| undefined` | Find by name (EN / SI / TA) |
| `getDistrictsByProvince(province)` | `District[]` | Filter districts by province |
| `searchDistricts(query)` | `District[]` | Partial name search (EN / SI / TA) |

---

### DSD (Divisional Secretariat Division) Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getDSDs()` | `DSD[]` | All 340 DSDs |
| `getDSDByName(name, districtName?)` | `DSD \| undefined` | Find by exact name (EN / SI / TA) |
| `getDSDsByDistrict(district)` | `DSD[]` | Filter DSDs by district (EN / SI / TA) |
| `getDSDsByProvince(province)` | `DSD[]` | Filter DSDs by province (EN / SI / TA) |
| `searchDSD(query)` | `DSD[]` | Partial name search (EN / SI / TA) |

---

### GND (Grama Niladhari Division) Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getGNDs()` | `GND[]` | All 14,020 GNDs |
| `getGNDByName(name, districtOrDSD?)` | `GND \| undefined` | Find by exact name (EN / SI / TA) |
| `getGNDByLifeCode(lifeCode)` | `GND \| undefined` | Find by official LIFe Code (e.g. `1-1-03-005`) |
| `getGNDByCode(code, districtOrDSD?)` | `GND \| undefined` | Find by GN Code, LIFe Code, or MPA Code |
| `getGNDsByDSD(dsd, district?)` | `GND[]` | Filter GNDs by DSD (EN / SI / TA) |
| `getGNDsByDistrict(district)` | `GND[]` | Filter GNDs by district (EN / SI / TA) |
| `getGNDsByProvince(province)` | `GND[]` | Filter GNDs by province (EN / SI / TA) |
| `searchGND(query)` | `GND[]` | Partial search across EN / SI / TA names & codes |
| `getGNDsGroupedByDistrict()` | `Record<string, GND[]>` | GNDs grouped by district |
| `getGNDsGroupedByDSD(districtName?)` | `Record<string, GND[]>` | GNDs grouped by DSD |

---

### Hierarchy & Stats Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getDistrictHierarchy(name)` | `{ district, dsds, gndCount } \| undefined` | Full district hierarchy lookup |
| `getDSDHierarchy(dsdName, districtName?)` | `{ dsd, gnds, gndCount } \| undefined` | Full DSD hierarchy lookup with all GNDs |
| `getProvinces()` | `readonly string[]` | All 9 province names in English |
| `getProvincesInfo()` | `ProvinceInfo[]` | All 9 provinces with trilingual names |
| `getStats()` | `{ provinces, districts, dsds, gnds }` | Summary counts (9, 25, 340, 14020) |

---

## TypeScript Interfaces

```typescript
interface District {
  id: number;
  nameEn: string;      // "Colombo"
  nameSi: string;      // "කොළඹ"
  nameTa: string;      // "கொழும்பு"
  provinceEn: string;  // "Western"
  provinceSi: string;  // "බස්නාහිර"
  provinceTa: string;  // "மேற்கு"
}

interface DSD {
  id: number;
  nameEn: string;      // "Kaduwela"
  nameSi: string;      // "කඩුවෙල"
  nameTa: string;      // "கடுவெ‍லை"
  districtEn: string;  // "Colombo"
  districtSi: string;  // "කොළඹ"
  districtTa: string;  // "கொழும்பு"
  provinceEn: string;  // "Western"
  provinceSi: string;  // "බස්නාහිර"
  provinceTa: string;  // "மேற்கு"
}

interface GND {
  id: number;
  lifeCode: string;    // "1-1-09-070" (Official LIFe Code)
  gnCode: string;      // "070" (GN Division Number)
  mpaCode?: string;    // "476B" (Ministry of Public Administration Code)
  nameEn: string;      // "Malabe North"
  nameSi: string;      // "මාළ‍‍ෙඔ උතුර"
  nameTa: string;      // "மால‍பே வடக்கு"
  dsdEn: string;       // "Kaduwela"
  dsdSi: string;       // "කඩුවෙල"
  dsdTa: string;       // "கடுவெ‍லை"
  districtEn: string;  // "Colombo"
  districtSi: string;  // "කොළඹ"
  districtTa: string;  // "கொழும்பு"
  provinceEn: string;  // "Western"
  provinceSi: string;  // "බස්නාහිර"
  provinceTa: string;  // "மேற்கு"
}
```

---

## CommonJS Usage

```javascript
const { getDistricts, getGNDsByDSD, searchGND } = require("sl-gnd-dsd-districts");

const districts = getDistricts();
const kaduwelaGNDs = getGNDsByDSD("Kaduwela");
const results = searchGND("Kandy");
```

---

## Data Source

Data is sourced from the official **Ministry of Home Affairs (MOHA)** Sri Lanka Life Code Database (`http://moha.gov.lk:8090/lifecode/gn_list`).

---

## License

MIT © [Hashan Lakshitha](https://github.com/hashan-lakshitha)
