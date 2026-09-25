/**
 * Motor de páginas cinematográficas: un video que avanza con el scroll.
 *
 * Cada `<section data-scrub>` es un acto: una sección alta con un escenario
 * sticky y un `<canvas>`. Según cuánto se haya recorrido la sección, el canvas
 * pinta el fotograma que corresponde. Portado de las pruebas de PaginasScroll.
 *
 * Atributos de cada acto:
 *   data-frames / data-frames-m   fotogramas de escritorio y de celular
 *   data-path / data-path-m       carpeta de cada versión (0001.webp, 0002.webp…)
 *   data-duration                 segundos del clip, para el contador 00:03 / 00:08
 *
 * Sin animación (`prefers-reduced-motion` o ahorro de datos) no se descarga
 * ningún fotograma: queda el póster fijo, que pone el CSS.
 */

const pad = (n: number) => String(n).padStart(2, "0")
const reloj = (s: number) => `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}`

class Acto {
  seccion: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  total: number
  ruta: string
  duracion: number
  tiempoEl: HTMLElement | null
  barraEl: HTMLElement | null
  fotogramas: (HTMLImageElement | undefined)[]
  actual = -1
  objetivo = 0
  arriba = 0
  recorrido = 1
  alto = 1
  ultimoTiempo = ""
  eraVisible: boolean | undefined
  cancelado = false
  /** Fotogramas ya pedidos, para que las fases de carga no se repitan. */
  pedidos = new Set<number>()

  constructor(seccion: HTMLElement, private movil: boolean, private anchoMaximo: number) {
    this.seccion = seccion
    this.canvas = seccion.querySelector("canvas")!
    this.ctx = this.canvas.getContext("2d")!
    this.total = Number(movil ? seccion.dataset.framesM : seccion.dataset.frames)
    this.ruta = (movil ? seccion.dataset.pathM : seccion.dataset.path) ?? ""
    this.duracion = Number(seccion.dataset.duration) || 0
    this.tiempoEl = seccion.querySelector("[data-time]")
    this.barraEl = seccion.querySelector("[data-bar]")
    this.fotogramas = new Array(this.total)
    this.medir()
  }

  url(i: number) {
    return `${this.ruta}${String(i + 1).padStart(4, "0")}.webp`
  }

  /**
   * Carga de grueso a fino: con `pasos = [16]`, uno de cada 16 fotogramas; con
   * `[8, 4, 2, 1]`, el resto. El scrub funciona casi al instante y gana
   * fluidez mientras carga.
   */
  cargar(pasos: number[], alTenerLoMinimo?: () => void) {
    const orden: number[] = []
    for (const paso of pasos) {
      for (let i = 0; i < this.total; i += paso) {
        if (!this.pedidos.has(i)) {
          this.pedidos.add(i)
          orden.push(i)
        }
      }
    }
    const grueso = Math.min(orden.length, Math.ceil(this.total / 16))
    const intentos = new Map<number, number>()
    let cargados = 0
    let siguiente = 0
    let activos = 0
    return new Promise<void>((resolver) => {
      const bombear = () => {
        if (this.cancelado) return resolver()
        if (siguiente >= orden.length && activos === 0) return resolver()
        while (activos < 6 && siguiente < orden.length) {
          const i = orden[siguiente++]
          const img = new Image()
          img.decoding = "async"
          activos++
          img.onload = () => {
            activos--
            this.fotogramas[i] = img
            if (++cargados === grueso) alTenerLoMinimo?.()
            if (this.actual < 0 || i === this.objetivo) this.pintar(this.objetivo, true)
            bombear()
          }
          img.onerror = () => {
            activos--
            // Hasta dos reintentos al final de la cola: redes móviles.
            const n = (intentos.get(i) ?? 0) + 1
            intentos.set(i, n)
            if (n <= 2) orden.push(i)
            else if (++cargados === grueso) alTenerLoMinimo?.()
            bombear()
          }
          img.src = this.url(i)
        }
      }
      bombear()
    })
  }

  /** Si el fotograma exacto no ha llegado, el cargado más cercano. */
  cercano(i: number) {
    for (let d = 0; d < this.total; d++) {
      if (this.fotogramas[i - d]) return i - d
      if (this.fotogramas[i + d]) return i + d
    }
    return -1
  }

