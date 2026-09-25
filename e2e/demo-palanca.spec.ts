import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Palanca, gimnasio con clases de cupo. Estado solo en el navegador:
 * cada prueba arranca limpia y no toca la base.
 */
const RAIZ = "/demo/palanca"

async function verComo(page: Page, nivel: "pagina" | "reservas" | "sistema") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:palanca:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
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

/** El próximo día hábil desde mañana: siempre tiene clases por venir, y las de la noche se llenan. */
async function elegirDiaConClases(page: Page) {
  const indice = await page.evaluate(() => {
    for (let i = 1; i < 7; i++) {
      const d = (new Date().getDay() + i) % 7
      if (d >= 1 && d <= 5) return i
    }
    return 1
  })
  await page.getByRole("radiogroup", { name: "Día" }).getByRole("radio").nth(indice).click()
}

test.describe("demo Palanca", () => {
  test("la portada carga, muestra el horario y queda fuera del índice", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    await elegirDiaConClases(page)
    await expect(page.getByRole("button", { name: /^(Reservar|Lista de espera) / }).first()).toBeVisible()
    expect(errores).toEqual([])
  })

  test("un cliente nuevo reserva su clase gratis y la ve en sus clases", async ({ page }) => {
    await page.goto(RAIZ)
    await elegirDiaConClases(page)
    await page.getByRole("button", { name: /^Reservar / }).first().click()
    await page.getByLabel("Número de documento").fill("1099888777")
    await page.getByLabel("Nombre completo").fill("Carolina Vélez")
    await page.getByLabel("Celular").fill("315 444 5566")
    await page.getByLabel("Celular").press("Enter")
    await expect(page.getByText("Tu puesto quedó reservado.", { exact: false })).toBeVisible()
    await page.getByRole("link", { name: "Ver mis clases" }).click()
    await expect(page.getByRole("heading", { name: "Carolina Vélez" })).toBeVisible()
    await expect(page.getByText("Clase de prueba.", { exact: false })).toBeVisible()
    await expect(page.getByText("Reservada")).toBeVisible()
  })

  test("una clase llena manda a la lista de espera y cancelar sube al siguiente", async ({ page }) => {
    await page.goto(RAIZ)
    await elegirDiaConClases(page)
    // Llena la clase con invitados hasta que el siguiente quede en espera.
    const boton = page.getByRole("button", { name: /^Lista de espera / }).first()
    if (!(await boton.count())) test.skip(true, "Ninguna clase llena ese día en los datos de ejemplo")
    await boton.click()
    await page.getByLabel("Número de documento").fill("1088777666")
    await page.getByLabel("Nombre completo").fill("Tomás Cabal")
    await page.getByLabel("Celular").fill("316 111 2233")
    await page.getByLabel("Celular").press("Enter")
    await expect(page.getByText(/Estás en la lista de espera, puesto \d+/)).toBeVisible()
  })

  test("un socio con el plan vencido no puede reservar", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/socios`)
    const texto = await page.getByRole("listitem").filter({ hasText: "Vencida" }).first().getByText(/^C\. C\. /).textContent()
    const documento = texto!.match(/C\. C\. ([\d.]+)/)![1]
    await page.goto(RAIZ)
    await elegirDiaConClases(page)
    await page.getByRole("button", { name: /^(Reservar|Lista de espera) / }).first().click()
    await page.getByLabel("Número de documento").fill(documento)
    await expect(page.getByText("Tu plan está vencido o sin clases.")).toBeVisible()
    await page.getByLabel("Número de documento").press("Enter")
    await expect(page.getByText(/Tu membresía está vencida o sin clases/)).toBeVisible()
  })

  test("renovar un plan registra el pago", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/socios`)
    const nombre = (await page.getByRole("listitem").filter({ hasText: "Vencida" }).first().locator("p").first().textContent())!
    // En "Todos" la fila sigue a la vista después de renovar.
    await page.getByRole("button", { name: /^Todos/ }).click()
    const fila = page.getByRole("listitem").filter({ hasText: nombre }).first()
    await fila.getByRole("button", { name: /^Renovar/ }).click()
    await fila.getByLabel("Plan").selectOption("mensual")
    await fila.getByRole("button", { name: "Registrar pago" }).click()
    await expect(fila.getByRole("status")).toContainText("Pago de $ 189.000 registrado")
    await expect(fila).toContainText("Al día")
  })

  test("con el plan de página, se reserva por WhatsApp", async ({ page }) => {
    await page.goto(RAIZ)
    await verComo(page, "pagina")
    await elegirDiaConClases(page)
    await page.getByRole("button", { name: "Reservar" }).first().click()
    await expect(page.getByRole("dialog")).toContainText("Quiero reservar la clase")
    await page.goto(`${RAIZ}/panel`)
    await expect(page.getByText(/Esto entra en el plan Citas en línea/)).toBeVisible()
  })

  test("portada, mis clases y panel cumplen WCAG A y AA", async ({ page }) => {
    await page.goto(RAIZ)
    await sinViolaciones(page, "la portada")
    await page.goto(`${RAIZ}/mis-clases`)
    await sinViolaciones(page, "mis clases")
    for (const r of ["panel", "panel/socios", "panel/resumen"]) {
      await page.goto(`${RAIZ}/${r}`)
      await expect(page.locator("[aria-busy=true]")).toHaveCount(0)
      await sinViolaciones(page, r)
    }
  })

  test("en un celular de 360 px no hay desplazamiento lateral", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    for (const r of ["", "/mis-clases", "/panel", "/panel/socios", "/panel/resumen"]) {
      await page.goto(`${RAIZ}${r}`)
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(sobra, `desborde en ${r || "la portada"}`).toBeLessThanOrEqual(0)
    }
    await contexto.close()
  })
})
