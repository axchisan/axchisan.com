import { chromium } from "@playwright/test"
import { readFileSync } from "node:fs"
const svg = readFileSync(process.argv[3], "utf8").replace("<svg","<svg width='100%' height='100%'")
const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: 1020, height: 250 }, deviceScaleFactor: 3 })).newPage()
await p.setContent(`<div style="background:#0b0f14;padding:24px;display:flex;align-items:center;gap:30px;font:12px system-ui;color:#9aa7b5">
  ${[16,24,40,72].map(s=>`<div style="text-align:center"><div style="width:${s*1.39}px;height:${s}px">${svg}</div><div style="margin-top:8px">${s}px</div></div>`).join("")}
  <div style="text-align:center"><div style="width:167px;height:120px">${svg}</div><div style="margin-top:8px">grande</div></div>
  <div style="text-align:center"><div style="width:167px;height:120px;background:#fff;padding:8px;border-radius:8px">${svg}</div><div style="margin-top:8px">claro</div></div>
</div>`)
await p.waitForTimeout(300); await p.screenshot({ path: process.argv[2] }); await b.close()
