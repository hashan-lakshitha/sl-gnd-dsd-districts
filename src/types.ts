/** A Sri Lankan district with trilingual names */
export interface District {
  id: number;
  nameEn: string;
  nameSi: string;
  nameTa: string;
  provinceEn: string;
  provinceSi: string;
  provinceTa: string;
}

/** A Divisional Secretariat Division (DSD) */
export interface DSD {
  fid: number;
  name: string;
  district: string;
  province: string;
}

/** A Grama Niladhari Division (GND) */
export interface GND {
  fid: number;
  name: string;
  district: string;
}

/** @internal Raw district record from districts data */
export interface DistrictRaw {
  id: number;
  name_en: string;
  name_si: string;
  name_ta: string;
  province_en: string;
  province_si: string;
  province_ta: string;
}

/** @internal Raw DSD record from DSD data */
export interface DSDRaw {
  FID: number;
  "DSD NAME": string;
  "DISTRICT NAME": string;
  PROVINCE: string;
}

/** @internal Raw GND record from GND data */
export interface GNDRaw {
  FID: number;
  "GND NAME": string;
  "DISTRICT NAME": string;
}
