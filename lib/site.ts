/** URL canónica del sitio en producción. Sobrescribible por env. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://axchisan.com").replace(/\/$/, "")

export const SITE_NAME = "Axchi"
export const SITE_ALIAS = "Duvan Yair Arciniegas"

export const PROFILE = {
  name: "Duvan Yair Arciniegas",
  alias: "Axchi",
  role: "Desarrollo de software a medida",
  whatsapp: "573183038190",
  location: "Bogotá, Colombia",
  email: "axchisan923@gmail.com",
  github: "https://github.com/axchisan",
  linkedin: "https://www.linkedin.com/in/duvan-yair-arciniegas-gerena-535690339",
  instagram: "https://www.instagram.com/axchisan",
} as const
