import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Brisas del Mar, página cinematográfica. Los videos llegan de R2 después
 * del evento `load`: se espera a `load`, no a `networkidle`.
 */
const RAIZ = "/demo/brisas-del-mar"

test.describe("demo Brisas del Mar", () => {
  test("carga, queda fuera del índice y recibe el video de la primera escena", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const video = page.waitForResponse((r) => /\/video\/acto1-[dm]\.mp4$/.test(r.url()))
    const res = await page.goto(RAIZ, { waitUntil: "load" })
    expect(res?.status()).toBe(200)
    expect((await video).status()).toBe(200)
    // Se descargó con fetch (CORS de R2) y quedó listo para moverse.
    await expect(page.locator("#llegada.video-listo")).toHaveCount(1, { timeout: 30_000 })
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
    // Y el video salta al instante que corresponde.
    await expect(page.locator("#llegada.video-listo")).toHaveCount(1, { timeout: 30_000 })
    await expect.poll(() => page.locator("#llegada video").evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(3)
  })

  test("en el celular carga el video vertical", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    const page = await contexto.newPage()
    const video = page.waitForResponse((r) => /\/video\/acto1-m\.mp4$/.test(r.url()))
    await page.goto(RAIZ, { waitUntil: "load" })
    expect((await video).status()).toBe(200)
    await contexto.close()
  })

  test("sin animaciones no descarga videos", async ({ browser }) => {
    const contexto = await browser.newContext({ reducedMotion: "reduce" })
    const page = await contexto.newPage()
    const videos: string[] = []
    page.on("request", (r) => {
      if (/\.mp4$/.test(r.url())) videos.push(r.url())
    })
    await page.goto(RAIZ, { waitUntil: "load" })
    await expect(page.locator(".orilla.no-scrub")).toHaveCount(1)
    await page.waitForTimeout(1500)
    expect(videos).toEqual([])
    await contexto.close()
  })

  test("la reserva abre el WhatsApp simulado", async ({ page }) => {
    await page.goto(RAIZ, { waitUntil: "load" })
    await page.getByRole("button", { name: "Consultar disponibilidad" }).click()
    await expect(page.getByRole("dialog")).toContainText("consultar disponibilidad en Brisas del Mar")
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
