// ============================================================
// sl-gnd-dsd-districts
// Complete Sri Lanka Administrative Divisions Data Library
// Official Data from Ministry of Home Affairs (MOHA)
// ============================================================

import type { District, DSD, GND, ProvinceInfo } from "./types";
import { districts as rawDistricts } from "./data/districts";
import { dsds as rawDsds } from "./data/dsd";
import { gnds as rawGnds } from "./data/gnd";

// Re-export types for consumers
export type { District, DSD, GND, ProvinceInfo } from "./types";

// ============================================================
// Data Mapping & Exports (with backward compatibility aliases)
// ============================================================

/** All 25 districts of Sri Lanka (trilingual) */
export const districts: District[] = rawDistricts;

/** All 340 Divisional Secretariat Divisions (DSDs) (trilingual) */
export const dsds: DSD[] = rawDsds.map((d) => ({
  ...d,
  fid: d.id,
  name: d.nameEn,
  district: d.districtEn,
  province: d.provinceEn,
}));

/** All 14,020 Grama Niladhari Divisions (GNDs) (trilingual with official codes) */
export const gnds: GND[] = rawGnds.map((g) => ({
  ...g,
  fid: g.id,
  name: g.nameEn,
  district: g.districtEn,
}));

// ============================================================
// Province Info & Constants
// ============================================================

export const PROVINCES = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North-Western",
  "North-Central",
  "Uva",
  "Sabaragamuwa",
] as const;

export type Province = (typeof PROVINCES)[number];

export const provinces: ProvinceInfo[] = [
  { nameEn: "Western", nameSi: "බස්නාහිර", nameTa: "மேற்கு" },
  { nameEn: "Central", nameSi: "මධ්‍යම", nameTa: "மத்திய" },
  { nameEn: "Southern", nameSi: "දකුණ", nameTa: "தெற்கு" },
  { nameEn: "Northern", nameSi: "උතුර", nameTa: "வடக்கு" },
  { nameEn: "Eastern", nameSi: "නැගෙනහිර", nameTa: "கிழக்கு" },
  { nameEn: "North-Western", nameSi: "වයඹ", nameTa: "வடமேற்கு" },
  { nameEn: "North-Central", nameSi: "උතුරු මැද", nameTa: "வடமத்திய" },
  { nameEn: "Uva", nameSi: "ඌව", nameTa: "ஊவா" },
  { nameEn: "Sabaragamuwa", nameSi: "සබරගමුව", nameTa: "சப்ரகமுவ" },
];

/**
 * Get all 9 province names in English.
 * @returns Array of province name strings
 */
export function getProvinces(): readonly string[] {
  return PROVINCES;
}

/**
 * Get all 9 provinces with trilingual names (English, Sinhala, Tamil).
 * @returns Array of ProvinceInfo objects
 */
export function getProvincesInfo(): ProvinceInfo[] {
  return provinces;
}

// ============================================================
// District Helpers
// ============================================================

/**
 * Get all 25 districts.
 * @returns Array of District objects
 */
export function getDistricts(): District[] {
  return districts;
}

/**
 * Find a district by name (searches English, Sinhala, and Tamil).
 * Case-insensitive for English names.
 * @param name - District name in English, Sinhala, or Tamil
 * @returns Matching District or undefined
 */
export function getDistrictByName(name: string): District | undefined {
  const query = name.trim();
  const lower = query.toLowerCase();
  return districts.find(
    (d) =>
      d.nameEn.toLowerCase() === lower ||
      d.nameSi === query ||
      d.nameTa === query ||
      (query.length > 2 && (d.nameSi.includes(query) || query.includes(d.nameSi) || d.nameTa.includes(query) || query.includes(d.nameTa)))
  );
}

/**
 * Get all districts in a given province.
 * Case-insensitive matching for English, supports Sinhala & Tamil.
 * @param province - Province name (e.g. "Western", "බස්නාහිර", "மேற்கு")
 * @returns Array of District objects in that province
 */
