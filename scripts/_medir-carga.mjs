import { chromium } from "@playwright/test"
const [,, url, movil] = process.argv
const b = await chromium.launch()
const ctx = await b.newContext(movil ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true } : { viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
let n = 0, bytes = 0, lentos = 0, errores = 0
const t0 = Date.now()
const marcas = {}
p.on("requestfinished", async (req) => {
  if (!/r2\.dev|\.mp4|\/frames/.test(req.url())) return
  const s = await req.sizes().catch(() => null)
  const t = req.timing()
  n++; bytes += s?.responseBodySize ?? 0
  if (t.responseEnd > 1000) lentos++
  for (const seg of [5, 10, 20, 40, 60]) if (!marcas[seg] && Date.now() - t0 > seg * 1000) marcas[seg] = { archivos: n, MB: +(bytes / 1e6).toFixed(1) }
})
p.on("requestfailed", (r) => /r2\.dev/.test(r.url()) && errores++)
await p.goto(url, { waitUntil: "load", timeout: 120000 })
await p.waitForTimeout(62000)
console.log(JSON.stringify({ total: n, MB: +(bytes / 1e6).toFixed(1), masDe1s: lentos, errores, marcas }))
await b.close()
