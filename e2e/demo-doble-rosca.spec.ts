import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de la ferretería Doble Rosca. Estado solo en el navegador: cada prueba
 * arranca limpia y no toca la base.
 */
const RAIZ = "/demo/doble-rosca"

async function verComo(page: Page, nivel: "catalogo" | "gestion" | "completo") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:doble-rosca:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
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

/** Existencias que muestra el inventario para un producto. */
async function existencias(page: Page, producto: string) {
  await page.goto(`${RAIZ}/panel/inventario`)
  const fila = page.getByRole("row").filter({ has: page.getByRole("link", { name: producto, exact: true }) })
  const texto = await fila.getByText(/mín\./).textContent()
  return Number(texto!.trim().split(" ")[0])
}

test.describe("demo Doble Rosca", () => {
  test("la portada carga, busca y queda fuera del índice", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    // Sin tildes también encuentra: "teflon" encuentra "teflón".
    await page.getByRole("searchbox").fill("teflon")
    await expect(page.getByText("1 de 49 productos")).toBeVisible()
    await expect(page.getByText("Cinta de teflón")).toBeVisible()
    expect(errores).toEqual([])
  })

  test("una lista de la página llega al panel y se cobra en la caja", async ({ page }) => {
    await page.goto(RAIZ)
    await page.getByRole("searchbox").fill("cemento")
    await page.getByRole("button", { name: "Agregar Cemento gris 50 kg a la lista" }).click()
    await page.goto(`${RAIZ}/lista`)
    await page.getByLabel("Nombre").fill("Jairo Pérez")
    await page.getByLabel("Celular").fill("310 222 3344")
    await page.getByRole("button", { name: "Enviar por WhatsApp" }).click()
    await expect(page.getByRole("heading", { name: "Lista enviada" })).toBeVisible()
    await expect(page.getByText(/Pedido web #313/)).toBeVisible()

    const antes = await existencias(page, "Cemento gris 50 kg")
    await page.goto(`${RAIZ}/panel/pedidos`)
    const pedido = page.getByRole("listitem").filter({ hasText: "#313, Jairo Pérez" })
    await pedido.getByRole("link", { name: "Cobrar en la caja" }).click()
    await page.getByRole("button", { name: "Cargar en la caja" }).click()
    await page.getByRole("button", { name: "Exacto" }).click()
    await page.getByRole("button", { name: /^Cobrar \$/ }).click()
    await expect(page.getByRole("dialog")).toContainText("1 Cemento gris 50 kg")
    await page.getByRole("button", { name: "Nueva venta" }).click()

    expect(await existencias(page, "Cemento gris 50 kg")).toBe(antes - 1)
    await page.goto(`${RAIZ}/panel/pedidos`)
    await expect(page.getByRole("listitem").filter({ hasText: "#313, Jairo Pérez" })).toContainText("Vendido")
  })

  test("la caja calcula el cambio y no vende más de lo que hay", async ({ page }) => {
    await page.goto(`${RAIZ}/panel`)
    const buscar = page.getByPlaceholder(/Nombre o código/)
    await buscar.fill("martillo")
    await buscar.press("Enter")
    await page.getByLabel("Recibido").fill("50000")
    // Martillo 32.000, recibe 50.000.
    await expect(page.getByText("Cambio")).toBeVisible()
    await expect(page.locator("p", { hasText: "Cambio" })).toContainText("$ 18.000")
    await page.getByLabel("Cantidad de Martillo de uña 16 oz").fill("500")
    await expect(page.getByText(/Solo hay \d+ en inventario/)).toBeVisible()
    await expect(page.getByRole("button", { name: /^Cobrar \$/ })).toBeDisabled()
  })

  test("una entrada de mercancía sube las existencias y queda en el kardex", async ({ page }) => {
    const antes = await existencias(page, "Arandela 3/8\"")
    await page.goto(`${RAIZ}/panel/entradas`)
    await page.getByLabel("Número de factura").fill("A-5501")
    await page.getByLabel("Cantidad que llega de Arandela 3/8\"").fill("100")
    // Enter envía: en el celular emulado, el clic cae mientras el scroll suave se mueve.
    await page.getByLabel("Cantidad que llega de Arandela 3/8\"").press("Enter")
    await expect(page.getByText(/Entrada registrada: 1 productos/)).toBeVisible()
    expect(await existencias(page, "Arandela 3/8\"")).toBe(antes + 100)
    await page.getByRole("link", { name: "Arandela 3/8\"", exact: true }).click()
    await expect(page.getByRole("table")).toContainText("Entrada: factura A-5501")
  })

  test("el conteo físico registra la diferencia", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/inventario/martillo-16`)
    await page.getByLabel("¿Cuántas hay en el estante?").fill("5")
    await page.getByLabel("Motivo").fill("uno dañado")
    await page.getByLabel("Motivo").press("Enter")
    await expect(page.getByRole("status")).toContainText("Ajuste registrado")
    await expect(page.getByRole("table")).toContainText("Ajuste: uno dañado")
  })

  test("el precio cambiado en el inventario se ve en la página", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/inventario`)
    const precio = page.getByLabel("Precio de Cemento gris 50 kg")
    await precio.fill("35900")
    await precio.press("Enter")
    await page.goto(RAIZ)
    await page.getByRole("searchbox").fill("cemento")
    await expect(page.getByRole("listitem").filter({ hasText: "Cemento gris 50 kg" })).toContainText("$ 35.900")
  })

  test("el pedido sugerido solo existe en el sistema completo", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/reponer`)
    await expect(page.getByRole("heading", { name: "Tornillos del Norte" })).toBeVisible()
    await verComo(page, "gestion")
    await expect(page.getByText(/Esto entra en el plan Sistema completo/)).toBeVisible()
    await verComo(page, "catalogo")
    await page.goto(RAIZ)
    await page.getByRole("searchbox").fill("martillo")
    // Con el plan de catálogo la página dice si hay, no cuántos.
    await expect(page.getByRole("listitem").filter({ hasText: "Martillo" })).toContainText("Disponible")
  })

  test("portada, lista y panel cumplen WCAG A y AA", async ({ page }) => {
    await page.goto(RAIZ)
    await sinViolaciones(page, "la portada")
    await page.getByRole("button", { name: "Agregar Cinta de teflón a la lista" }).click()
    await page.goto(`${RAIZ}/lista`)
    await sinViolaciones(page, "la lista")
    for (const r of ["panel", "panel/pedidos", "panel/inventario", "panel/inventario/cemento-50", "panel/entradas", "panel/reportes", "panel/reponer"]) {
      await page.goto(`${RAIZ}/${r}`)
      await expect(page.locator("[aria-busy=true]")).toHaveCount(0)
      await sinViolaciones(page, r)
    }
  })

  test("en un celular de 360 px no hay desplazamiento lateral", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    for (const r of ["", "/lista", "/panel", "/panel/inventario", "/panel/reportes"]) {
      await page.goto(`${RAIZ}${r}`)
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(sobra, `desborde en ${r || "la portada"}`).toBeLessThanOrEqual(0)
    }
    await contexto.close()
  })
})