export function getDistrictsByProvince(province: string): District[] {
  const query = province.trim();
  const lower = query.toLowerCase();
  return districts.filter(
    (d) =>
      d.provinceEn.toLowerCase() === lower ||
      d.provinceSi === query ||
      d.provinceTa === query
  );
}

/**
 * Search districts by partial name match (English, Sinhala, Tamil).
 * Case-insensitive for English.
 * @param query - Partial name to search
 * @returns Array of matching District objects
 */
export function searchDistricts(query: string): District[] {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();
  if (!trimmed) return [];
  return districts.filter(
    (d) =>
      d.nameEn.toLowerCase().includes(lower) ||
      d.nameSi.includes(trimmed) ||
      d.nameTa.includes(trimmed)
  );
}

// ============================================================
// DSD (Divisional Secretariat Division) Helpers
// ============================================================

/**
 * Get all Divisional Secretariat Divisions.
 * @returns Array of DSD objects
 */
export function getDSDs(): DSD[] {
  return dsds;
}

/**
 * Find a single DSD by name (supports English, Sinhala, Tamil).
 * Case-insensitive for English.
 * Optionally filter by district name.
 * @param name - DSD name
 * @param districtName - Optional district name to disambiguate
 * @returns Matching DSD or undefined
 */
export function getDSDByName(name: string, districtName?: string): DSD | undefined {
  const query = name.trim();
  const lower = query.toLowerCase();
  const distLower = districtName ? districtName.trim().toLowerCase() : undefined;

  return dsds.find((d) => {
    const matchName =
      d.nameEn.toLowerCase() === lower ||
      d.nameSi === query ||
      d.nameTa === query;

    if (!matchName) return false;
    if (!distLower) return true;

    return (
      d.districtEn.toLowerCase() === distLower ||
      d.districtSi === districtName ||
      d.districtTa === districtName
    );
  });
}

/**
 * Get all DSDs in a given district.
 * Supports English, Sinhala, and Tamil district names.
 * @param district - District name (e.g. "Colombo", "කොළඹ")
 * @returns Array of DSD objects in that district
 */
export function getDSDsByDistrict(district: string): DSD[] {
  const query = district.trim();
  const lower = query.toLowerCase();
  return dsds.filter(
    (d) =>
      d.districtEn.toLowerCase() === lower ||
      d.districtSi === query ||
      d.districtTa === query
  );
}

/**
 * Get all DSDs in a given province.
 * Supports English, Sinhala, and Tamil province names.
 * @param province - Province name (e.g. "Western", "බස්නාහිර")
 * @returns Array of DSD objects in that province
 */
export function getDSDsByProvince(province: string): DSD[] {
  const query = province.trim();
  const lower = query.toLowerCase();
  return dsds.filter(
    (d) =>
      d.provinceEn.toLowerCase() === lower ||
      d.provinceSi === query ||
      d.provinceTa === query
  );
}

/**
 * Search DSDs by partial name match (English, Sinhala, Tamil).
 * Case-insensitive for English.
 * @param query - Partial DSD name to search
 * @returns Array of matching DSD objects
 */
export function searchDSD(query: string): DSD[] {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();
  if (!trimmed) return [];
  return dsds.filter(
    (d) =>
      d.nameEn.toLowerCase().includes(lower) ||
      d.nameSi.includes(trimmed) ||
      d.nameTa.includes(trimmed)
  );
}

// ============================================================
// GND (Grama Niladhari Division) Helpers
// ============================================================

/**
 * Get all 14,020 Grama Niladhari Divisions.
 * @returns Array of GND objects
 */
export function getGNDs(): GND[] {
  return gnds;
}

/**
 * Find a GND by official LIFe Code (e.g. "1-1-03-005").
 * @param lifeCode - Exact LIFe code string
 * @returns Matching GND or undefined
 */
