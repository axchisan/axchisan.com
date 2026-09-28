import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Rojas & Duarte, abogados y contadores. Navegable: los formularios
 * validan y el envío se simula, sin tocar la base.
 */
const RAIZ = "/demo/rojas-duarte"

async function verComo(page: Page, nivel: "presencia" | "profesional") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:rojas-duarte:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
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

test.describe("demo Rojas & Duarte", () => {
  test("la portada lleva a cada área y dice si está abierto", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    // Martes a las 10 de la mañana: abierto.
    await page.clock.install({ time: new Date(2026, 8, 29, 10, 0) })
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    await expect(page.getByText("Abierto, hasta las 6:00 p. m.")).toBeVisible()
    await page.getByRole("link", { name: /Familia y sucesiones/ }).first().click()
    await expect(page).toHaveURL(`${RAIZ}/areas/familia`)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Familia y sucesiones")
    expect(errores).toEqual([])
  })

  test("un domingo dice cuándo abre", async ({ page }) => {
    await page.clock.install({ time: new Date(2026, 9, 4, 15, 0) })
    await page.goto(RAIZ)
    await expect(page.getByText("Cerrado. Abre mañana a las 8:00 a. m.")).toBeVisible()
  })

  test("la lista de documentos se marca", async ({ page }) => {
    await page.goto(`${RAIZ}/areas/impuestos`)
    await expect(page.getByText("0 de 5 listos")).toBeVisible()
    await page.getByText("Certificado de ingresos y retenciones").click()
    await expect(page.getByText("1 de 5 listos")).toBeVisible()
  })

  test("la liquidación suma cada rubro con la indemnización", async ({ page }) => {
    await page.goto(`${RAIZ}/herramientas/liquidacion`)
    await page.getByRole("button", { name: "Calcular la liquidación" }).click()
    await expect(page.getByText("Escriba el salario mensual, sin centavos.")).toBeVisible()
    await expect(page.getByLabel("Salario mensual")).toBeFocused()

    await page.getByLabel("Salario mensual").fill("2500000")
    await expect(page.getByLabel("Salario mensual")).toHaveValue("2.500.000")
    await page.getByLabel("Fecha de ingreso").fill("2023-03-15")
    await page.getByLabel("Fecha de retiro").fill("2026-09-30")
    await page.getByRole("radio", { name: "Me despidieron sin justa causa" }).check()
    await page.getByRole("button", { name: "Calcular la liquidación" }).click()
    await expect(page.locator("[data-total]")).toHaveText(/10\.355\.956/)
    await expect(page.getByRole("row", { name: /Indemnización/ })).toContainText("81")

    // Renunciando no hay indemnización.
    await page.getByRole("radio", { name: "Renuncié" }).check()
    await page.getByRole("button", { name: "Calcular la liquidación" }).click()
    await expect(page.getByRole("row", { name: /Indemnización/ })).toHaveCount(0)
  })

  test("el verificador de renta da el motivo", async ({ page }) => {
    await page.goto(`${RAIZ}/herramientas/renta`)
    await page.getByLabel(/Ingresos brutos/).fill("60000000")
    await page.getByRole("button", { name: "Revisar si tengo que declarar" }).click()
    await expect(page.getByRole("heading", { name: "No está obligado a declarar" })).toBeVisible()
    // El tope de ingresos es 1.400 UVT de 2025: $ 69.718.600.
    await page.getByLabel(/Ingresos brutos/).fill("69718600")
    await page.getByRole("button", { name: "Revisar si tengo que declarar" }).click()
    await expect(page.getByRole("heading", { name: "Sí tiene que declarar renta" })).toBeVisible()
    await expect(page.getByText(/69\.718\.600\spasa el tope/)).toBeVisible()
  })

  test("la consulta valida, llega con radicado y con el correo de la firma", async ({ page }) => {
    await page.goto(`${RAIZ}/consulta?area=laboral`)
    await expect(page.getByLabel("Área")).toHaveValue("laboral")
    await page.getByRole("button", { name: "Enviar la consulta" }).press("Enter")
    await expect(page.getByText("Faltan 5 datos")).toBeVisible()

    await page.getByLabel("Su caso").fill("Me despidieron la semana pasada y no me pagaron la prima ni las vacaciones.")
    await page.getByLabel("Nombre y apellido").fill("Jorge Iván Castro")
    await page.getByRole("textbox", { name: "Celular" }).fill("12345")
    await page.getByLabel("Correo").fill("jorge@correo.com")
    await page.getByLabel(/Autorizo/).check()
    await page.getByRole("button", { name: "Enviar la consulta" }).press("Enter")
    await expect(page.getByText("Falta un dato")).toBeVisible()
    await expect(page.getByText("Escriba un celular de diez dígitos que empiece por 3.")).toBeVisible()

    await page.getByRole("textbox", { name: "Celular" }).fill("+57 311 222 3344")
    await page.getByRole("button", { name: "Enviar la consulta" }).press("Enter")
    await expect(page.getByRole("heading", { name: "Recibimos su consulta, Jorge" })).toBeVisible()
    await expect(page.getByText(/RD-\d{6}-\d{4}/).first()).toBeVisible()
    const correo = page.getByRole("region", { name: "Así le llega a la firma" })
    await expect(correo).toContainText("Derecho laboral, persona")
    await expect(correo).toContainText("311 222 3344")
    await expect(correo).toContainText("Asignada a Laura Rojas Pineda")
  })

  test("con la página de presencia, el contacto es por WhatsApp", async ({ page }) => {
    await page.goto(RAIZ)
    await verComo(page, "presencia")
    await page.getByRole("button", { name: "Escribir por WhatsApp" }).first().click()
    await expect(page.getByRole("dialog")).toContainText("Quiero agendar una consulta")
    await page.goto(`${RAIZ}/herramientas/liquidacion`)
    await expect(page.getByText(/Esto entra en el plan Página profesional/)).toBeVisible()
  })

  test("portada, área, calculadoras y consulta cumplen WCAG A y AA", async ({ page }) => {
    for (const r of ["", "/areas/laboral", "/herramientas/liquidacion", "/herramientas/renta", "/consulta"]) {
      await page.goto(`${RAIZ}${r}`)
      await sinViolaciones(page, r || "la portada")
    }
    // También con los errores y el resultado a la vista.
    await page.getByRole("button", { name: "Enviar la consulta" }).press("Enter")
    await sinViolaciones(page, "la consulta con errores")
    await page.goto(`${RAIZ}/herramientas/liquidacion`)
    await page.getByLabel("Salario mensual").fill("3000000")
    await page.getByLabel("Fecha de ingreso").fill("2025-02-01")
    await page.getByLabel("Fecha de retiro").fill("2026-08-15")
    await page.getByRole("button", { name: "Calcular la liquidación" }).press("Enter")
    await expect(page.locator("[data-total]")).toBeVisible()
    await sinViolaciones(page, "la liquidación calculada")
  })

  test("en un celular de 360 px no hay desplazamiento lateral", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    for (const r of ["", "/areas/empresas", "/herramientas/liquidacion", "/herramientas/renta", "/consulta"]) {
      await page.goto(`${RAIZ}${r}`)
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(sobra, `desborde en ${r || "la portada"}`).toBeLessThanOrEqual(0)
    }
    await contexto.close()
  })
})
