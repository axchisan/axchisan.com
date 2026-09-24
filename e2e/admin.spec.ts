import { test, expect, type Page } from "@playwright/test"
import { config as loadEnv } from "dotenv"

loadEnv({ path: ".env.local" })

const EMAIL = process.env.ADMIN_EMAIL!
const PASSWORD = process.env.ADMIN_PASSWORD!

// Marca los datos creados por la suite para poder limpiarlos después.
const MARCA = "E2E-TEMPORAL"

async function entrar(page: Page) {
  // Se espera a que la página termine de hidratarse: si se escribe antes,
  // React reinicia los campos y el correo queda vacío.
  await page.goto("/auth/signin", { waitUntil: "networkidle" })
  const correo = page.locator('input[name="email"], input[type="email"]')
  await correo.fill(EMAIL)
  await expect(correo).toHaveValue(EMAIL)
  await page.locator('input[name="password"], input[type="password"]').fill(PASSWORD)
  await page.getByRole("button", { name: /Iniciar sesión/ }).click()
  // /auth/signin?callbackUrl=/admin también contiene "/admin": hay que
  // esperar a estar dentro del panel de verdad.
  await page.waitForURL((url) => url.pathname.startsWith("/admin"), { timeout: 30_000 })
}

test.describe("panel de administración", () => {
  test.beforeAll(() => {
    expect(EMAIL, "falta ADMIN_EMAIL en .env.local").toBeTruthy()
    expect(PASSWORD, "falta ADMIN_PASSWORD en .env.local").toBeTruthy()
  })

  test("sin sesión, /admin no es accesible", async ({ page }) => {
    await page.goto("/admin")
    await expect(page).toHaveURL(/\/auth\/signin/)
  })

  test("rechaza credenciales incorrectas", async ({ page }) => {
    await page.goto("/auth/signin")
    await page.locator('input[name="email"], input[type="email"]').fill(EMAIL)
    await page.locator('input[name="password"], input[type="password"]').fill("contrasena-incorrecta")
    await page.getByRole("button", { name: /Iniciar sesión/ }).click()

    // No debe entrar bajo ningún concepto. Se compara la RUTA y no la URL
    // entera: NextAuth deja "?callbackUrl=/admin" en la query, y desde Next
    // 16.3 ya no lo codifica, así que una regex sobre la URL daría un falso
    // positivo aunque el acceso se haya denegado correctamente.
    await page.waitForTimeout(3000)
    expect(new URL(page.url()).pathname, "entró al panel con la contraseña incorrecta").not.toMatch(
      /^\/admin/,
    )
  })

  test("cada sección del panel carga", async ({ page }) => {
    await entrar(page)

    const secciones = [
      ["/admin", "Dashboard"],
      ["/admin/projects", "Proyectos"],
      ["/admin/blog", "Blog"],
      ["/admin/skills", "Skills"],
      ["/admin/media", "Media"],
      ["/admin/messages", "Mensajes"],
      ["/admin/profile", "Perfil"],
    ] as const

    for (const [ruta] of secciones) {
      const res = await page.goto(ruta)
      expect(res?.status(), `HTTP de ${ruta}`).toBe(200)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    }
  })

  // Los proyectos ya no se muestran en el sitio público (ver REESTRUCTURACION.md,
  // decisión D4), pero el panel los sigue gestionando.
  test("crear un proyecto desde el panel", async ({ page }) => {
    await entrar(page)
    const titulo = `${MARCA} ${Date.now()}`

    await page.goto("/admin/projects/new")
    await page.getByLabel(/^Título/).fill(titulo)
    await page.getByLabel(/^Descripción/).first().fill("Proyecto creado por la suite de pruebas.")
    await page.getByRole("button", { name: /Guardar|Crear/ }).first().click()

    await page.waitForURL(/\/admin\/projects$/, { timeout: 30_000 })
    await expect(page.getByText(titulo)).toBeVisible()
  })

  test("editar un proyecto guarda el cambio", async ({ page, request }) => {
    await entrar(page)

    // El id sale de la API en lugar de rastrear el DOM: un selector que
    // depende del maquetado se rompe con cada retoque de diseño.
    const proyectos = await (await request.get("/api/projects")).json()
    const prueba = proyectos.find((p: { title: string }) => p.title.includes(MARCA))
    if (!prueba) test.skip(true, "no hay proyecto de prueba que editar")

    const nuevaDesc = `Descripción editada ${Date.now()}`
    await page.goto(`/admin/projects/${prueba.id}`)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

    const campo = page.getByLabel(/^Descripción/).first()
    await campo.fill(nuevaDesc)
    await page.getByRole("button", { name: /Guardar/ }).first().click()
    await page.waitForURL(/\/admin\/projects$/, { timeout: 30_000 })

    const tras = await (await request.get("/api/projects")).json()
    const editado = tras.find((p: { id: string }) => p.id === prueba.id)
    // El primer campo «Descripción…» del formulario es la descripción corta.
    expect(editado.shortDesc).toBe(nuevaDesc)
  })

  test("borrar el proyecto de prueba", async ({ page, request }) => {
    await entrar(page)

    const proyectos = await (await request.get("/api/projects")).json()
    const prueba = proyectos.find((p: { title: string }) => p.title.includes(MARCA))
    if (!prueba) test.skip(true, "no hay proyecto de prueba que borrar")

    // El diálogo de confirmación bloquea la página si nadie lo atiende.
    page.once("dialog", (d) => d.accept())
    await page.goto("/admin/projects")
    await page.getByRole("button", { name: `Eliminar ${prueba.title}` }).click()

    await expect(page.getByText(prueba.title)).toHaveCount(0, { timeout: 20_000 })

    const tras = await (await request.get("/api/projects")).json()
    expect(tras.some((p: { id: string }) => p.id === prueba.id), "el proyecto borrado sigue en la API").toBe(false)
  })

  test("ciclo completo de un artículo: crear, publicar, filtrar y borrar", async ({ page }) => {
    await entrar(page)

    const titulo = `${MARCA} articulo ${Date.now()}`
    const slug = `e2e-articulo-${Date.now()}`
    const etiqueta = "EtiquetaDePrueba"

    // Se crea por API: el objetivo es verificar el recorrido público del
    // artículo, no volver a probar el formulario del panel.
    const creado = await page.request.post("/api/blog", {
      data: {
        title: titulo,
        slug,
        excerpt: "Artículo creado por la suite de pruebas.",
        content: "Contenido de prueba.",
        tags: [etiqueta],
        published: true,
      },
    })
    expect(creado.status(), "no se pudo crear el artículo").toBeLessThan(300)

    // Aparece en el listado sin esperar a que caduque la caché.
    await page.goto("/guias")
    await expect(page.getByRole("link", { name: titulo })).toBeVisible()

    // El filtro por etiqueta filtra de verdad.
    await page.getByRole("navigation", { name: "Filtrar por tema" }).getByRole("link", { name: etiqueta }).click()
    await expect(page).toHaveURL(new RegExp(`tag=${etiqueta}`))
    await expect(page.getByRole("link", { name: titulo })).toBeVisible()

    // El detalle se abre y sobrevive a una segunda visita (acierto de caché).
    await page.goto(`/guias/${slug}`)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(titulo)
    const segunda = await page.goto(`/guias/${slug}`)
    expect(segunda?.status(), "el detalle falla al acertar la caché").toBe(200)

    // Limpieza: la suite no deja rastro en la base.
    const borrado = await page.request.delete(`/api/blog/${slug}`)
    expect(borrado.status()).toBeLessThan(300)

    const tras = await page.request.get(`/guias/${slug}`)
    expect(tras.status(), "el artículo borrado sigue accesible").toBe(404)
  })

  test("una cotización llega al panel con sus datos", async ({ page, request }) => {
    const nombre = `${MARCA} cotizacion ${Date.now()}`
    const res = await request.post("/api/contact", {
      data: {
        name: nombre,
        telefono: "300 000 0000",
        message: "Cotización de prueba de la suite.",
        sector: "Veterinarias",
        necesidad: "Citas en línea",
        presupuesto: "Prefiero pagar por mes",
        origen: "/soluciones/veterinarias",
      },
    })
    expect(res.status()).toBe(200)

    await entrar(page)
    await page.goto("/admin/messages")
    await expect(page.getByText(nombre, { exact: true })).toBeVisible()
    await expect(page.getByText("/soluciones/veterinarias").first()).toBeVisible()
    // El número colombiano de 10 dígitos se completa con el indicativo 57.
    await expect(page.locator('a[href*="wa.me/573000000000"]').first()).toBeVisible()

    // La suite no deja rastro en la base.
    const lista = await (await page.request.get(`/api/messages?search=${encodeURIComponent(nombre)}`)).json()
    for (const m of (lista.messages ?? []) as { id: string; name: string }[]) {
      if (m.name === nombre) await page.request.delete(`/api/messages/${m.id}`)
    }
  })

  test("cerrar sesión deja el panel inaccesible", async ({ page }) => {
    await entrar(page)
    await page.getByRole("button", { name: /Cerrar sesión/ }).click()
    await page.waitForTimeout(2500)

    await page.goto("/admin")
    await expect(page).toHaveURL(/\/auth\/signin/)
  })
})
