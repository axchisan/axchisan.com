import type { ConfigDemo } from "@/demos/comun/contexto"

export const RAIZ = "/demo/orilla"

/** Fotogramas e imágenes en R2: son más de mil archivos y no caben en el repositorio. */
export const MEDIA = "https://pub-0b45e795c0e846e4a75617ae05769fc3.r2.dev/demos/orilla"

export const CONFIG_ORILLA: ConfigDemo = {
  slug: "orilla",
  nombre: "Orilla, resort frente a la bahía",
  paraQuien: "un hotel o un proyecto turístico",
  niveles: [{ id: "cinematografica", etiqueta: "Página cinematográfica", planes: ["pagina-cinematografica"] }],
  recorrido: {
    [RAIZ]: [
      {
        id: "acto",
        titulo: "El video avanza con el scroll",
        texto:
          "Quien baja por la página recorre el lugar como si volara sobre él. Tres escenas creadas con IA a partir de fotos del sitio, sin contratar un dron.",
      },
      {
        id: "habitaciones",
        titulo: "Después del recorrido, lo práctico",
        texto: "Habitaciones con su precio desde, experiencias y galería: lo que necesita quien ya se enamoró del lugar.",
      },
      {
        id: "reservar",
        titulo: "Reservas por WhatsApp",
        texto: "La consulta llega con el mensaje escrito. Con el plan Citas en línea se puede sumar disponibilidad por fechas.",
      },
    ],
  },
}
