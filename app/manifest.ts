import type { MetadataRoute } from "next"
import { PROFILE, SITE_NAME } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${PROFILE.role}`,
    short_name: PROFILE.alias,
    description:
      "Portafolio de Duvan Yair Arciniegas, desarrollador de software en Bogotá: sistemas completos, del modelo de datos al despliegue.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfcfd",
    theme_color: "#fcfcfd",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  }
}
