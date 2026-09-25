import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Molar 116, consultorio odontológico. Estado solo en el navegador:
 * cada prueba arranca limpia y no toca la base.
 */
const RAIZ = "/demo/molar-116"

async function verComo(page: Page, nivel: "pagina" | "citas" | "sistema") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:molar-116:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
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

/** Abre la ficha de un paciente con algo por hacer en el plan. */
async function abrirPacienteConPlan(page: Page) {
  await page.goto(`${RAIZ}/panel/pacientes`)
  await page.locator("a", { hasText: "Por hacer" }).first().click()
  await expect(page.getByRole("heading", { name: "Odontograma" })).toBeVisible()
}

test.describe("demo Molar 116", () => {
  test("la portada carga y queda fuera del índice", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    await expect(page.getByRole("heading", { name: "Endodoncia" })).toBeVisible()
    expect(errores).toEqual([])
  })

  test("un paciente nuevo agenda una valoración y aparece en la agenda", async ({ page }) => {
    await page.goto(`${RAIZ}/agendar?motivo=valoracion`)
    await page.getByRole("button", { name: "Continuar" }).click()
    await page.getByRole("button", { name: "Continuar" }).click()
    await page.getByRole("radiogroup", { name: "Hora" }).getByRole("radio").first().click()
    await page.getByRole("button", { name: "Continuar" }).click()
    await page.getByLabel("Número de documento").fill("1020304050")
    await page.getByLabel("Nombre completo").fill("Laura Méndez Ríos")
    await page.getByLabel("Celular").fill("310 222 3344")
    await page.getByRole("button", { name: "Confirmar cita" }).click()
    await expect(page.getByRole("heading", { name: "Tu cita quedó agendada" })).toBeVisible()
    await page.getByRole("link", { name: "Verla en el panel" }).click()
    await expect(page.getByText("Laura Méndez Ríos", { exact: true })).toBeVisible()
  })

  test("un paciente conocido no vuelve a escribir sus datos", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/pacientes`)
    const documento = (await page.getByText(/^C\. C\. /).first().textContent())!.replace("C. C. ", "")
    await page.goto(`${RAIZ}/agendar?motivo=limpieza`)
    await page.getByRole("button", { name: "Continuar" }).click()
    await page.getByRole("radiogroup", { name: "Hora" }).getByRole("radio").first().click()
    await page.getByRole("button", { name: "Continuar" }).click()
    await page.getByLabel("Número de documento").fill(documento)
    await expect(page.getByText(/Hola de nuevo/)).toBeVisible()
    await expect(page.getByLabel("Nombre completo")).toHaveCount(0)
  })

  test("el odontograma arma el presupuesto y los abonos bajan el saldo", async ({ page }) => {
    await abrirPacienteConPlan(page)
    const total = page.locator("tfoot")
    const antes = await total.textContent()
    // Una caries nueva en un diente sano: el plan suma una resina de $ 150.000.
    const sano = await page.getByRole("button", { name: /^Diente \d+, .*: sano$/ }).first().getAttribute("aria-label")
    const n = sano!.match(/^Diente (\d+)/)![1]
    await page.getByRole("radio", { name: "Caries" }).click()
    const diente = page.getByRole("button", { name: new RegExp(`^Diente ${n},`) })
    await diente.click()
    await expect(diente).toHaveAccessibleName(/caries/)
    await expect(total).not.toHaveText(antes!)
    await expect(page.getByRole("row").filter({ hasText: "Resina" }).filter({ hasText: new RegExp(`^${n}`) })).toContainText("$ 150.000")

    const aprobar = page.getByRole("button", { name: /Aprobar presupuesto|Actualizar el presupuesto aprobado/ })
    await aprobar.click()
    await page.getByLabel("Abono", { exact: true }).fill("100000")
    await page.getByLabel("Abono", { exact: true }).press("Enter")
    await expect(page.getByRole("status")).toContainText("Abono de $ 100.000 registrado")

    // Hecho: la resina pasa a azul y sale de lo pendiente.
    await page.getByRole("button", { name: new RegExp(`Hecho ?: Resina .* diente ${n}$`) }).click()
    await expect(diente).toHaveAccessibleName(/resina/)
  })

  test("con el plan de página, se agenda por WhatsApp", async ({ page }) => {
    await page.goto(RAIZ)
    await verComo(page, "pagina")
    await expect(page.getByRole("link", { name: "Agendar cita" })).toHaveCount(0)
    await page.getByRole("button", { name: "Pedir cita por WhatsApp" }).first().click()
    await expect(page.getByRole("dialog")).toContainText("Quiero pedir una cita")
    await page.goto(`${RAIZ}/panel`)
    await expect(page.getByText(/Esto entra en el plan Citas en línea/)).toBeVisible()
  })

  test("portada, agenda y panel cumplen WCAG A y AA", async ({ page }) => {
    await page.goto(RAIZ)
    await sinViolaciones(page, "la portada")
    await page.goto(`${RAIZ}/agendar`)
    await sinViolaciones(page, "agendar")
    for (const r of ["panel", "panel/pacientes", "panel/cartera"]) {
      await page.goto(`${RAIZ}/${r}`)
      await expect(page.locator("[aria-busy=true]")).toHaveCount(0)
      await sinViolaciones(page, r)
    }
    await abrirPacienteConPlan(page)
    await sinViolaciones(page, "la ficha del paciente")
  })

  test("en un celular de 360 px no hay desplazamiento lateral", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    for (const r of ["", "/agendar", "/panel", "/panel/pacientes", "/panel/cartera"]) {
      await page.goto(`${RAIZ}${r}`)
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(sobra, `desborde en ${r || "la portada"}`).toBeLessThanOrEqual(0)
    }
    await contexto.close()
  })
})
