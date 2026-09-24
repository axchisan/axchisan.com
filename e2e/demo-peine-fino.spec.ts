import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Peine Fino, salón y barbería. Estado solo en el navegador: cada
 * prueba arranca limpia y no toca la base.
 */
const RAIZ = "/demo/peine-fino"

async function verComo(page: Page, nivel: "pagina" | "citas" | "sistema") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:peine-fino:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
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

test.describe("demo Peine Fino", () => {
  test("la portada carga, muestra el tablero y queda fuera del índice", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    await expect(page.getByText("Balayage o mechas")).toBeVisible()
    expect(errores).toEqual([])
  })

  test("un cliente conocido reserva corte y barba con su barbero", async ({ page }) => {
    await page.goto(`${RAIZ}/reservar?servicios=corte-hombre,barba`)
    await expect(page.getByRole("complementary").getByText("1 h")).toBeVisible()
    await page.getByRole("button", { name: "Continuar" }).click()

    // Solo aparecen quienes hacen los dos servicios.
    await expect(page.getByRole("radio", { name: /Karen/ })).toHaveCount(0)
    await page.getByRole("radio", { name: /Mateo Ruiz/ }).click()
    await page.getByRole("button", { name: "Continuar" }).click()

    await page.getByRole("radiogroup", { name: "Hora" }).getByRole("radio").first().click()
    await page.getByRole("button", { name: "Continuar" }).click()
    await page.getByLabel("Tu celular").fill("301 000 1029")
    await expect(page.getByText(/Hola de nuevo/)).toBeVisible()
    await page.getByRole("button", { name: "Confirmar reserva" }).click()

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Listo")
    await expect(page.getByText(/con Mateo Ruiz/)).toBeVisible()
  })

  test("servicios que hacen personas distintas no se pueden reservar juntos", async ({ page }) => {
    await page.goto(`${RAIZ}/reservar?servicios=corte-hombre,manicure`)
    await page.getByRole("button", { name: "Continuar" }).click()
    // Por texto y no por rol: el anunciador de rutas de Next también es un "alert".
    await expect(page.getByText(/los hacen personas distintas/)).toBeVisible()
  })

  test("con el plan Página se reserva por WhatsApp y el panel queda bloqueado", async ({ page }) => {
    await page.goto(RAIZ)
    await verComo(page, "pagina")
    await expect(page.getByRole("button", { name: "Reservar por WhatsApp" }).first()).toBeVisible()
    await page.goto(`${RAIZ}/panel/caja`)
    await expect(page.getByText(/Esto entra en el plan/)).toBeVisible()
  })

  test("cobrar un servicio lo pasa al cierre y a las comisiones", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/caja`)
    const porCobrar = page.getByRole("heading", { name: /Por cobrar hoy/ })
    const antes = Number((await porCobrar.innerText()).match(/\((\d+)\)/)?.[1] ?? 0)
    test.skip(antes === 0, "hoy no quedan servicios por cobrar")

    await page.getByRole("button", { name: "Cobrar", exact: true }).first().click()
    const dialogo = page.getByRole("dialog")
    await dialogo.getByRole("button", { name: "Nequi" }).click()
    await dialogo.getByRole("button", { name: "$ 5.000" }).click()
    await dialogo.getByRole("button", { name: /Registrar pago/ }).click()
    await expect(porCobrar).toContainText(`(${antes - 1})`)
  })

  test("la ficha guarda una fórmula de color nueva", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/clientes/c1`)
    await page.getByLabel("Nueva fórmula").fill("Raíz 7.1 con oxidante 20 vol, 35 min. Prueba de la suite.")
    await page.getByRole("button", { name: "Guardar fórmula" }).click()
    await expect(page.getByText("Prueba de la suite.")).toBeVisible()
  })

  test("un cliente que no vuelve queda marcado al escribirle", async ({ page }) => {
    await page.goto(`${RAIZ}/panel/volver`)
    await page.getByRole("button", { name: "Escribir" }).first().click()
    await expect(page.getByRole("dialog")).toContainText("hace rato no te vemos")
    await page.getByRole("button", { name: "Marcar como escrito" }).click()
    await expect(page.getByText("Escrito hoy").first()).toBeVisible()
  })

  test("cumple WCAG AA en portada, reserva y panel", async ({ page }) => {
    for (const ruta of ["", "/reservar", "/panel", "/panel/caja", "/panel/clientes", "/panel/clientes/c1", "/panel/volver"]) {
      await page.goto(`${RAIZ}${ruta}`)
      await page.waitForLoadState("networkidle")
      await sinViolaciones(page, ruta || "portada")
    }
  })

  test("nada desborda a 360 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    for (const ruta of ["", "/reservar", "/panel", "/panel/caja", "/panel/clientes", "/panel/clientes/c1", "/panel/volver"]) {
      await page.goto(`${RAIZ}${ruta}`)
      await page.waitForLoadState("networkidle")
      const desborda = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
      expect(desborda, `${RAIZ}${ruta} desborda a 360 px`).toBe(false)
    }
  })
})
