import { test, expect, type Page } from "@playwright/test"

const RUTAS = [
  "/",
  "/soluciones",
  "/soluciones/veterinarias",
  "/soluciones/salones-y-barberias",
  "/soluciones/tiendas-de-cosmeticos",
  "/planes",
  "/proceso",
  "/a-medida",
  "/empresa",
  "/cotizar",
  "/guias",
  "/privacidad",
]

/** Errores de consola reales, descartando el ruido del servidor de desarrollo. */
function capturarErrores(page: Page): string[] {
  const errores: string[] = []
  page.on("console", (m) => {
    if (m.type() !== "error") return
    const t = m.text()
    if (/Download the React DevTools|favicon/i.test(t)) return
    errores.push(t)
  })
  page.on("pageerror", (e) => errores.push(e.message))
  return errores
}

test.describe("páginas públicas", () => {
  for (const ruta of RUTAS) {
    test(`${ruta} carga sin errores y con un solo h1`, async ({ page }) => {
      const errores = capturarErrores(page)

      const res = await page.goto(ruta)
      expect(res?.status(), `HTTP de ${ruta}`).toBe(200)

      // Un h1 exactamente: ni cero (mala semántica) ni varios.
      await expect(page.locator("h1")).toHaveCount(1)

      // El título de pestaña no puede quedarse en el genérico.
      await expect(page).toHaveTitle(/\S/)

      expect(errores, `errores de consola en ${ruta}`).toEqual([])
    })
  }

  // `unstable_cache` devuelve el resultado serializado: en la primera visita
  // una fecha llega como Date y en las siguientes como string. Un `.toISOString()`
  // sin normalizar da 500 solo a partir de la segunda visita, así que la única
  // forma de cazarlo es pedir cada página dos veces.
  test("una segunda visita (acierto de caché) sigue respondiendo 200", async ({ page }) => {
    for (const ruta of RUTAS) {
      await page.goto(ruta)
      const segunda = await page.goto(ruta)
      expect(segunda?.status(), `segunda visita a ${ruta}`).toBe(200)
    }
  })

  test("404 responde 404 y ofrece salida", async ({ page }) => {
    const res = await page.goto("/ruta-que-no-existe-jamas")
    expect(res?.status()).toBe(404)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByRole("link", { name: "Ir al inicio", exact: true })).toBeVisible()
  })
})

test.describe("compatibilidad con rutas anteriores", () => {
  // El sitio anterior estuvo indexado con rutas en inglés, y el portafolio con
  // /trabajo, /blog, /sobre… Cada una redirige a su destino final en un solo
  // salto: si desaparecen, los resultados de Google pasan a dar 404.
  const HEREDADAS: Array<[string, string]> = [
    ["/servicios", "/planes"],
    ["/trabajo", "/soluciones"],
    ["/trabajo/tecnobichos", "/soluciones"],
    ["/sobre", "/empresa"],
    ["/contacto", "/cotizar"],
    ["/blog", "/guias"],
    ["/about", "/empresa"],
    ["/services", "/planes"],
    ["/contact", "/cotizar"],
    ["/projects", "/soluciones"],
    ["/projects/abc123", "/soluciones"],
    ["/privacy", "/privacidad"],
    ["/terms", "/privacidad"],
    ["/saved", "/soluciones"],
    ["/messages", "/cotizar"],
  ]

  for (const [vieja, nueva] of HEREDADAS) {
    test(`${vieja} redirige a ${nueva}`, async ({ page, request }) => {
      const directa = await request.get(vieja, { maxRedirects: 0 })
      expect(directa.status(), `${vieja} debería redirigir en un salto`).toBe(308)
      expect(directa.headers()["location"]).toMatch(new RegExp(`${nueva}$`))
      const res = await page.goto(vieja)
      expect(res?.status(), `${vieja} debería resolver`).toBe(200)
      await expect(page).toHaveURL(new RegExp(`${nueva}$`))
    })
  }
})

test.describe("navegación", () => {
  test("cada enlace del menú llega a su página", async ({ page }, testInfo) => {
    await page.goto("/")

    const enlaces = [
      { nombre: "Soluciones", url: "/soluciones" },
      { nombre: "Planes y precios", url: "/planes" },
      { nombre: "Proceso", url: "/proceso" },
      { nombre: "A medida", url: "/a-medida" },
      { nombre: "Sobre Axchi", url: "/empresa" },
    ]

    for (const { nombre, url } of enlaces) {
      await page.goto("/")
      if (testInfo.project.name === "movil") {
        await page.getByRole("button", { name: "Abrir menú" }).click()
      }
      await page
        .getByRole("navigation", { name: "Principal" })
        .getByRole("link", { name: nombre, exact: true })
        .filter({ visible: true })
        .first()
        .click()
      await expect(page).toHaveURL(new RegExp(`${url}$`))
    }
  })

  test("ningún enlace interno apunta a una página rota", async ({ page, request }) => {
    const vistos = new Set<string>()

    for (const ruta of RUTAS) {
      await page.goto(ruta)
      const hrefs = await page.locator("a[href^='/']").evaluateAll((as) =>
        as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!),
      )
      for (const h of hrefs) vistos.add(h.split("#")[0])
    }

    const rotos: string[] = []
    for (const href of vistos) {
      if (!href || href.startsWith("//")) continue
      const res = await request.get(href)
      if (res.status() >= 400) rotos.push(`${href} → ${res.status()}`)
    }
    expect(rotos, "enlaces internos rotos").toEqual([])
  })
})

