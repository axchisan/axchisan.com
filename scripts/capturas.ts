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
  /** Hora fija del reloj del navegador (`HH:mm`), para demos que dependen de la hora. */
  reloj?: string
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
    localStorage.setItem("axchi-demo:look-y-estilo:preferencias", JSON.stringify({ nivel: "sistema", recorrido: false })),
  )
  await p.reload({ waitUntil: "networkidle" })
}

/**
 * La demo cinematográfica: se baja hasta una fracción de una escena (o de la
 * página, sin selector) y se espera a que lleguen los fotogramas finos.
 */
const BRISAS_DEL_MAR = (fraccion: number, selector?: string, margen = 48) => async (p: Page) => {
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
  { archivo: "look-y-estilo-portada-escritorio", url: `${BASE}/demo/look-y-estilo` },
  { archivo: "look-y-estilo-portada-movil", url: `${BASE}/demo/look-y-estilo`, movil: true },
  {
    archivo: "look-y-estilo-reservar-movil",
    url: `${BASE}/demo/look-y-estilo/reservar?servicios=corte-hombre,barba`,
    movil: true,
    preparar: async (p) => {
      await p.getByRole("button", { name: "Continuar" }).click()
      await p.getByRole("button", { name: "Continuar" }).click()
      await p.getByRole("radiogroup", { name: "Hora" }).getByRole("radio").first().click()
      await p.evaluate(() => window.scrollTo(0, 260))
    },
  },
  { archivo: "look-y-estilo-hoy-escritorio", url: `${BASE}/demo/look-y-estilo/panel`, preparar: SALON },
  { archivo: "look-y-estilo-caja-escritorio", url: `${BASE}/demo/look-y-estilo/panel/caja`, preparar: SALON },
  { archivo: "look-y-estilo-volver-escritorio", url: `${BASE}/demo/look-y-estilo/panel/volver`, preparar: SALON },
  { archivo: "sabor-de-casa-portada-escritorio", url: `${BASE}/demo/sabor-de-casa` },
  { archivo: "sabor-de-casa-portada-movil", url: `${BASE}/demo/sabor-de-casa`, movil: true },
  {
    archivo: "sabor-de-casa-mesa-movil",
    url: `${BASE}/demo/sabor-de-casa?mesa=7`,
    movil: true,
    preparar: async (p) => {
      await p.getByRole("button", { name: "Agregar Bandeja 45" }).click()
      await p.getByRole("button", { name: /Agregar por/ }).click()
      await p.evaluate(() => document.querySelector("#carta")?.scrollIntoView())
      await p.waitForTimeout(3800)
    },
  },
  { archivo: "sabor-de-casa-cocina-escritorio", url: `${BASE}/demo/sabor-de-casa/panel/cocina` },
  {
    archivo: "sabor-de-casa-seguimiento-movil",
    url: `${BASE}/demo/sabor-de-casa/panel`,
    movil: true,
    preparar: async (p) => {
      // Un domicilio que va en camino: el seguimiento se ve con casi todo hecho.
      const fila = p.locator("li").filter({ hasText: "En camino" }).filter({ hasText: "Domicilio" }).first()
      const numero = (await fila.locator("p").first().textContent())?.replace(/\D/g, "")
      await p.goto(`${BASE}/demo/sabor-de-casa/pedido/p${numero}`, { waitUntil: "networkidle" })
    },
  },
  { archivo: "sabor-de-casa-carta-escritorio", url: `${BASE}/demo/sabor-de-casa/panel/carta` },
  {
    archivo: "la-principal-portada-movil",
    url: `${BASE}/demo/la-principal`,
    movil: true,
    preparar: async (p) => {
      await p.getByRole("searchbox").fill("tornillo")
      await p.getByRole("searchbox").evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 70))
    },
  },
  {
    archivo: "la-principal-caja-escritorio",
    url: `${BASE}/demo/la-principal/panel`,
    preparar: async (p) => {
      for (const t of ["cemento", "arena", "varilla"]) {
        await p.getByPlaceholder(/Nombre o código/).fill(t)
        await p.keyboard.press("Enter")
      }
      await p.getByRole("button", { name: /^\$ 200\.000$/ }).click().catch(() => {})
    },
  },
  { archivo: "la-principal-inventario-escritorio", url: `${BASE}/demo/la-principal/panel/inventario` },
  { archivo: "la-principal-reportes-escritorio", url: `${BASE}/demo/la-principal/panel/reportes` },
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
  { archivo: "sonrisa-clara-portada-movil", url: `${BASE}/demo/sonrisa-clara`, movil: true },
  {
    archivo: "sonrisa-clara-agendar-movil",
    url: `${BASE}/demo/sonrisa-clara/agendar?motivo=valoracion`,
    movil: true,
    preparar: async (p) => {
      await p.getByRole("button", { name: "Continuar" }).click()
      await p.getByRole("radiogroup", { name: "Hora" }).getByRole("radio").first().click()
      await p.evaluate(() => window.scrollTo(0, 250))
    },
  },
  { archivo: "sonrisa-clara-agenda-escritorio", url: `${BASE}/demo/sonrisa-clara/panel` },
  {
    archivo: "sonrisa-clara-odontograma-escritorio",
    url: `${BASE}/demo/sonrisa-clara/panel/pacientes`,
    preparar: async (p) => {
      await p.locator("a", { hasText: "Por hacer" }).first().click()
      await p.waitForURL(/pacientes\/p/)
      await p.waitForLoadState("networkidle")
    },
  },
  { archivo: "sonrisa-clara-cartera-escritorio", url: `${BASE}/demo/sonrisa-clara/panel/cartera` },
  { archivo: "titan-gym-portada-movil", url: `${BASE}/demo/titan-gym`, movil: true },
  {
    archivo: "titan-gym-horario-escritorio",
    url: `${BASE}/demo/titan-gym`,
    preparar: async (p) => {
      // Un día hábil completo, con la clase de la noche llena.
      await p.getByRole("radiogroup", { name: "Día" }).getByRole("radio").nth(await p.evaluate(() => (new Date().getDay() === 5 ? 3 : new Date().getDay() === 6 ? 2 : 1))).click()
      await p.evaluate(() => document.querySelector("#horario")?.scrollIntoView())
    },
  },
  { archivo: "titan-gym-clases-escritorio", url: `${BASE}/demo/titan-gym/panel` },
  { archivo: "titan-gym-socios-escritorio", url: `${BASE}/demo/titan-gym/panel/socios` },
  { archivo: "titan-gym-resumen-escritorio", url: `${BASE}/demo/titan-gym/panel/resumen` },
  { archivo: "tu-casa-portada-movil", url: `${BASE}/demo/tu-casa`, movil: true },
  { archivo: "tu-casa-listado-escritorio", url: `${BASE}/demo/tu-casa/inmuebles?operacion=venta` },
  { archivo: "tu-casa-ficha-escritorio", url: `${BASE}/demo/tu-casa/inmuebles/envigado-cocina` },
  { archivo: "tu-casa-interesados-escritorio", url: `${BASE}/demo/tu-casa/panel/interesados` },
  { archivo: "tu-casa-panel-escritorio", url: `${BASE}/demo/tu-casa/panel` },
  { archivo: "pan-de-la-casa-portada-movil", url: `${BASE}/demo/pan-de-la-casa`, movil: true, reloj: "10:20" },
  { archivo: "pan-de-la-casa-horneadas-escritorio", url: `${BASE}/demo/pan-de-la-casa#horneadas`, reloj: "10:20", preparar: async (p) => { await p.evaluate(() => document.querySelector("#horneadas")?.scrollIntoView()) } },
  { archivo: "pan-de-la-casa-vitrina-escritorio", url: `${BASE}/demo/pan-de-la-casa#vitrina`, reloj: "10:20", preparar: async (p) => { await p.evaluate(() => document.querySelector("#vitrina")?.scrollIntoView()) } },
  { archivo: "pan-de-la-casa-torta-escritorio", url: `${BASE}/demo/pan-de-la-casa/encargos`, reloj: "10:20" },
  { archivo: "pan-de-la-casa-produccion-escritorio", url: `${BASE}/demo/pan-de-la-casa/panel/produccion`, reloj: "10:20" },
  { archivo: "brisas-del-mar-portada-escritorio", url: `${BASE}/demo/brisas-del-mar`, preparar: BRISAS_DEL_MAR(0.15, "#llegada") },
  { archivo: "brisas-del-mar-portada-movil", url: `${BASE}/demo/brisas-del-mar`, movil: true, preparar: BRISAS_DEL_MAR(0.15, "#llegada") },
  { archivo: "brisas-del-mar-piscina-escritorio", url: `${BASE}/demo/brisas-del-mar`, preparar: BRISAS_DEL_MAR(0.5, "#piscina") },
  { archivo: "brisas-del-mar-habitaciones-escritorio", url: `${BASE}/demo/brisas-del-mar`, preparar: BRISAS_DEL_MAR(0, "#habitaciones", 130) },
  { archivo: "rojas-duarte-portada-escritorio", url: `${BASE}/demo/rojas-duarte`, reloj: "10:00" },
  { archivo: "rojas-duarte-portada-movil", url: `${BASE}/demo/rojas-duarte`, movil: true, reloj: "10:00" },
  { archivo: "rojas-duarte-area-escritorio", url: `${BASE}/demo/rojas-duarte/areas/laboral`, reloj: "10:00" },
  {
    archivo: "rojas-duarte-liquidacion-escritorio",
    url: `${BASE}/demo/rojas-duarte/herramientas/liquidacion`,
    reloj: "10:00",
    preparar: async (p) => {
      await p.getByLabel("Salario mensual").fill("2500000")
      await p.getByLabel("Fecha de ingreso").fill("2023-03-15")
      await p.getByLabel("Fecha de retiro").fill("2026-09-30")
      await p.getByText("Me despidieron sin justa causa").click()
      await p.getByRole("button", { name: "Calcular la liquidación" }).click()
      await p.evaluate(() => window.scrollTo(0, 250))
    },
  },
  {
    archivo: "rojas-duarte-consulta-escritorio",
    url: `${BASE}/demo/rojas-duarte/consulta?area=familia`,
    reloj: "10:00",
    preparar: async (p) => {
      await p.getByLabel("Su caso").fill("Mi esposo y yo queremos divorciarnos de mutuo acuerdo. Tenemos un apartamento y dos hijos menores.")
      await p.getByLabel("Nombre y apellido").fill("Paula Andrea Gómez")
      await p.getByRole("textbox", { name: "Celular" }).fill("310 555 1234")
      await p.getByLabel("Correo").fill("paula@correo.com")
      await p.getByRole("radio", { name: "Por videollamada" }).check()
      await p.getByLabel(/Autorizo/).check()
      await p.getByRole("button", { name: "Enviar la consulta" }).click()
      await p.waitForTimeout(300)
      await p.evaluate(() => window.scrollTo(0, 260))
    },
  },
  { archivo: "cafe-del-barrio-app-escritorio", url: `${BASE}/demo/cafe-del-barrio` },
  { archivo: "cafe-del-barrio-app-movil", url: `${BASE}/demo/cafe-del-barrio`, movil: true },
  {
    archivo: "cafe-del-barrio-caja-escritorio",
    url: `${BASE}/demo/cafe-del-barrio/caja`,
    preparar: async (p) => {
      await p.getByLabel("Código de la app o celular").fill("2718")
      await p.getByRole("button", { name: "Buscar cliente" }).click()
      await p.getByRole("button", { name: /^Capuchino/ }).click()
      await p.getByRole("button", { name: /^Pandebono/ }).click()
    },
  },
  { archivo: "cafe-del-barrio-panel-escritorio", url: `${BASE}/demo/cafe-del-barrio/panel` },
  { archivo: "cafe-del-barrio-campanas-escritorio", url: `${BASE}/demo/cafe-del-barrio/panel/campanas` },
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
    if (t.reloj) {
      const d = new Date()
      d.setHours(Number(t.reloj.slice(0, 2)), Number(t.reloj.slice(3, 5)), 0, 0)
      await p.clock.install({ time: d })
    }
    try {
      // La demo cinematográfica carga fotogramas sin parar: nunca queda en reposo.
      await p.goto(t.url, { waitUntil: t.url.includes("/brisas-del-mar") ? "load" : "networkidle" })
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
