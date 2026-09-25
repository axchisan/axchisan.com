import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Tanda, panadería. Lo que queda depende de la hora: todas las pruebas
 * fijan el reloj a las 10:20 a. m., con varias horneadas ya afuera.
 */
const RAIZ = "/demo/tanda"

test.beforeEach(async ({ page }) => {
  const d = new Date()
  d.setHours(10, 20, 0, 0)
  await page.clock.install({ time: d })
})

async function verComo(page: Page, nivel: "pagina" | "pedidos" | "sistema") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:tanda:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
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

test.describe("demo Tanda", () => {
  test("la portada muestra las horneadas y lo que queda", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    await expect(page.getByText("La próxima sale en 40 minutos: milhoja.")).toBeVisible()
    const pandebono = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Pandebono" }) })
    await expect(pandebono).toContainText(/Quedan \d+/)
    await expect(pandebono).toContainText("Recién salido")
    // La milhoja todavía no sale.
    await expect(page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Milhoja" }) })).toContainText("Sale otra vez a las 11:00 a. m.")
    expect(errores).toEqual([])
  })

  test("un pedido para recoger llega completo al panel", async ({ page }) => {
    await page.goto(RAIZ)
    await page.getByRole("button", { name: "Agregar Pandebono" }).click()
    await page.getByLabel("Leche de Capuchino").selectOption("almendras")
    await page.getByRole("button", { name: "Agregar Capuchino" }).click()
    await page.goto(`${RAIZ}/bolsa`)
    // 2.500 + capuchino con leche de almendras 8.500.
    await expect(page.getByRole("complementary", { name: "Resumen" })).toContainText("$ 11.000")
    await page.getByLabel("Nombre").fill("Lina Duarte Rey")
    await page.getByLabel("Celular").fill("310 222 1111")
    await page.getByLabel("Celular").press("Enter")
    await expect(page.getByRole("heading", { name: "¡Pedido recibido!" })).toBeVisible()
    await expect(page.getByText("Capuchino (De almendras)", { exact: false })).toBeVisible()
    await page.goto(`${RAIZ}/panel`)
    await expect(page.getByText(/Lina Duarte Rey/)).toBeVisible()
  })

  test("una torta se arma con su precio y queda sin anticipo en el panel", async ({ page }) => {
    await page.goto(`${RAIZ}/encargos`)
    // dispatchEvent: en el celular emulado el clic cae mientras el scroll suave se mueve.
    await page.locator("label").filter({ hasText: "Dos libras" }).dispatchEvent("click")
    await page.locator("label").filter({ hasText: "Fresas con crema" }).dispatchEvent("click")
    // 170.000 + fresas 12.000.
    await expect(page.getByRole("complementary", { name: "Tu torta" })).toContainText("$ 182.000")
    await page.getByLabel("Mensaje en la torta").fill("Felices 15, Sofía")
    await page.getByLabel("Nombre").fill("Paola Ardila")
    await page.getByLabel("Celular").fill("315 000 1234")
    await page.getByLabel("Celular").press("Enter")
    await expect(page.getByText(/anticipo de \$\s91\.000/)).toBeVisible()
    await page.goto(`${RAIZ}/panel/encargos`)
    const encargo = page.getByRole("listitem").filter({ hasText: "Felices 15, Sofía" }).filter({ hasText: "Paola Ardila" })
    await expect(encargo).toContainText("Sin anticipo")
    await encargo.getByRole("button", { name: /Llegó el anticipo/ }).click()
    await expect(encargo).toContainText("Confirmado")
  })

  test("con la página sola, se pide por WhatsApp", async ({ page }) => {
    await page.goto(RAIZ)
    await verComo(page, "pagina")
    await expect(page.getByRole("button", { name: "Agregar Pandebono" })).toHaveCount(0)
    await page.goto(`${RAIZ}/encargos`)
    await expect(page.getByRole("button", { name: "Encargar por WhatsApp" })).toBeVisible()
    await page.goto(`${RAIZ}/panel/produccion`)
    await expect(page.getByText(/Esto entra en el plan Catálogo con pedidos por WhatsApp/)).toBeVisible()
  })

  test("portada, bolsa, encargos y panel cumplen WCAG A y AA", async ({ page }) => {
    await page.goto(RAIZ)
    await sinViolaciones(page, "la portada")
    await page.getByRole("button", { name: "Agregar Pandebono" }).click()
    for (const r of ["/bolsa", "/encargos", "/panel", "/panel/produccion", "/panel/encargos"]) {
      await page.goto(`${RAIZ}${r}`)
      await expect(page.locator("[aria-busy=true]")).toHaveCount(0)
      await sinViolaciones(page, r)
    }
  })

  test("en un celular de 360 px no hay desplazamiento lateral", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    for (const r of ["", "/bolsa", "/encargos", "/panel", "/panel/produccion", "/panel/encargos"]) {
      await page.goto(`${RAIZ}${r}`)
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(sobra, `desborde en ${r || "la portada"}`).toBeLessThanOrEqual(0)
    }
    await contexto.close()
  })
})