export function getGNDByLifeCode(lifeCode: string): GND | undefined {
  const clean = lifeCode.trim();
  return gnds.find((g) => g.lifeCode === clean);
}

/**
 * Find a GND by GN Code, LIFe Code, or MPA Code.
 * Optionally filter by DSD or District.
 * @param code - GN code (e.g. "005", "480A"), LIFe code, or MPA code
 * @param districtOrDSD - Optional district or DSD name to filter
 * @returns Matching GND or undefined
 */
export function getGNDByCode(code: string, districtOrDSD?: string): GND | undefined {
  const clean = code.trim().toLowerCase();
  const filter = districtOrDSD ? districtOrDSD.trim().toLowerCase() : undefined;

  return gnds.find((g) => {
    const matchCode =
      g.lifeCode.toLowerCase() === clean ||
      g.gnCode.toLowerCase() === clean ||
      (g.mpaCode && g.mpaCode.toLowerCase() === clean);

    if (!matchCode) return false;
    if (!filter) return true;

    return (
      g.districtEn.toLowerCase() === filter ||
      g.districtSi === districtOrDSD ||
      g.dsdEn.toLowerCase() === filter ||
      g.dsdSi === districtOrDSD
    );
  });
}

/**
 * Find a GND by exact name (English, Sinhala, or Tamil).
 * Optionally filter by DSD or District.
 * @param name - Exact GND name
 * @param districtOrDSD - Optional district or DSD name to filter
 * @returns Matching GND or undefined
 */
export function getGNDByName(name: string, districtOrDSD?: string): GND | undefined {
  const query = name.trim();
  const lower = query.toLowerCase();
  const filter = districtOrDSD ? districtOrDSD.trim().toLowerCase() : undefined;

  return gnds.find((g) => {
    const matchName =
      g.nameEn.toLowerCase() === lower ||
      g.nameSi === query ||
      g.nameTa === query;

    if (!matchName) return false;
    if (!filter) return true;

    return (
      g.districtEn.toLowerCase() === filter ||
      g.districtSi === districtOrDSD ||
      g.dsdEn.toLowerCase() === filter ||
      g.dsdSi === districtOrDSD
    );
  });
}

/**
 * Get all GNDs in a given district.
 * Supports English, Sinhala, and Tamil district names.
 * @param district - District name (e.g. "Colombo", "කොළඹ")
 * @returns Array of GND objects in that district
 */
export function getGNDsByDistrict(district: string): GND[] {
  const query = district.trim();
  const lower = query.toLowerCase();
  return gnds.filter(
    (g) =>
      g.districtEn.toLowerCase() === lower ||
      g.districtSi === query ||
      g.districtTa === query
  );
}

/**
 * Get all GNDs in a given Divisional Secretariat Division (DSD).
 * Supports English, Sinhala, and Tamil DSD names.
 * @param dsd - DSD name (e.g. "Kaduwela", "කඩුවෙල")
 * @param district - Optional district name to disambiguate
 * @returns Array of GND objects in that DSD
 */
export function getGNDsByDSD(dsd: string, district?: string): GND[] {
  const query = dsd.trim();
  const lower = query.toLowerCase();
  const distLower = district ? district.trim().toLowerCase() : undefined;

  return gnds.filter((g) => {
    const matchDSD =
      g.dsdEn.toLowerCase() === lower ||
      g.dsdSi === query ||
      g.dsdTa === query;

    if (!matchDSD) return false;
    if (!distLower) return true;

    return (
      g.districtEn.toLowerCase() === distLower ||
      g.districtSi === district ||
      g.districtTa === district
    );
  });
}

/**
 * Get all GNDs in a given province.
 * Supports English, Sinhala, and Tamil province names.
 * @param province - Province name (e.g. "Western", "බස්නාහිර")
 * @returns Array of GND objects in that province
 */
