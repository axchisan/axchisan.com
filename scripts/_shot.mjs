import { chromium } from "@playwright/test"
const [,, url, out, w, h, sel] = process.argv
const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: +w, height: +h } })).newPage()
await p.goto(url, { waitUntil: "networkidle" })
if (sel) { const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: out }) } else await p.screenshot({ path: out })
await b.close()
