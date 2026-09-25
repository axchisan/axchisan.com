/**
 * Capturas de las demos para las fichas del catálogo.
 *
 *   npm run capturas                          # contra producción
 *   npm run capturas -- http://localhost:3000 # contra un servidor local
 *   npm run capturas -- http://localhost:3000 orilla # solo las tomas que contienen "orilla"
 *
 * Las fichas solo muestran capturas de demos reales, nunca maquetas: si una
 * demo cambia, se vuelve a correr este script y las fichas quedan al día.
 * Salen en WebP a `public/capturas/`.
 */
import { mkdirSync } from "node:fs"
import { chromium, type Page } from "@playwright/test"
import sharp from "sharp"

const BASE = (process.argv[2] ?? "https://axchisan.com").replace(/\/$/, "")
const FILTRO = process.argv[3] ?? ""
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

/**
 * La demo cinematográfica: se baja hasta una fracción de una escena (o de la
 * página, sin selector) y se espera a que lleguen los fotogramas finos.
 */
const ORILLA = (fraccion: number, selector?: string, margen = 48) => async (p: Page) => {
  await p.evaluate(
    ([f, sel, m]) => {
      const el = sel ? document.querySelector<HTMLElement>(sel as string) : null
      const arriba = el ? el.getBoundingClientRect().top + scrollY - (m as number) : 0
      const recorrido = el ? Math.max(0, el.offsetHeight - innerHeight) : document.documentElement.scrollHeight
      window.scrollTo(0, arriba + recorrido * (f as number))
    },
    [fraccion, selector ?? null, margen],
  )
  await p.waitForTimeout(5000)
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
  { archivo: "fogon-45-portada-escritorio", url: `${BASE}/demo/fogon-45` },
  { archivo: "fogon-45-portada-movil", url: `${BASE}/demo/fogon-45`, movil: true },
  {
    archivo: "fogon-45-mesa-movil",
    url: `${BASE}/demo/fogon-45?mesa=7`,
    movil: true,
    preparar: async (p) => {
      await p.getByRole("button", { name: "Agregar Bandeja 45" }).click()
      await p.getByRole("button", { name: /Agregar por/ }).click()
      await p.evaluate(() => document.querySelector("#carta")?.scrollIntoView())
      await p.waitForTimeout(3800)
    },
  },
  { archivo: "fogon-45-cocina-escritorio", url: `${BASE}/demo/fogon-45/panel/cocina` },
  {
    archivo: "fogon-45-seguimiento-movil",
    url: `${BASE}/demo/fogon-45/panel`,
    movil: true,
    preparar: async (p) => {
      // Un domicilio que va en camino: el seguimiento se ve con casi todo hecho.
      const fila = p.locator("li").filter({ hasText: "En camino" }).filter({ hasText: "Domicilio" }).first()
      const numero = (await fila.locator("p").first().textContent())?.replace(/\D/g, "")
      await p.goto(`${BASE}/demo/fogon-45/pedido/p${numero}`, { waitUntil: "networkidle" })
    },
  },
  { archivo: "fogon-45-carta-escritorio", url: `${BASE}/demo/fogon-45/panel/carta` },
  {
    archivo: "doble-rosca-portada-movil",
    url: `${BASE}/demo/doble-rosca`,
    movil: true,
    preparar: async (p) => {
      await p.getByRole("searchbox").fill("tornillo")
      await p.getByRole("searchbox").evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 70))
    },
  },
  {
    archivo: "doble-rosca-caja-escritorio",
    url: `${BASE}/demo/doble-rosca/panel`,
    preparar: async (p) => {
      for (const t of ["cemento", "arena", "varilla"]) {
        await p.getByPlaceholder(/Nombre o código/).fill(t)
        await p.keyboard.press("Enter")
      }
      await p.getByRole("button", { name: /^\$ 200\.000$/ }).click().catch(() => {})
    },
  },
  { archivo: "doble-rosca-inventario-escritorio", url: `${BASE}/demo/doble-rosca/panel/inventario` },
  { archivo: "doble-rosca-reportes-escritorio", url: `${BASE}/demo/doble-rosca/panel/reportes` },
  { archivo: "linaza-portada-escritorio", url: `${BASE}/demo/linaza` },
  {
    archivo: "linaza-producto-movil",
    url: `${BASE}/demo/linaza/producto/vestido-lazo`,
    movil: true,
    preparar: async (p) => {
      await p.locator("label").filter({ has: p.getByRole("radio", { name: "Terracota" }) }).click()
      await p.locator("label", { hasText: /^L/ }).click()
      await p.evaluate(() => window.scrollTo(0, 430))
    },
  },
  {
    archivo: "linaza-bolsa-escritorio",
    url: `${BASE}/demo/linaza/producto/pantalon-tobillero`,
    preparar: async (p) => {
      await p.locator("label", { hasText: /^S$/ }).click()
      await p.getByRole("button", { name: "Agregar a la bolsa" }).click()
      await p.goto(`${BASE}/demo/linaza/bolsa`, { waitUntil: "networkidle" })
      await p.getByLabel("Ciudad").selectOption("bogota")
      await p.getByLabel("Nombre completo").fill("Catalina Restrepo")
    },
  },
  { archivo: "linaza-pedidos-escritorio", url: `${BASE}/demo/linaza/panel` },
  { archivo: "linaza-inventario-escritorio", url: `${BASE}/demo/linaza/panel/inventario` },
  { archivo: "molar-116-portada-movil", url: `${BASE}/demo/molar-116`, movil: true },
  {
    archivo: "molar-116-agendar-movil",
    url: `${BASE}/demo/molar-116/agendar?motivo=valoracion`,
    movil: true,
    preparar: async (p) => {
      await p.getByRole("button", { name: "Continuar" }).click()
      await p.getByRole("radiogroup", { name: "Hora" }).getByRole("radio").first().click()
      await p.evaluate(() => window.scrollTo(0, 250))
    },
  },
  { archivo: "molar-116-agenda-escritorio", url: `${BASE}/demo/molar-116/panel` },
  {
    archivo: "molar-116-odontograma-escritorio",
    url: `${BASE}/demo/molar-116/panel/pacientes`,
    preparar: async (p) => {
      await p.locator("a", { hasText: "Por hacer" }).first().click()
      await p.waitForURL(/pacientes\/p/)
      await p.waitForLoadState("networkidle")
    },
  },
  { archivo: "molar-116-cartera-escritorio", url: `${BASE}/demo/molar-116/panel/cartera` },
  { archivo: "palanca-portada-movil", url: `${BASE}/demo/palanca`, movil: true },
  {
    archivo: "palanca-horario-escritorio",
    url: `${BASE}/demo/palanca`,
    preparar: async (p) => {
      // Un día hábil completo, con la clase de la noche llena.
      await p.getByRole("radiogroup", { name: "Día" }).getByRole("radio").nth(await p.evaluate(() => (new Date().getDay() === 5 ? 3 : new Date().getDay() === 6 ? 2 : 1))).click()
      await p.evaluate(() => document.querySelector("#horario")?.scrollIntoView())
    },
  },
  { archivo: "palanca-clases-escritorio", url: `${BASE}/demo/palanca/panel` },
  { archivo: "palanca-socios-escritorio", url: `${BASE}/demo/palanca/panel/socios` },
  { archivo: "palanca-resumen-escritorio", url: `${BASE}/demo/palanca/panel/resumen` },
  { archivo: "orilla-portada-escritorio", url: `${BASE}/demo/orilla`, preparar: ORILLA(0.15, "#llegada") },
  { archivo: "orilla-portada-movil", url: `${BASE}/demo/orilla`, movil: true, preparar: ORILLA(0.15, "#llegada") },
  { archivo: "orilla-piscina-escritorio", url: `${BASE}/demo/orilla`, preparar: ORILLA(0.5, "#piscina") },
  { archivo: "orilla-habitaciones-escritorio", url: `${BASE}/demo/orilla`, preparar: ORILLA(0, "#habitaciones", 130) },
  { archivo: "jabones-mari-portada-escritorio", url: "https://jabonesmari.shop" },
  { archivo: "jabones-mari-portada-movil", url: "https://jabonesmari.shop", movil: true },
]

async function main() {
  mkdirSync(DESTINO, { recursive: true })
  const navegador = await chromium.launch()

  for (const t of TOMAS.filter((t) => t.archivo.includes(FILTRO))) {
    const contexto = await navegador.newContext(
      t.movil
        ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
        : { viewport: { width: 1440, height: 900 } },
    )
    const p = await contexto.newPage()
    try {
      // La demo cinematográfica carga fotogramas sin parar: nunca queda en reposo.
      await p.goto(t.url, { waitUntil: t.url.includes("/orilla") ? "load" : "networkidle" })
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
