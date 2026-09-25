import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Linaza, tienda de ropa. Estado solo en el navegador: cada prueba
 * arranca limpia y no toca la base.
 */
const RAIZ = "/demo/linaza"

async function verComo(page: Page, nivel: "catalogo" | "tienda") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:linaza:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
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

/** Los radios de color y talla están ocultos detrás de su etiqueta, como en la tienda real. */
const elegirColor = (page: Page, nombre: string) => page.locator("label").filter({ has: page.getByRole("radio", { name: nombre }) }).click()
const elegirTalla = (page: Page, talla: string) => page.locator("label").filter({ has: page.getByRole("radio", { name: talla, exact: true }) }).click()

async function llenarEnvio(page: Page) {
  await page.getByLabel("Nombre completo").fill("Catalina Restrepo")
  await page.getByLabel("Celular").fill("300 555 1234")
  if (await page.getByLabel("Correo").count()) await page.getByLabel("Correo").fill("cata@correo.co")
  await page.getByLabel("Ciudad").selectOption("bogota")
  await page.getByLabel("Dirección").fill("Carrera 7 # 72-41, apto 502")
}

test.describe("demo Linaza", () => {
  test("la portada carga, filtra por talla y queda fuera del índice", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    await expect(page.getByText("10 prendas")).toBeVisible()
    await page.getByRole("button", { name: "Solo talla XL" }).click()
    await expect(page.getByText(/con talla XL disponible/)).toBeVisible()
    // Solo las camisas y los básicos vienen en XL.
    await expect(page.getByRole("heading", { name: "Vestido corto con lazo" })).toHaveCount(0)
    expect(errores).toEqual([])
  })

  test("una talla agotada no se puede elegir", async ({ page }) => {
    await page.goto(`${RAIZ}/producto/pantalon-tobillero`)
    await expect(page.getByRole("radio", { name: "XS (agotada)" })).toBeDisabled()
    await elegirColor(page, "Menta")
    await elegirTalla(page, "L")
    await expect(page.getByText("Queda una sola en menta, talla L.")).toBeVisible()
    await page.getByRole("button", { name: "Guía de tallas" }).click()
    await expect(page.getByRole("dialog")).toContainText("Cintura")
  })

  test("una compra con pago en línea aparta la prenda y llega al panel", async ({ page }) => {
    await page.goto(`${RAIZ}/producto/pantalon-tobillero`)
    await page.getByRole("button", { name: "Agregar a la bolsa" }).click()
    await expect(page.getByText("Elige una talla para agregar a la bolsa.")).toBeVisible()
    await elegirColor(page, "Menta")
    await elegirTalla(page, "L")
    await page.getByRole("button", { name: "Agregar a la bolsa" }).click()
    await page.goto(`${RAIZ}/bolsa`)
    await llenarEnvio(page)
    // 169.000 + envío a Bogotá 12.900.
    await expect(page.getByRole("complementary", { name: "Resumen" })).toContainText("$ 181.900")
    await page.getByRole("button", { name: /^Pagar/ }).click()
    await page.getByRole("button", { name: "Aprobar pago de prueba" }).click()
    await expect(page.getByRole("heading", { name: "Gracias por tu compra" })).toBeVisible()

    // Era la última menta L: ya no se puede elegir.
    await page.goto(`${RAIZ}/producto/pantalon-tobillero`)
    await elegirColor(page, "Menta")
    await expect(page.getByRole("radio", { name: "L (agotada)" })).toBeDisabled()

    await page.goto(`${RAIZ}/panel`)
    const pedido = page.getByRole("listitem").filter({ hasText: "Catalina Restrepo" }).first()
    await expect(pedido).toContainText("Pagado")
    await pedido.getByRole("button", { name: /Marcar empacado/ }).click()
    await expect(pedido).toContainText("Empacado")
  })

  test("con el catálogo, el pedido llega por WhatsApp", async ({ page }) => {
    await page.goto(`${RAIZ}/producto/camiseta-pima`)
    await verComo(page, "catalogo")
    await elegirTalla(page, "M")
    await page.getByRole("button", { name: "Agregar a la bolsa" }).click()
    await page.goto(`${RAIZ}/bolsa`)
    await expect(page.getByLabel("Correo")).toHaveCount(0)
    await llenarEnvio(page)
    await page.getByRole("button", { name: "Enviar pedido por WhatsApp" }).click()
    await expect(page.getByRole("heading", { name: "Recibimos tu pedido" })).toBeVisible()
    await page.getByRole("button", { name: "Cómo le llega a la tienda" }).click()
    await expect(page.getByRole("dialog")).toContainText("Camiseta de algodón pima, blanco, talla M")
    await page.goto(`${RAIZ}/panel/inventario`)
    await expect(page.getByText(/Esto entra en el plan Tienda con pagos/)).toBeVisible()
  })

  test("el inventario del panel cambia lo que se puede comprar", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/inventario`)
    await page.getByLabel("Vestido corto con lazo, Terracota, talla M").fill("4")
    await page.goto(`${RAIZ}/producto/vestido-lazo`)
    await elegirColor(page, "Terracota")
    await expect(page.getByRole("radio", { name: "M", exact: true })).toBeEnabled()
  })

  test("portada, prenda, bolsa y panel cumplen WCAG A y AA", async ({ page }) => {
    await page.goto(RAIZ)
    await sinViolaciones(page, "la portada")
    await page.goto(`${RAIZ}/producto/vestido-lazo`)
    await sinViolaciones(page, "la prenda")
    await elegirTalla(page, "S")
    await page.getByRole("button", { name: "Agregar a la bolsa" }).click()
    await page.goto(`${RAIZ}/bolsa`)
    await sinViolaciones(page, "la bolsa")
    for (const r of ["panel", "panel/inventario"]) {
      await page.goto(`${RAIZ}/${r}`)
      await expect(page.locator("[aria-busy=true]")).toHaveCount(0)
      await sinViolaciones(page, r)
    }
  })

  test("en un celular de 360 px no hay desplazamiento lateral", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    for (const r of ["", "/producto/pantalon-tobillero", "/bolsa", "/panel", "/panel/inventario"]) {
      await page.goto(`${RAIZ}${r}`)
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(sobra, `desborde en ${r || "la portada"}`).toBeLessThanOrEqual(0)
    }
    await contexto.close()
  })
})
