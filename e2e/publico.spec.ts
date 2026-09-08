import { test, expect, type Page } from "@playwright/test"

const RUTAS = ["/", "/trabajo", "/blog", "/servicios", "/sobre", "/contacto"]

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
    await expect(page.getByRole("link", { name: "Ir al inicio" })).toBeVisible()
  })
})

test.describe("navegación", () => {
  test("cada enlace del menú llega a su página", async ({ page }, testInfo) => {
    await page.goto("/")

    const enlaces = [
      { nombre: "Trabajo", url: "/trabajo" },
      { nombre: "Escritos", url: "/blog" },
      { nombre: "Qué hago", url: "/servicios" },
      { nombre: "Sobre mí", url: "/sobre" },
      { nombre: "Contacto", url: "/contacto" },
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

test.describe("tema", () => {
  test("el conmutador cambia entre claro y oscuro y persiste", async ({ page }) => {
    await page.goto("/")

    const raiz = page.locator("html")
    const boton = page.getByRole("button", { name: /Cambiar a tema/ })

    const antes = await raiz.getAttribute("data-theme")
    await boton.click()
    await expect(raiz).not.toHaveAttribute("data-theme", antes ?? "")

    const despues = await raiz.getAttribute("data-theme")

    // La elección debe sobrevivir a una recarga: si no, no sirve de nada.
    await page.reload()
    await expect(raiz).toHaveAttribute("data-theme", despues!)
  })
})

test.describe("formulario de contacto", () => {
  test("bloquea el envío vacío y señala los campos", async ({ page }) => {
    await page.goto("/contacto")
    await page.getByRole("button", { name: "Enviar mensaje" }).click()

    await expect(page.getByText("Escribe tu nombre.")).toBeVisible()
    await expect(page.getByText("Revisa el correo: falta algo.")).toBeVisible()
    await expect(page.getByText("Cuéntame un poco más.")).toBeVisible()
  })

  test("rechaza un correo mal formado", async ({ page }) => {
    await page.goto("/contacto")
    await page.getByLabel("Nombre").fill("Prueba Automática")
    await page.getByLabel("Correo").fill("esto-no-es-un-correo")
    await page.getByLabel("Mensaje").fill("Mensaje de prueba con longitud suficiente.")
    await page.getByRole("button", { name: "Enviar mensaje" }).click()

    await expect(page.getByText("Revisa el correo: falta algo.")).toBeVisible()
  })

  test("envía un mensaje válido y limpia el formulario", async ({ page }) => {
    await page.goto("/contacto")
    await page.getByLabel("Nombre").fill("Prueba Automática")
    await page.getByLabel("Correo").fill("prueba@example.com")
    await page.getByLabel(/Asunto/).fill("Suite E2E")
    await page.getByLabel("Mensaje").fill("Mensaje generado por la suite de pruebas end-to-end.")
    await page.getByRole("button", { name: "Enviar mensaje" }).click()

    await expect(page.getByText("Mensaje enviado. Te respondo pronto.")).toBeVisible({ timeout: 20_000 })
    await expect(page.getByLabel("Nombre")).toHaveValue("")
  })
})

test.describe("detalle de proyecto", () => {
  test("desde el listado se abre un proyecto con su ficha", async ({ page }) => {
    await page.goto("/trabajo")

    const primero = page.locator("article").first()
    const titulo = (await primero.getByRole("heading").textContent())!.trim()
    await primero.getByRole("link").first().click()

    await expect(page).toHaveURL(/\/trabajo\/.+/)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(titulo)
    await expect(page.getByRole("link", { name: "Volver al trabajo" })).toBeVisible()
  })
})
