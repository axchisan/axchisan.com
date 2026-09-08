import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const RUTAS = ["/", "/trabajo", "/blog", "/servicios", "/sobre", "/contacto"]

test.describe("accesibilidad", () => {
  for (const ruta of RUTAS) {
    for (const tema of ["light", "dark"] as const) {
      test(`${ruta} cumple WCAG A y AA en tema ${tema}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema })
        await page.goto(ruta)
        await page.waitForLoadState("networkidle")

        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          // El overlay del servidor de desarrollo no forma parte del sitio.
          .exclude("nextjs-portal")
          .analyze()

        const resumen = violations.map(
          (v) => `${v.id} (${v.impact}) — ${v.nodes.length} nodo(s): ${v.help}`,
        )
        expect(resumen, `violaciones en ${ruta} (${tema})`).toEqual([])
      })
    }
  }

  test("el foco de teclado es visible y recorre la navegación", async ({ page }) => {
    await page.goto("/")

    // Cinco tabulaciones deben dejar el foco en algo interactivo y visible.
    for (let i = 0; i < 5; i++) await page.keyboard.press("Tab")

    const enfocado = page.locator(":focus")
    await expect(enfocado).toBeVisible()

    const contorno = await enfocado.evaluate((el) => {
      const s = getComputedStyle(el)
      return { ancho: s.outlineWidth, estilo: s.outlineStyle }
    })
    expect(contorno.estilo, "el elemento enfocado no dibuja contorno").not.toBe("none")
    expect(parseFloat(contorno.ancho), "contorno de foco sin grosor").toBeGreaterThan(0)
  })

  test("no hay desplazamiento horizontal en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })

    for (const ruta of RUTAS) {
      await page.goto(ruta)
      await page.waitForLoadState("networkidle")
      const desborda = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      )
      expect(desborda, `${ruta} desborda horizontalmente a 360px`).toBe(false)
    }
  })
})
