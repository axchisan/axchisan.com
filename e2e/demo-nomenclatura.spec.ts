import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Nomenclatura, inmobiliaria. Estado solo en el navegador: cada prueba
 * arranca limpia y no toca la base.
 */
const RAIZ = "/demo/nomenclatura"

async function verComo(page: Page, nivel: "pagina" | "panel" | "sistema") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:nomenclatura:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
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

test.describe("demo Nomenclatura", () => {
  test("la portada busca y los filtros quedan en el enlace", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    await page.getByRole("radio", { name: "Arrendar" }).click()
    await page.getByLabel("Zona").selectOption("Belén")
    await page.getByRole("button", { name: "Buscar" }).click()
    await expect(page).toHaveURL(/operacion=arriendo/)
    await expect(page).toHaveURL(/zona=Bel/)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Inmuebles en arriendo en Belén")
    await expect(page.locator("main p[aria-live]")).toHaveText("2 inmuebles")
    // El enlace compartido abre la misma búsqueda.
    await page.reload()
    await expect(page.locator("main p[aria-live]")).toHaveText("2 inmuebles")
    expect(errores).toEqual([])
  })

  test("el simulador calcula la cuota del crédito", async ({ page }) => {
    await page.goto(`${RAIZ}/inmuebles/envigado-cocina`)
    const cuota = page.getByText("Cuota mensual aproximada").locator("..").locator("dd")
    const antes = await cuota.textContent()
    await page.getByLabel(/Plazo/).fill("30")
    await expect(cuota).not.toHaveText(antes!)
  })

  test("una visita agendada llega a la agenda y a los interesados", async ({ page }) => {
    await page.goto(`${RAIZ}/inmuebles/envigado-cocina`)
    await page.getByRole("radiogroup", { name: "Hora de la visita" }).getByRole("radio").first().click()
    await page.getByLabel("Nombre").fill("Sara Mejía Tobón")
    await page.getByLabel("Celular").fill("300 777 8899")
    await page.getByLabel("Celular").press("Enter")
    await expect(page.getByText("Visita agendada")).toBeVisible()
    await page.goto(`${RAIZ}/panel/visitas`)
    await expect(page.getByText("Sara Mejía Tobón", { exact: true })).toBeVisible()
    await page.goto(`${RAIZ}/panel/interesados`)
    await expect(page.getByRole("listitem").filter({ hasText: "Sara Mejía Tobón" })).toContainText("Página")
  })

  test("un inmueble marcado como arrendado deja de ofrecer visitas", async ({ page }) => {
    await page.goto(`${RAIZ}/panel`)
    await page.getByLabel("Estado de Apartamento familiar en Sabaneta").selectOption("cerrado")
    await page.goto(`${RAIZ}/inmuebles/sabaneta-familiar`)
    await expect(page.getByText("Este inmueble ya se arrendó.")).toBeVisible()
    await expect(page.getByRole("button", { name: "Agendar visita" })).toHaveCount(0)
  })

  test("con la página sola, el contacto es por WhatsApp", async ({ page }) => {
    await page.goto(`${RAIZ}/inmuebles/laureles-balcon`)
    await verComo(page, "pagina")
    await page.getByRole("button", { name: "Preguntar por WhatsApp" }).click()
    await expect(page.getByRole("dialog")).toContainText("Me interesa el inmueble")
    await page.goto(`${RAIZ}/panel`)
    await expect(page.getByText(/Esto entra en el plan Sitio con panel/)).toBeVisible()
  })

  test("portada, listado, ficha y panel cumplen WCAG A y AA", async ({ page }) => {
    for (const r of ["", "/inmuebles", "/inmuebles/poblado-vista", "/inmuebles/belen-arriendo", "/panel", "/panel/interesados", "/panel/visitas"]) {
      await page.goto(`${RAIZ}${r}`)
      await expect(page.locator("[aria-busy=true]")).toHaveCount(0)
      await sinViolaciones(page, r || "la portada")
    }
  })

  test("en un celular de 360 px no hay desplazamiento lateral", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    for (const r of ["", "/inmuebles", "/inmuebles/poblado-vista", "/panel", "/panel/interesados"]) {
      await page.goto(`${RAIZ}${r}`)
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(sobra, `desborde en ${r || "la portada"}`).toBeLessThanOrEqual(0)
    }
    await contexto.close()
  })
})
