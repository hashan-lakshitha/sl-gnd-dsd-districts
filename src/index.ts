// ============================================================
// sl-gnd-dsd-districts
// Complete Sri Lanka Administrative Divisions Data Library
// ============================================================

import type { District, DSD, GND } from "./types";
import { districtsRaw } from "./data/districts";
import { dsdsRaw } from "./data/dsd";
import { gndsRaw } from "./data/gnd";

// Re-export types for consumers
export type { District, DSD, GND } from "./types";

// ============================================================
// Data Mapping — Convert raw keys to clean camelCase once
// ============================================================

/** All 25 districts of Sri Lanka (trilingual) */
export const districts: District[] = districtsRaw.map((d) => ({
  id: d.id,
  nameEn: d.name_en,
  nameSi: d.name_si,
  nameTa: d.name_ta,
  provinceEn: d.province_en,
  provinceSi: d.province_si,
  provinceTa: d.province_ta,
}));

/** All Divisional Secretariat Divisions (DSDs) */
export const dsds: DSD[] = dsdsRaw.map((d) => ({
  fid: d.FID,
  name: d["DSD NAME"],
  district: d["DISTRICT NAME"],
  province: d.PROVINCE,
}));

/** All Grama Niladhari Divisions (GNDs) */
export const gnds: GND[] = gndsRaw.map((g) => ({
  fid: g.FID,
  name: g["GND NAME"],
  district: g["DISTRICT NAME"],
}));

// ============================================================
// Province Helpers
// ============================================================

/** All 9 provinces of Sri Lanka */
export const PROVINCES = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
] as const;

export type Province = (typeof PROVINCES)[number];

/**
 * Get all 9 province names.
 * @returns Array of province name strings
 */
export function getProvinces(): readonly string[] {
  return PROVINCES;
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
 * @param name - District name in any language
 * @returns Matching District or undefined
 */
export function getDistrictByName(name: string): District | undefined {
  const lower = name.toLowerCase();
  return districts.find(
    (d) =>
      d.nameEn.toLowerCase() === lower ||
      d.nameSi === name ||
      d.nameTa === name
  );
}

/**
 * Get all districts in a given province.
 * Case-insensitive matching.
 * @param province - Province name (e.g. "Western", "Central")
 * @returns Array of District objects in that province
 */
export function getDistrictsByProvince(province: string): District[] {
  const lower = province.toLowerCase();
  return districts.filter(
    (d) =>
      d.provinceEn.toLowerCase() === lower ||
      d.provinceSi === province ||
      d.provinceTa === province
  );
}

/**
 * Search districts by partial name match (English, Sinhala, Tamil).
 * Case-insensitive for English.
 * @param query - Partial name to search
 * @returns Array of matching District objects
 */
export function searchDistricts(query: string): District[] {
  const lower = query.toLowerCase();
  return districts.filter(
    (d) =>
      d.nameEn.toLowerCase().includes(lower) ||
      d.nameSi.includes(query) ||
      d.nameTa.includes(query)
  );
}

// ============================================================
// DSD Helpers
// ============================================================

/**
 * Get all Divisional Secretariat Divisions.
 * @returns Array of DSD objects
 */
export function getDSDs(): DSD[] {
  return dsds;
}

/**
 * Get all DSDs in a given district.
 * Case-insensitive matching.
 * @param district - District name (e.g. "Colombo")
 * @returns Array of DSD objects in that district
 */
export function getDSDsByDistrict(district: string): DSD[] {
  const lower = district.toLowerCase();
  return dsds.filter((d) => d.district.toLowerCase() === lower);
}

/**
 * Get all DSDs in a given province.
 * Case-insensitive matching.
 * @param province - Province name (e.g. "Western")
 * @returns Array of DSD objects in that province
 */
export function getDSDsByProvince(province: string): DSD[] {
  const lower = province.toLowerCase();
  return dsds.filter((d) => d.province.toLowerCase() === lower);
}

/**
 * Search DSDs by partial name match.
 * Case-insensitive.
 * @param query - Partial DSD name to search
 * @returns Array of matching DSD objects
 */
export function searchDSD(query: string): DSD[] {
  const lower = query.toLowerCase();
  return dsds.filter((d) => d.name.toLowerCase().includes(lower));
}

/**
 * Find a single DSD by exact name.
 * Case-insensitive.
 * @param name - Exact DSD name
 * @returns Matching DSD or undefined
 */
export function getDSDByName(name: string): DSD | undefined {
  const lower = name.toLowerCase();
  return dsds.find((d) => d.name.toLowerCase() === lower);
}

// ============================================================
// GND Helpers
// ============================================================

/**
 * Get all Grama Niladhari Divisions.
 * @returns Array of GND objects
 */
export function getGNDs(): GND[] {
  return gnds;
}

/**
 * Get all GNDs in a given district.
 * Case-insensitive matching.
 * @param district - District name (e.g. "Colombo")
 * @returns Array of GND objects in that district
 */
export function getGNDsByDistrict(district: string): GND[] {
  const lower = district.toLowerCase();
  return gnds.filter((g) => g.district.toLowerCase() === lower);
}

/**
 * Search GNDs by partial name match.
 * Case-insensitive.
 * @param query - Partial GND name to search
 * @returns Array of matching GND objects
 */
export function searchGND(query: string): GND[] {
  const lower = query.toLowerCase();
  return gnds.filter((g) => g.name.toLowerCase().includes(lower));
}

/**
 * Find a single GND by exact name.
 * Case-insensitive.
 * @param name - Exact GND name
 * @returns Matching GND or undefined
 */
export function getGNDByName(name: string): GND | undefined {
  const lower = name.toLowerCase();
  return gnds.find((g) => g.name.toLowerCase() === lower);
}

/**
 * Get GNDs by district, grouped by district name.
 * @returns Record mapping district names to their GND arrays
 */
export function getGNDsGroupedByDistrict(): Record<string, GND[]> {
  const grouped: Record<string, GND[]> = {};
  for (const gnd of gnds) {
    if (!grouped[gnd.district]) {
      grouped[gnd.district] = [];
    }
    grouped[gnd.district].push(gnd);
  }
  return grouped;
}

// ============================================================
// Cross-Level Lookups
// ============================================================

/**
 * Get full hierarchy: Province → District → DSDs for a given district.
 * @param districtName - District name (English)
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
  const gndCount = getGNDsByDistrict(district.nameEn).length;

  return {
    district,
    dsds: districtDSDs,
    gndCount,
  };
}

/**
 * Get summary statistics.
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
