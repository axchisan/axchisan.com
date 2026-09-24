/**
 * Capturas de las demos para las fichas del catálogo.
 *
 *   npm run capturas                          # contra producción
 *   npm run capturas -- http://localhost:3000 # contra un servidor local
 *
 * Las fichas solo muestran capturas de demos reales, nunca maquetas: si una
 * demo cambia, se vuelve a correr este script y las fichas quedan al día.
 * Salen en WebP a `public/capturas/`.
 */
import { mkdirSync } from "node:fs"
import { chromium, type Page } from "@playwright/test"
import sharp from "sharp"

const BASE = (process.argv[2] ?? "https://axchisan.com").replace(/\/$/, "")
const DESTINO = "public/capturas"

type Toma = {
  archivo: string
  url: string
  movil?: boolean
  /** Acciones antes de la foto: llenar un formulario, entrar al panel… */
  preparar?: (p: Page) => Promise<void>
}

const PANEL = async (p: Page) => {
  await p.evaluate(() => {
    localStorage.setItem("axchi-demo:canela:sesion", JSON.stringify({ rol: "veterinario" }))
    localStorage.setItem("axchi-demo:canela:preferencias", JSON.stringify({ nivel: "sistema", recorrido: false }))
  })
  await p.reload({ waitUntil: "networkidle" })
}

const SALON = async (p: Page) => {
  await p.evaluate(() =>
    localStorage.setItem("axchi-demo:peine-fino:preferencias", JSON.stringify({ nivel: "sistema", recorrido: false })),
  )
  await p.reload({ waitUntil: "networkidle" })
}

const TOMAS: Toma[] = [
  { archivo: "canela-portada-escritorio", url: `${BASE}/demo/canela` },
  { archivo: "canela-portada-movil", url: `${BASE}/demo/canela`, movil: true },
  {
    archivo: "canela-agendar-movil",
    url: `${BASE}/demo/canela/agendar?servicio=vacunacion`,
    movil: true,
    preparar: async (p) => {
      await p.getByRole("button", { name: "Continuar" }).click()
      await p.getByLabel("Tu celular").fill("300 000 1037")
      await p.getByRole("button", { name: "Luna" }).click()
      await p.getByRole("button", { name: "Continuar" }).click()
      await p.getByRole("radiogroup", { name: "Hora" }).getByRole("radio").first().click()
      await p.evaluate(() => window.scrollTo(0, 280))
    },
  },
  { archivo: "canela-panel-escritorio", url: `${BASE}/demo/canela/panel`, preparar: PANEL },
  { archivo: "canela-ficha-escritorio", url: `${BASE}/demo/canela/panel/pacientes/m16`, preparar: PANEL },
  { archivo: "canela-recordatorios-escritorio", url: `${BASE}/demo/canela/panel/recordatorios`, preparar: PANEL },
  { archivo: "peine-fino-portada-escritorio", url: `${BASE}/demo/peine-fino` },
  { archivo: "peine-fino-portada-movil", url: `${BASE}/demo/peine-fino`, movil: true },
  {
    archivo: "peine-fino-reservar-movil",
    url: `${BASE}/demo/peine-fino/reservar?servicios=corte-hombre,barba`,
    movil: true,
    preparar: async (p) => {
      await p.getByRole("button", { name: "Continuar" }).click()
      await p.getByRole("button", { name: "Continuar" }).click()
      await p.getByRole("radiogroup", { name: "Hora" }).getByRole("radio").first().click()
      await p.evaluate(() => window.scrollTo(0, 260))
    },
  },
  { archivo: "peine-fino-hoy-escritorio", url: `${BASE}/demo/peine-fino/panel`, preparar: SALON },
  { archivo: "peine-fino-caja-escritorio", url: `${BASE}/demo/peine-fino/panel/caja`, preparar: SALON },
  { archivo: "peine-fino-volver-escritorio", url: `${BASE}/demo/peine-fino/panel/volver`, preparar: SALON },
  { archivo: "jabones-mari-portada-escritorio", url: "https://jabonesmari.shop" },
  { archivo: "jabones-mari-portada-movil", url: "https://jabonesmari.shop", movil: true },
]

async function main() {
  mkdirSync(DESTINO, { recursive: true })
  const navegador = await chromium.launch()

  for (const t of TOMAS) {
    const contexto = await navegador.newContext(
      t.movil
        ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
        : { viewport: { width: 1440, height: 900 } },
    )
    const p = await contexto.newPage()
    try {
      await p.goto(t.url, { waitUntil: "networkidle" })
      await t.preparar?.(p)
      // Contra un servidor de desarrollo, su indicador no debe salir en la foto.
      // Va después de preparar: una recarga borraría el estilo.
      await p.addStyleTag({ content: "nextjs-portal { display: none !important; }" })
      // La placa se balancea al cargar: se espera a que quede quieta.
      await p.waitForTimeout(2000)
      const png = await p.screenshot()
      await sharp(png).webp({ quality: 80 }).toFile(`${DESTINO}/${t.archivo}.webp`)
      console.log(`${t.archivo}.webp`)
    } catch (error) {
      // Una toma que falla (un sitio externo caído, por ejemplo) no debe dejar
      // sin actualizar las demás; la captura anterior se conserva.
      console.error(`No se pudo capturar ${t.archivo}: ${(error as Error).message.split("\n")[0]}`)
      process.exitCode = 1
    }
    await contexto.close()
  }

  await navegador.close()
}

main()
