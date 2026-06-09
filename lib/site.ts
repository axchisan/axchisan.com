/** URL canónica del sitio en producción. Sobrescribible por env. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://axchisan.com").replace(/\/$/, "")

export const SITE_NAME = "Axchi — Duvan Yair Arciniegas"
