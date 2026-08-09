# sl-gnd-dsd-districts

Complete Sri Lanka administrative divisions data with search and lookup utilities.

- 🏛️ **25 Districts** — Trilingual names (English, සිංහල, தமிழ்)
- 🗺️ **332 DSDs** — Divisional Secretariat Divisions
- 📍 **14,000+ GNDs** — Grama Niladhari Divisions
- 🔍 **Search & Filter** — Find by name, district, or province
- 📦 **TypeScript** — Full type definitions included
- ⚡ **Dual Format** — Works with ESM & CommonJS

## Installation

```bash
npm install sl-gnd-dsd-districts
```

## Quick Start

```typescript
import {
  getDistricts,
  getDSDsByDistrict,
  getGNDsByDistrict,
  searchGND,
  getDistrictByName,
  getStats,
} from "sl-gnd-dsd-districts";

// Get all districts
const allDistricts = getDistricts();
console.log(allDistricts.length); // 25

// Find a district (supports Sinhala & Tamil too!)
const colombo = getDistrictByName("Colombo");
console.log(colombo?.nameSi); // "කොළඹ"
console.log(colombo?.nameTa); // "கொழும்பு"

// Get DSDs in a district
const colomboDSDs = getDSDsByDistrict("Colombo");
console.log(colomboDSDs.length); // 13

// Get GNDs in a district
const colomboGNDs = getGNDsByDistrict("Colombo");
console.log(colomboGNDs.length); // 500+

// Search GNDs by name
const results = searchGND("Malabe");
console.log(results);
// [
//   { fid: 94, name: "Malabe North", district: "Colombo" },
//   { fid: 105, name: "Malabe East", district: "Colombo" },
//   { fid: 106, name: "Malabe West", district: "Colombo" }
// ]

// Overall stats
console.log(getStats());
// { provinces: 9, districts: 25, dsds: 332, gnds: 14022 }
```

## API Reference

### Raw Data

| Export | Type | Description |
|--------|------|-------------|
| `districts` | `District[]` | All 25 districts |
| `dsds` | `DSD[]` | All DSDs |
| `gnds` | `GND[]` | All GNDs |
| `PROVINCES` | `readonly string[]` | 9 province names |

### District Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getDistricts()` | `District[]` | All 25 districts |
| `getDistrictByName(name)` | `District \| undefined` | Find by name (EN/SI/TA) |
| `getDistrictsByProvince(province)` | `District[]` | Filter by province |
| `searchDistricts(query)` | `District[]` | Partial name search |

### DSD Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getDSDs()` | `DSD[]` | All DSDs |
| `getDSDsByDistrict(district)` | `DSD[]` | Filter by district |
| `getDSDsByProvince(province)` | `DSD[]` | Filter by province |
| `getDSDByName(name)` | `DSD \| undefined` | Find by exact name |
| `searchDSD(query)` | `DSD[]` | Partial name search |

### GND Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getGNDs()` | `GND[]` | All GNDs |
| `getGNDsByDistrict(district)` | `GND[]` | Filter by district |
| `getGNDByName(name)` | `GND \| undefined` | Find by exact name |
| `searchGND(query)` | `GND[]` | Partial name search |
| `getGNDsGroupedByDistrict()` | `Record<string, GND[]>` | Grouped by district |

### Cross-Level Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getDistrictHierarchy(name)` | `{ district, dsds, gndCount }` | Full hierarchy lookup |
| `getStats()` | `{ provinces, districts, dsds, gnds }` | Summary counts |
| `getProvinces()` | `readonly string[]` | All 9 province names |

## Types

```typescript
interface District {
  id: number;
  nameEn: string;    // "Colombo"
  nameSi: string;    // "කොළඹ"
  nameTa: string;    // "கொழும்பு"
  provinceEn: string; // "Western"
  provinceSi: string; // "බස්නාහිර"
  provinceTa: string; // "மேல்"
}

interface DSD {
  fid: number;
  name: string;      // "Kaduwela"
  district: string;  // "Colombo"
  province: string;  // "Western"
}

interface GND {
  fid: number;
  name: string;      // "Malabe North"
  district: string;  // "Colombo"
}
```

## CommonJS Usage

```javascript
const { getDistricts, searchGND } = require("sl-gnd-dsd-districts");

const districts = getDistricts();
const results = searchGND("Kandy");
```

## License

MIT
