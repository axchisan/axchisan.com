import { defineConfig, devices } from "@playwright/test"
import { config as loadEnv } from "dotenv"

// La suite crea y borra contenido, así que corre contra la rama "test" de Neon
// y en un puerto propio. Nunca debe tocar la base de producción.
loadEnv({ path: ".env.test" })

const PUERTO = process.env.E2E_PORT ?? "3100"
const BASE = process.env.E2E_BASE_URL ?? `http://localhost:${PUERTO}`

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"] } },
    // El panel se opera desde escritorio; no tiene sentido duplicarlo en móvil.
    { name: "movil", use: { ...devices["Pixel 7"] }, testIgnore: /admin\.spec\.ts/ },
  ],

  webServer: {
    command: `npx dotenv -e .env.test -- next dev --port ${PUERTO}`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
})
