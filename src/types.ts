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

/** A Divisional Secretariat Division (DSD) with trilingual names */
export interface DSD {
  id: number;
  nameEn: string;
  nameSi: string;
  nameTa: string;
  districtEn: string;
  districtSi: string;
  districtTa: string;
  provinceEn: string;
  provinceSi: string;
  provinceTa: string;
  /** @deprecated Alias for nameEn */
  name?: string;
  /** @deprecated Alias for districtEn */
  district?: string;
  /** @deprecated Alias for provinceEn */
  province?: string;
  /** @deprecated Alias for id */
  fid?: number;
}

/** A Grama Niladhari Division (GND) with official codes and trilingual names */
export interface GND {
  id: number;
  lifeCode: string;
  gnCode: string;
  mpaCode?: string;
  nameEn: string;
  nameSi: string;
  nameTa: string;
  dsdEn: string;
  dsdSi: string;
  dsdTa: string;
  districtEn: string;
  districtSi: string;
  districtTa: string;
  provinceEn: string;
  provinceSi: string;
  provinceTa: string;
  /** @deprecated Alias for nameEn */
  name?: string;
  /** @deprecated Alias for districtEn */
  district?: string;
  /** @deprecated Alias for id */
  fid?: number;
}

/** Province trilingual names */
export interface ProvinceInfo {
  nameEn: string;
  nameSi: string;
  nameTa: string;
}