test.describe("cotización", () => {
  test("bloquea el envío vacío y señala los campos", async ({ page }) => {
    await page.goto("/cotizar")
    await page.getByRole("button", { name: "Pedir cotización" }).click()

    await expect(page.getByText("Escribe tu nombre.")).toBeVisible()
    await expect(page.getByText("Déjanos un WhatsApp o un correo para responderte.")).toBeVisible()
    await expect(page.getByText("Cuéntanos un poco más de lo que necesitas.")).toBeVisible()
  })

  test("rechaza un correo mal formado", async ({ page }) => {
    await page.goto("/cotizar")
    await page.getByLabel("Tu nombre").fill("Prueba Automática")
    await page.getByLabel(/^Correo/).fill("esto-no-es-un-correo")
    await page.getByLabel("Cuéntanos qué necesitas").fill("Mensaje de prueba con longitud suficiente.")
    await page.getByRole("button", { name: "Pedir cotización" }).click()

    await expect(page.getByText("Revisa el correo: falta algo.")).toBeVisible()
  })

  test("llega con el negocio y el plan elegidos desde una ficha", async ({ page }) => {
    await page.goto("/cotizar?negocio=veterinarias&plan=citas-en-linea")
    await expect(page.getByLabel("Tipo de negocio")).toHaveValue("veterinarias")
    await expect(page.getByLabel("Qué necesitas", { exact: true })).toHaveValue("citas-en-linea")
  })

  test("envía una cotización solo con WhatsApp", async ({ page }) => {
    await page.goto("/cotizar?negocio=veterinarias")
    await page.getByText("Prefiero pagar por mes").click()
    await page.getByLabel("Cuéntanos qué necesitas").fill("Cotización generada por la suite de pruebas end-to-end.")
    await page.getByLabel("Tu nombre").fill("Prueba Automática")
    await page.getByLabel("WhatsApp", { exact: true }).fill("300 000 0000")
    await page.getByRole("button", { name: "Pedir cotización" }).click()

    await expect(page.getByRole("status").filter({ hasText: "Recibimos tu solicitud" })).toBeVisible({ timeout: 20_000 })
    await expect(page.getByLabel("Tu nombre")).toHaveValue("")
  })
})

test.describe("catálogo", () => {
  test("desde la portada se llega a la demo de la veterinaria", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Abrir la demo" }).first().click()
    await expect(page).toHaveURL(/\/demo\/canela$/)
  })

  test("la ficha muestra el precio de entrada y lleva a la demo", async ({ page }) => {
    await page.goto("/soluciones/veterinarias")
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veterinarias")
    await expect(page.getByText("$ 300.000").first()).toBeVisible()
    await page.getByRole("link", { name: "Probar la demo" }).first().click()
    await expect(page).toHaveURL(/\/demo\/canela$/)
  })

  test("una solución que no existe da 404", async ({ request }) => {
    const res = await request.get("/soluciones/no-existe")
    expect(res.status()).toBe(404)
  })

  test("el sitemap tiene las fichas y no las demos", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text()
    expect(xml).toContain("/soluciones/veterinarias")
    expect(xml).not.toContain("/demo/")
    expect(xml).not.toContain("/trabajo")
  })
})

test.describe("iconos", () => {
  // /favicon.ico lo piden a ciegas navegadores, lectores de RSS y rastreadores;
  // estuvo dando 404 en producción.
  test("todos los iconos declarados existen", async ({ request }) => {
    const manifest = await (await request.get("/manifest.webmanifest")).json()
    const rutas = ["/favicon.ico", "/icon.svg", "/apple-icon.png", "/og.png", ...manifest.icons.map((i: { src: string }) => i.src)]
    for (const ruta of rutas) {
      const res = await request.get(ruta)
      expect(res.status(), ruta).toBe(200)
    }
  })
})

test.describe("medición", () => {
  test("registra eventos válidos e ignora los que no lo son", async ({ request }) => {
    const valido = await request.post("/api/eventos", { data: { evento: "visita", ruta: "/planes" } })
    expect(valido.status()).toBe(204)
    // Un evento inventado o del panel no se guarda, pero tampoco da error.
    const invalido = await request.post("/api/eventos", { data: { evento: "compra", ruta: "/planes" } })
    expect(invalido.status()).toBe(204)
    const panel = await request.post("/api/eventos", { data: { evento: "visita", ruta: "/admin" } })
    expect(panel.status()).toBe(204)
  })

  test("un toque en WhatsApp se registra como evento", async ({ page }) => {
    await page.goto("/soluciones/veterinarias")
    const peticion = page.waitForRequest((r) => r.url().endsWith("/api/eventos") && (r.postData() ?? "").includes("whatsapp"))
    // Se evita abrir WhatsApp de verdad: solo interesa el registro.
    await page.route("https://wa.me/**", (r) => r.abort())
    await page.getByRole("link", { name: "Cotizar por WhatsApp" }).first().click()
    await peticion
  })
})
