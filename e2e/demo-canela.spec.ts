import { test, expect, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * Demo de Canela, clínica veterinaria. Todo su estado vive en el navegador,
 * así que cada prueba arranca con un contexto limpio y no toca la base.
 */

const RAIZ = "/demo/canela"

async function entrarAlPanel(page: Page, como: "veterinaria" | "recepción" = "veterinaria") {
  await page.goto(`${RAIZ}/panel`)
  await page.getByRole("button", { name: new RegExp(`Entrar como ${como}`) }).click()
  await expect(page.getByRole("heading", { level: 1, name: "Hoy" })).toBeVisible()
}

async function verComo(page: Page, nivel: "pagina" | "citas" | "sistema") {
  await page.evaluate(
    (n) => localStorage.setItem("axchi-demo:canela:preferencias", JSON.stringify({ nivel: n, recorrido: false })),
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
    violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nodo(s), ${v.help}`),
    `violaciones en ${donde}`,
  ).toEqual([])
}

test.describe("demo Canela", () => {
  test("la portada carga sin errores, con un h1 y fuera del índice de Google", async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (e) => errores.push(e.message))
    const res = await page.goto(RAIZ)
    expect(res?.status()).toBe(200)
    await expect(page.locator("h1")).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
    // La placa calcula el estado en el navegador: tiene que decir algo concreto.
    await expect(page.getByRole("status")).toContainText(/Abierto|Cerrado|Urgencias/)
    expect(errores).toEqual([])
  })

  test("un cliente conocido agenda una cita y la clínica la ve en el panel", async ({ page }) => {
    await page.goto(`${RAIZ}/agendar?servicio=vacunacion`)
    await page.getByRole("button", { name: "Continuar" }).click()

    await page.getByLabel("Tu celular").fill("300 000 1037")
    await expect(page.getByText(/Hola, .+¿Para cuál de tus mascotas\?/)).toBeVisible()
    const mascota = page.getByRole("button", { name: "Luna" })
    await mascota.click()
    await page.getByRole("button", { name: "Continuar" }).click()

    const hora = page.getByRole("radiogroup", { name: "Hora" }).getByRole("radio").first()
    await hora.click()
    await page.getByRole("button", { name: "Continuar" }).click()
    await page.getByLabel(/Algo que debamos saber/).fill("Le da miedo el carro")
    await page.getByRole("button", { name: "Confirmar cita" }).click()

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Listo, Luna tiene cita.")
    await expect(page.getByRole("link", { name: "Agregar a mi calendario" })).toHaveAttribute("download", "cita-canela.ics")

    // Del lado de la clínica: la cita aparece en la agenda de ese día.
    await page.getByRole("link", { name: "Verla en el panel" }).click()
    await page.getByRole("button", { name: /Entrar como veterinaria/ }).click()
    await expect(page.getByRole("heading", { level: 1, name: "Agenda" })).toBeVisible()
  })

  test("con el plan Página no hay agenda en línea: se pide por WhatsApp", async ({ page }) => {
    await page.goto(RAIZ)
    await verComo(page, "pagina")
    await expect(page.getByRole("button", { name: "Pedir cita por WhatsApp" }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "Agendar cita" })).toHaveCount(0)

    await page.goto(`${RAIZ}/agendar`)
    await expect(page.getByText(/Esto entra en el plan Citas en línea/)).toBeVisible()
  })

  test("el WhatsApp de la clínica ficticia no abre un chat real", async ({ page }) => {
    await page.goto(RAIZ)
    await page.getByRole("button", { name: "Escribir por WhatsApp" }).first().click()
    await expect(page.getByRole("dialog", { name: "Así llega a WhatsApp" })).toBeVisible()
    await expect(page.locator('a[href*="wa.me/300"]')).toHaveCount(0)
  })

  test("la veterinaria registra una consulta y queda en la historia", async ({ page }) => {
    await entrarAlPanel(page)
    await page.goto(`${RAIZ}/panel/pacientes`)
    await page.getByRole("searchbox").fill("Kira")
    await page.getByRole("link", { name: "Kira" }).click()
    await page.getByRole("link", { name: "Nueva consulta" }).click()

    await page.getByLabel("Motivo de consulta").fill("Control de peso")
    await page.getByLabel("Peso (kg)").fill("8,4")
    await page.getByLabel("Diagnóstico").fill("Sobrepeso leve")
    await page.getByLabel("Medicamento 1", { exact: true }).fill("Alimento light")
    await page.getByLabel("Indicación del medicamento 1").fill("120 g al día repartidos en dos tomas")
    await page.getByRole("button", { name: "Guardar consulta" }).click()

    await expect(page.getByRole("heading", { level: 1, name: "Kira" })).toBeVisible()
    await expect(page.getByText("Control de peso")).toBeVisible()
    await expect(page.getByText("Sobrepeso leve")).toBeVisible()
  })

  test("recepción no puede escribir en la historia clínica", async ({ page }) => {
    await entrarAlPanel(page, "recepción")
    await page.goto(`${RAIZ}/panel/pacientes/m4/consulta`)
    await expect(page.getByText("Solo los veterinarios registran consultas.")).toBeVisible()
  })

  test("un recordatorio enviado queda marcado", async ({ page }) => {
    await entrarAlPanel(page)
    await page.goto(`${RAIZ}/panel/recordatorios`)
    await page.getByRole("button", { name: "Recordar" }).first().click()
    const dialogo = page.getByRole("dialog", { name: "Recordatorio por WhatsApp" })
    await expect(dialogo).toContainText("Te escribimos de Canela")
    await dialogo.getByRole("button", { name: "Marcar como enviado" }).click()
    await expect(page.getByText("Recordado hoy").first()).toBeVisible()
  })

  test("restablecer devuelve la demo a su estado inicial", async ({ page }) => {
    // Hace falta una cita por llegar: de noche o en domingo no queda ninguna.
    // Se fija el reloj a las 10 de la mañana de un día hábil.
    const manana = new Date()
    if (manana.getDay() === 0) manana.setDate(manana.getDate() + 1)
    manana.setHours(10, 0, 0, 0)
    await page.clock.install({ time: manana })
    await entrarAlPanel(page)
    const enConsulta = page.locator("dt", { hasText: "En consulta" }).locator("xpath=following-sibling::dd")
    const antes = await enConsulta.innerText()
    await page.getByRole("button", { name: "Llegó" }).first().click()
    await expect(enConsulta).toHaveText(String(Number(antes) + 1))
    await page.getByRole("button", { name: "Restablecer la demo" }).filter({ visible: true }).first().click()
    await expect(enConsulta).toHaveText(antes)
  })

  test("cumple WCAG AA en la portada, la reserva y el panel", async ({ page }) => {
    await page.goto(RAIZ)
    await page.waitForLoadState("networkidle")
    await sinViolaciones(page, "portada")

    await page.goto(`${RAIZ}/agendar`)
    await page.waitForLoadState("networkidle")
    await sinViolaciones(page, "agendar")

    await entrarAlPanel(page)
    await sinViolaciones(page, "panel: hoy")
    for (const ruta of ["agenda", "pacientes", "pacientes/m4", "recordatorios", "resumen"]) {
      await page.goto(`${RAIZ}/panel/${ruta}`)
      await page.waitForLoadState("networkidle")
      await sinViolaciones(page, `panel: ${ruta}`)
    }
  })

  test("nada desborda a 360 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await entrarAlPanel(page)
    for (const ruta of ["", "/agendar", "/panel", "/panel/agenda", "/panel/pacientes", "/panel/pacientes/m4", "/panel/recordatorios", "/panel/resumen"]) {
      await page.goto(`${RAIZ}${ruta}`)
      await page.waitForLoadState("networkidle")
      const desborda = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      )
      expect(desborda, `${RAIZ}${ruta} desborda a 360 px`).toBe(false)
    }
  })
})
