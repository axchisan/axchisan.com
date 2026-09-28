import { chromium } from "@playwright/test"
const [,, url, movil] = process.argv
const b = await chromium.launch({ headless: false, args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist"] })
const ctx = await b.newContext(movil ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
const t0 = Date.now()
await p.goto(url, { waitUntil: "load", timeout: 120000 })
const carga = Date.now() - t0
// Deja cargar los fotogramas/vídeos un rato, como haría un visitante.
await p.waitForTimeout(12000)
const r = await p.evaluate(async () => {
  const largas = []
  new PerformanceObserver((l) => l.getEntries().forEach((e) => largas.push(e.duration))).observe({ type: "longtask", buffered: false })
  const inicio = document.querySelector("[data-scrub]").getBoundingClientRect().top + scrollY
  const fin = inicio + document.querySelector("[data-scrub]").offsetHeight * 2.2
  const deltas = []
  await new Promise((ok) => {
    const dur = 8000, t = performance.now()
    let ant = t
    const paso = (ahora) => {
      deltas.push(ahora - ant); ant = ahora
      const k = Math.min(1, (ahora - t) / dur)
      scrollTo(0, inicio + (fin - inicio) * k)
      k < 1 ? requestAnimationFrame(paso) : ok()
    }
    requestAnimationFrame(paso)
  })
  deltas.shift()
  deltas.sort((a, b) => a - b)
  const bytes = performance.getEntriesByType("resource").reduce((t, e) => t + (e.transferSize || e.encodedBodySize || 0), 0)
  return {
    cuadros: deltas.length,
    p50: +deltas[Math.floor(deltas.length * 0.5)].toFixed(1),
    p95: +deltas[Math.floor(deltas.length * 0.95)].toFixed(1),
    max: +deltas.at(-1).toFixed(1),
    trabados: deltas.filter((d) => d > 34).length,
    tareasLargas: largas.length,
    msTareasLargas: Math.round(largas.reduce((a, b) => a + b, 0)),
    MB: +(bytes / 1e6).toFixed(1),
  }
})
console.log(JSON.stringify({ carga, ...r }))
await b.close()