export function getGNDsByProvince(province: string): GND[] {
  const query = province.trim();
  const lower = query.toLowerCase();
  return gnds.filter(
    (g) =>
      g.provinceEn.toLowerCase() === lower ||
      g.provinceSi === query ||
      g.provinceTa === query
  );
}

/**
 * Search GNDs by partial name match (English, Sinhala, Tamil) or code.
 * Case-insensitive.
 * @param query - Partial GND name or code to search
 * @returns Array of matching GND objects
 */
export function searchGND(query: string): GND[] {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();
  if (!trimmed) return [];

  return gnds.filter(
    (g) =>
      g.nameEn.toLowerCase().includes(lower) ||
      g.nameSi.includes(trimmed) ||
      g.nameTa.includes(trimmed) ||
      g.gnCode.toLowerCase().includes(lower) ||
      g.lifeCode.toLowerCase().includes(lower) ||
      (g.mpaCode && g.mpaCode.toLowerCase().includes(lower))
  );
}

/**
 * Get GNDs grouped by district name.
 * @returns Record mapping district names to their GND arrays
 */
export function getGNDsGroupedByDistrict(): Record<string, GND[]> {
  const grouped: Record<string, GND[]> = {};
  for (const gnd of gnds) {
    if (!grouped[gnd.districtEn]) {
      grouped[gnd.districtEn] = [];
    }
    grouped[gnd.districtEn].push(gnd);
  }
  return grouped;
}

/**
 * Get GNDs grouped by DSD name (optionally within a specific district).
 * @param districtName - Optional district name to filter by
 * @returns Record mapping DSD names to their GND arrays
 */
export function getGNDsGroupedByDSD(districtName?: string): Record<string, GND[]> {
  const grouped: Record<string, GND[]> = {};
  const filter = districtName ? districtName.trim().toLowerCase() : undefined;

  for (const gnd of gnds) {
    if (
      filter &&
      gnd.districtEn.toLowerCase() !== filter &&
      gnd.districtSi !== districtName
    ) {
      continue;
    }

    const key = `${gnd.districtEn} - ${gnd.dsdEn}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(gnd);
  }
  return grouped;
}

// ============================================================
// Cross-Level Lookups & Statistics
// ============================================================

/**
 * Get full hierarchy: District info, its DSDs, and its GND count.
 * @param districtName - District name in English, Sinhala, or Tamil
 * @returns Object with district info, its DSDs, and GND count, or undefined
 */
export function getDistrictHierarchy(districtName: string):
  | {
      district: District;
      dsds: DSD[];
      gndCount: number;
    }
  | undefined {
  const district = getDistrictByName(districtName);
  if (!district) return undefined;

  const districtDSDs = getDSDsByDistrict(district.nameEn);
  const districtGNDs = getGNDsByDistrict(district.nameEn);

  return {
    district,
    dsds: districtDSDs,
    gndCount: districtGNDs.length,
  };
}

/**
 * Get DSD hierarchy: DSD info and all its GNDs.
 * @param dsdName - DSD name in English, Sinhala, or Tamil
 * @param districtName - Optional district name
 * @returns Object with DSD info and its GNDs array, or undefined
 */
export function getDSDHierarchy(dsdName: string, districtName?: string):
  | {
      dsd: DSD;
      gnds: GND[];
      gndCount: number;
    }
  | undefined {
  const dsd = getDSDByName(dsdName, districtName);
  if (!dsd) return undefined;

  const dsdGNDs = getGNDsByDSD(dsd.nameEn, dsd.districtEn);

  return {
    dsd,
    gnds: dsdGNDs,
    gndCount: dsdGNDs.length,
  };
}

/**
 * Get summary statistics of all administrative units in Sri Lanka.
 * @returns Object with counts of provinces, districts, DSDs, and GNDs
 */
export function getStats(): {
  provinces: number;
  districts: number;
  dsds: number;
  gnds: number;
} {
  return {
    provinces: PROVINCES.length,
    districts: districts.length,
    dsds: dsds.length,
    gnds: gnds.length,
  };
}
