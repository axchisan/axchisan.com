import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Fogón 45, restaurante. Estado solo en el navegador: cada prueba
 * arranca limpia y no toca la base.
 */
const RAIZ = "/demo/fogon-45"

async function verComo(page: Page, nivel: "carta" | "pedidos" | "sistema") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:fogon-45:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
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

async function agregar(page: Page, plato: string, opcion?: string) {
  await page.getByRole("button", { name: `Agregar ${plato}` }).click()
  const dialogo = page.getByRole("dialog")
  await expect(dialogo).toBeVisible()
  if (opcion) await dialogo.getByRole("radio", { name: opcion }).check()
  await dialogo.getByRole("button", { name: /Agregar por/ }).click()
  await expect(dialogo).toHaveCount(0)
}

test.describe("demo Fogón 45", () => {
  test("la portada carga, muestra la carta y queda fuera del índice", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    await expect(page.getByRole("heading", { name: "Ajiaco santafereño" })).toBeVisible()
    expect(errores).toEqual([])
  })

  test("un domicilio se pide, llega a la cocina y el cliente lo ve avanzar", async ({ page }) => {
    await page.goto(RAIZ)
    await agregar(page, "Churrasco de 400 gramos", "Yuca frita")
    await agregar(page, "Limonada", "De coco")
    await page.goto(`${RAIZ}/pedir`)

    // Sin datos no se envía.
    await page.getByRole("button", { name: /Enviar pedido/ }).click()
    await expect(page.getByText("Revisa los datos marcados antes de enviar.")).toBeVisible()

    await page.getByLabel("Barrio").selectOption({ label: "Teusaquillo, domicilio $ 5.000" })
    await page.getByLabel("Dirección").fill("Carrera 19 # 40-12, apto 201")
    await page.getByLabel("Nombre").fill("Laura Gómez")
    await page.getByLabel("Celular").fill("300 123 4567")
    // Churrasco 52.000 + limonada de coco 12.000 + domicilio 5.000.
    await expect(page.getByRole("complementary", { name: "Resumen del pedido" })).toContainText("$ 69.000")
    await page.getByRole("button", { name: /Enviar pedido/ }).click()

    await expect(page).toHaveURL(/\/pedido\/p\d+/)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Recibimos tu pedido")
    const numero = (await page.getByText(/^Pedido #\d+$/).textContent())!.replace(/\D/g, "")
    const seguimiento = page.url()

    await page.goto(`${RAIZ}/panel/cocina`)
    const comanda = page.getByRole("article", { name: `Pedido ${numero}` })
    await expect(comanda).toContainText("Domicilio a Teusaquillo")
    await expect(comanda).toContainText("Yuca frita")
    await comanda.getByRole("button", { name: `Empezar el pedido ${numero}` }).click()

    await page.goto(seguimiento)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tu pedido está en el fogón")
  })

  test("el QR de la mesa lleva el pedido a esa mesa", async ({ page }) => {
    await page.goto(`${RAIZ}?mesa=7`)
    await expect(page.getByText("Estás en la mesa 7.")).toBeVisible()
    await agregar(page, "Bandeja 45")
    await page.goto(`${RAIZ}/pedir`)
    await expect(page.getByRole("radio", { name: /En la mesa/ })).toBeChecked()
    await expect(page.getByLabel("Tu mesa")).toHaveValue("7")
    await page.getByRole("button", { name: /Enviar pedido/ }).click()
    await expect(page.getByText("Te lo llevamos a la mesa 7.")).toBeVisible()
  })

  test("lo que se cambia en el panel se ve en la carta", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/carta`)
    await page.getByRole("switch", { name: /Mojarra frita/ }).click()
    const precio = page.getByLabel("Precio de Ajiaco santafereño")
    await precio.fill("35000")
    await precio.press("Enter")
    await expect(page.getByText("Antes $ 32.000")).toBeVisible()

    await page.goto(RAIZ)
    await expect(page.getByRole("button", { name: "Agregar Mojarra frita" })).toHaveCount(0)
    const fila = page.locator("li").filter({ has: page.getByRole("heading", { name: "Ajiaco santafereño" }) })
    await expect(fila).toContainText("$ 35.000")
  })

  test("con el plan Carta digital no se pide en línea", async ({ page }) => {
    await page.goto(RAIZ)
    await verComo(page, "carta")
    await expect(page.getByRole("button", { name: /^Agregar / })).toHaveCount(0)
    await expect(page.getByRole("button", { name: "Pedir por WhatsApp" }).first()).toBeVisible()
    await page.goto(`${RAIZ}/pedir`)
    await expect(page.getByText(/Esto entra en el plan Catálogo con pedidos por WhatsApp/)).toBeVisible()
  })

  test("una reserva en línea aparece en el panel", async ({ page }) => {
    await page.goto(`${RAIZ}/reservar`)
    // Las horas son etiquetas con el radio oculto: se toca la etiqueta, como en el celular.
    await page.getByRole("radiogroup", { name: "Hora" }).locator("label").first().click()
    await expect(page.getByRole("radiogroup", { name: "Hora" }).getByRole("radio").first()).toBeChecked()
    await page.getByLabel("Personas").selectOption("4")
    await page.getByLabel("Nombre").fill("Tatiana Ruiz")
    await page.getByLabel("Celular").fill("311 555 0101")
    // Enter envía el formulario. Un clic en el botón falla en el celular
    // emulado: el scroll suave del sitio aún se mueve cuando Playwright hace clic.
    await page.getByLabel("Celular").press("Enter")
    await expect(page.getByRole("heading", { name: "Mesa reservada" })).toBeVisible()
    await page.getByRole("link", { name: "Verla en el panel" }).click()
    await expect(page.getByText("Tatiana Ruiz, 4 personas")).toBeVisible()
  })

  test("portada, pedido y panel cumplen WCAG A y AA", async ({ page }) => {
    await page.goto(RAIZ)
    await sinViolaciones(page, "la portada")
    await agregar(page, "Punta de anca al carbón")
    await page.goto(`${RAIZ}/pedir`)
    await sinViolaciones(page, "el pedido")
    for (const r of ["panel", "panel/cocina", "panel/carta", "panel/mesas", "panel/reservas", "panel/ventas", "reservar"]) {
      await page.goto(`${RAIZ}/${r}`)
      await expect(page.locator("[aria-busy=true]")).toHaveCount(0)
      await sinViolaciones(page, r)
    }
  })

  test("en un celular de 360 px no hay desplazamiento lateral", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    for (const r of ["", "/pedir", "/panel/cocina", "/panel/carta"]) {
      await page.goto(`${RAIZ}${r}`)
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(sobra, `desborde en ${r || "la portada"}`).toBeLessThanOrEqual(0)
    }
    await contexto.close()
  })
})
