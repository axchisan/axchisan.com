import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Café del Barrio, programa de fidelización. Estado solo en el
 * navegador: cada prueba arranca limpia. La app y la caja comparten los datos
 * entre pestañas del mismo contexto.
 */
const RAIZ = "/demo/cafe-del-barrio"

async function verComo(page: Page, nivel: "puntos" | "completo") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:cafe-del-barrio:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
    nivel,
  )
  await page.reload()
}

async function sinViolaciones(page: Page, donde: string) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude("nextjs-portal")
    .analyze()
  expect(
    violations.map((v) => `${v.id}: ${v.nodes.length} nodo(s), ${v.help} | ${v.nodes[0]?.target.join(" ")}`),
    `violaciones en ${donde}`,
  ).toEqual([])
}

/** Toca un botón sin depender del scroll suave del celular emulado. */
const tocar = (page: Page, nombre: string | RegExp) => page.getByRole("button", { name: nombre }).first().dispatchEvent("click")

async function buscarEnCaja(caja: Page, codigo: string) {
  await caja.getByLabel("Código de la app o celular").fill(codigo)
  await caja.getByLabel("Código de la app o celular").press("Enter")
}

test.describe("demo Café del Barrio", () => {
  test("la app muestra puntos, sellos y el aviso de vencimiento", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    await expect(page.locator("[data-sellos]")).toHaveText("6 de 8")
    await expect(page.locator("[data-codigo-cliente]")).toHaveText("CB-2718")
    await expect(page.getByText(/40 puntos vencen el/)).toBeVisible()
    expect(errores).toEqual([])
  })

  test("una compra en caja suma puntos y un sello en la app abierta", async ({ page, context }) => {
    await page.goto(RAIZ)
    const antes = Number((await page.locator("[data-saldo]").textContent())!.replace(/\D/g, ""))
    const caja = await context.newPage()
    await caja.goto(`${RAIZ}/caja`)
    await buscarEnCaja(caja, "CB-2718")
    await expect(caja.locator("[data-cliente='CB-2718']")).toContainText("Valentina Ríos")
    await tocar(caja, /^Capuchino/)
    await tocar(caja, /^Pandebono/)
    await expect(caja.locator("[data-total]")).toHaveText(/11\.000/)
    await tocar(caja, "Registrar compra")
    // Nivel Tostado: 11 puntos por $ 11.000, por 1,25, redondeado hacia abajo.
    await expect(caja.getByRole("status").filter({ hasText: "ganó 13 puntos y un sello" })).toBeVisible()
    // La app, en otra pestaña, se entera sola.
    await expect(page.locator("[data-sellos]")).toHaveText("7 de 8")
    await expect(page.locator("[data-saldo]")).toContainText(String(antes + 13))
  })

  test("un premio canjeado se cobra una sola vez en caja", async ({ page, context }) => {
    await page.goto(RAIZ)
    await tocar(page, "Premios")
    await tocar(page, "Canjear capuchino")
    await tocar(page, /Sí, canjear 120 puntos/)
    const codigo = (await page.locator("[data-codigo-cupon]").textContent())!.trim()
    expect(codigo).toMatch(/^[A-Z2-9]{6}$/)

    const caja = await context.newPage()
    await caja.goto(`${RAIZ}/caja`)
    await caja.getByLabel("Código del cupón").fill(codigo)
    await caja.getByLabel("Código del cupón").press("Enter")
    await expect(caja.getByRole("status").filter({ hasText: "Entregar: Capuchino" })).toBeVisible()
    await caja.getByLabel("Código del cupón").press("Enter")
    await expect(caja.getByRole("alert").filter({ hasText: "ya se usó" })).toBeVisible()

    await tocar(page, "Ver mis cupones")
    await expect(page.locator(`[data-cupon='${codigo}']`)).toContainText("Usado")
  })

  test("un cupón vencido o inventado no pasa en caja", async ({ page }) => {
    await page.goto(`${RAIZ}/caja`)
    await page.getByLabel("Código del cupón").fill("R4TB8N")
    await page.getByLabel("Código del cupón").press("Enter")
    await expect(page.getByRole("alert").filter({ hasText: "venció" })).toBeVisible()
    await page.getByLabel("Código del cupón").fill("ZZZZZZ")
    await page.getByLabel("Código del cupón").press("Enter")
    await expect(page.getByRole("alert").filter({ hasText: "no existe" })).toBeVisible()
  })

  test("inscribir a un invitado le da el bono a los dos", async ({ page, context }) => {
    await page.goto(RAIZ)
    const antes = Number((await page.locator("[data-saldo]").textContent())!.replace(/\D/g, ""))
    const caja = await context.newPage()
    await caja.goto(`${RAIZ}/caja`)
    await tocar(caja, "Inscribir cliente nuevo")
    await caja.getByLabel("Nombre y apellido").fill("Sofía Herrera")
    await caja.getByLabel("Celular", { exact: true }).fill("3157778899")
    await caja.getByLabel("Cumpleaños").fill("1995-10-02")
    await caja.getByLabel(/Código de quien lo invitó/).fill("CB-2718")
    await tocar(caja, "Inscribir")
    await expect(caja.getByRole("status").filter({ hasText: "ganaron 50 puntos cada uno" })).toBeVisible()
    await expect(caja.locator("[data-puntos-cliente]")).toHaveText("50")
    await expect(page.locator("[data-saldo]")).toContainText(String(antes + 50))
  })

  test("una campaña reparte cupones y prepara el mensaje", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/campanas`)
    await tocar(page, /Enviar a \d+ clientes?/)
    await expect(page.getByRole("status").filter({ hasText: /salió para \d+/ })).toBeVisible()
    await tocar(page, "Ver el mensaje que le llega")
    await expect(page.getByRole("dialog")).toContainText("Café del Barrio")
  })

  test("sin el sistema completo, las campañas se ofrecen como el plan siguiente", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/campanas`)
    await verComo(page, "puntos")
    await expect(page.getByText(/Esto entra en el plan Sistema completo/)).toBeVisible()
  })

  test("la app se puede instalar: su manifiesto está completo", async ({ request }) => {
    const res = await request.get(`${RAIZ}/manifest.webmanifest`)
    expect(res.ok()).toBe(true)
    const m = await res.json()
    expect(m.start_url).toBe(RAIZ)
    expect(m.display).toBe("standalone")
    expect(m.icons.map((i: { sizes: string }) => i.sizes)).toContain("512x512")
    const icono = await request.get(m.icons[0].src)
    expect(icono.ok()).toBe(true)
  })

  test("app, caja y panel cumplen WCAG A y AA", async ({ page }) => {
    for (const r of ["", "/caja", "/panel", "/panel/campanas"]) {
      await page.goto(`${RAIZ}${r}`)
      await expect(page.locator("[aria-busy=true]")).toHaveCount(0)
      await sinViolaciones(page, r || "la app")
    }
    // Con resultados y errores a la vista.
    await page.goto(`${RAIZ}/caja`)
    await buscarEnCaja(page, "2718")
    await page.getByLabel("Código del cupón").fill("R4TB8N")
    await page.getByLabel("Código del cupón").press("Enter")
    await expect(page.getByRole("alert").filter({ hasText: "venció" })).toBeVisible()
    await sinViolaciones(page, "la caja con cliente y error")
  })

  test("en un celular de 360 px no hay desplazamiento lateral", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    for (const r of ["", "/caja", "/panel/campanas"]) {
      await page.goto(`${RAIZ}${r}`)
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(sobra, `desborde en ${r || "la app"}`).toBeLessThanOrEqual(0)
    }
    await contexto.close()
  })
})
