import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Orilla, página cinematográfica. Los fotogramas vienen de R2: la
 * página nunca queda en reposo de red, así que se espera a `load`, no a
 * `networkidle`.
 */
const RAIZ = "/demo/orilla"

test.describe("demo Orilla", () => {
  test("carga, queda fuera del índice y recibe los fotogramas", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    // Los fotogramas llegan de R2: el canvas queda "contaminado" y no se pueden
    // leer sus píxeles, así que se comprueba que el primero se sirvió bien.
    const fotograma = page.waitForResponse((r) => /\/frames(-m)?\/acto1\/0001\.webp/.test(r.url()))
    const res = await page.goto(RAIZ, { waitUntil: "load" })
    expect(res?.status()).toBe(200)
    expect((await fotograma).status()).toBe(200)
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    // El cargador se va cuando la primera escena tiene lo mínimo para moverse.
    await expect(page.locator(".cargador.listo")).toHaveCount(1, { timeout: 20_000 })
    expect(errores).toEqual([])
  })

  test("el scroll avanza el video de cada escena", async ({ page }) => {
    await page.goto(RAIZ, { waitUntil: "load" })
    await expect(page.locator(".cargador.listo")).toHaveCount(1, { timeout: 20_000 })
    const tiempo = page.locator("#llegada [data-time]")
    await expect(tiempo).toHaveText(/^00:00/)
    await page.evaluate(() => {
      const s = document.querySelector<HTMLElement>("#llegada")!
      window.scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * 0.6)
    })
    await expect(tiempo).not.toHaveText(/^00:00/)
  })

  test("sin animaciones no descarga fotogramas", async ({ browser }) => {
    const contexto = await browser.newContext({ reducedMotion: "reduce" })
    const page = await contexto.newPage()
    const fotogramas: string[] = []
    page.on("request", (r) => {
      if (/\/frames(-m)?\/acto\d\/\d{4}\.webp/.test(r.url())) fotogramas.push(r.url())
    })
    await page.goto(RAIZ, { waitUntil: "load" })
    await expect(page.locator(".orilla.no-scrub")).toHaveCount(1)
    expect(fotogramas).toEqual([])
    await contexto.close()
  })

  test("la reserva abre el WhatsApp simulado", async ({ page }) => {
    await page.goto(RAIZ, { waitUntil: "load" })
    await page.getByRole("button", { name: "Consultar disponibilidad" }).click()
    await expect(page.getByRole("dialog")).toContainText("consultar disponibilidad en Orilla")
  })

  test("cumple WCAG A y AA", async ({ page }) => {
    await page.goto(RAIZ, { waitUntil: "load" })
    await expect(page.locator(".cargador.listo")).toHaveCount(1, { timeout: 20_000 })
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude("nextjs-portal")
      .analyze()
    expect(violations.map((v) => `${v.id}: ${v.nodes.length} nodo(s), ${v.help} | ${v.nodes[0]?.target.join(" ")}`)).toEqual([])
  })

  test("en un celular de 360 px no hay desplazamiento lateral", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    await page.goto(RAIZ, { waitUntil: "load" })
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    expect(sobra).toBeLessThanOrEqual(0)
    await contexto.close()
  })
})