  /**
   * El canvas nunca tiene más píxeles que la foto: pintar a resolución Retina
   * una imagen de 1600 px solo gasta GPU sin ganar nitidez.
   */
  medir() {
    const cw = this.canvas.clientWidth
    const ch = this.canvas.clientHeight
    const dpr = Math.min(devicePixelRatio || 1, 2, this.anchoMaximo / Math.max(cw, 1))
    this.canvas.width = Math.round(cw * dpr)
    this.canvas.height = Math.round(ch * dpr)
    this.arriba = this.seccion.getBoundingClientRect().top + scrollY
    this.recorrido = Math.max(1, this.seccion.offsetHeight - innerHeight)
    this.alto = this.seccion.offsetHeight
    this.pintar(Math.max(this.actual, 0), true)
  }

  /** Pinta como `object-fit: cover`. */
  pintar(i: number, forzar = false) {
    this.objetivo = i
    const k = this.cercano(i)
    if (k < 0 || (k === this.actual && !forzar)) return
    const img = this.fotogramas[k]!
    const { width: cw, height: ch } = this.canvas
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const w = img.naturalWidth * s
    const h = img.naturalHeight * s
    this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    this.actual = k
  }

  actualizar(y: number) {
    const arriba = this.arriba - y
    const visible = arriba < innerHeight && arriba + this.alto > 0
    if (!visible && this.eraVisible === false) return
    this.eraVisible = visible
    const p = Math.min(1, Math.max(0, -arriba / this.recorrido))
    this.seccion.classList.toggle("copy-in", p > 0.03 && p < 0.9)
    this.pintar(Math.round(p * (this.total - 1)))
    const tiempo = `${reloj(p * this.duracion)} / ${reloj(this.duracion)}`
    if (this.tiempoEl && tiempo !== this.ultimoTiempo) {
      this.tiempoEl.textContent = tiempo
      this.ultimoTiempo = tiempo
    }
    if (this.barraEl) this.barraEl.style.transform = `scaleX(${p.toFixed(3)})`
  }
}

/**
 * Arranca el motor sobre una raíz. Devuelve la función que lo detiene, para
 * el cleanup de React al salir de la página.
 */
export function iniciarScrub(raiz: HTMLElement, opciones: { alEstarListo?: () => void } = {}) {
  const movil = matchMedia("(max-width: 768px)").matches
  const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches
  const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (sinMovimiento || conexion?.saveData) {
    raiz.classList.add("no-scrub")
    opciones.alEstarListo?.()
    return () => raiz.classList.remove("no-scrub")
  }

  const actos = [...raiz.querySelectorAll<HTMLElement>("[data-scrub]")].map((s) => new Acto(s, movil, movil ? 1100 : 1920))
  let pendiente = false
  const alDesplazar = () => {
    if (pendiente) return
    pendiente = true
    requestAnimationFrame(() => {
      const y = scrollY
      actos.forEach((a) => a.actualizar(y))
      pendiente = false
    })
  }
  const alCambiarTamano = () => {
    actos.forEach((a) => a.medir())
    alDesplazar()
  }

  addEventListener("scroll", alDesplazar, { passive: true })
  addEventListener("resize", alCambiarTamano)
  addEventListener("load", alCambiarTamano)
  // Las fuentes pueden cambiar la altura de la página: se vuelve a medir.
  void document.fonts?.ready.then(alCambiarTamano)

  // Primero la versión gruesa de todos los actos, para que quien baja rápido
  // encuentre movimiento en cualquiera; después el detalle, en orden. El
  // detalle espera al evento `load`: cada `Image` pendiente retrasa ese evento,
  // y cientos de fotogramas lo aplazarían para toda la página.
  void (async () => {
    const [primero, ...resto] = actos
    if (primero) await primero.cargar([16], opciones.alEstarListo)
    else opciones.alEstarListo?.()
    for (const a of resto) await a.cargar([16])
    if (document.readyState !== "complete") await new Promise((r) => addEventListener("load", r, { once: true }))
    for (const a of actos) await a.cargar([8, 4, 2, 1])
  })()

  alDesplazar()

  return () => {
    actos.forEach((a) => (a.cancelado = true))
    removeEventListener("scroll", alDesplazar)
    removeEventListener("resize", alCambiarTamano)
    removeEventListener("load", alCambiarTamano)
  }
}
