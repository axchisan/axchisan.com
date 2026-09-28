/**
 * Motor de páginas cinematográficas: un video que avanza con el scroll.
 *
 * Cada `<section data-scrub>` es un acto: una sección alta con un escenario
 * sticky y un `<video>`. Según cuánto se haya recorrido la sección, el video
 * salta al instante que corresponde.
 *
 * Por qué video y no una secuencia de imágenes (la primera versión): cientos
 * de WebP pesaban 53 MB en escritorio, llegaban de a poco (a los 5 s había uno
 * de cada 16 y el video avanzaba a saltos) y el navegador los decodificaba en
 * el hilo principal. Un MP4 con un fotograma clave cada 6 pesa menos de la
 * mitad, se decodifica por hardware y salta de un instante a otro en 4 a 7 ms
 * en Chrome y en Safari (medido). Detalle y comandos en
 * docs/demos/brisas-del-mar.md.
 *
 * Atributos de cada acto:
 *   data-video / data-video-m   MP4 de escritorio (1920×1080) y de celular (vertical, 608×1080)
 *   data-duration               segundos del clip, para el contador 00:03 / 00:08
 *
 * El video se descarga entero y se sirve desde memoria (blob): así cada salto
 * es local, sin pedir rangos a la red, que es lo que hace fluido el scrub en
 * Safari. Mientras llega se ve el póster, que pone el CSS.
 *
 * Sin animación (`prefers-reduced-motion` o ahorro de datos) no se descarga
 * ningún video: queda el póster fijo.
 */

const pad = (n: number) => String(n).padStart(2, "0")
const reloj = (s: number) => `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}`

/**
 * Inercia del video respecto al scroll, en segundos. Suaviza la rueda del
 * mouse, que avanza a saltos, y es igual a 60 Hz que a 120 Hz porque depende
 * del tiempo transcurrido, no de los cuadros.
 */
const INERCIA = 0.08

class Acto {
  seccion: HTMLElement
  video: HTMLVideoElement
  src: string
  duracion: number
  tiempoEl: HTMLElement | null
  barraEl: HTMLElement | null
  listo = false
  cancelado = false
  url = ""
  /** Instante al que apunta el scroll y el que se muestra, suavizado. */
  objetivo = 0
  actual = 0
  progreso = 0
  visible = false
  ultimoTiempo = ""

  constructor(seccion: HTMLElement, movil: boolean) {
    this.seccion = seccion
    this.video = seccion.querySelector("video")!
    this.src = (movil ? seccion.dataset.videoM : seccion.dataset.video) ?? ""
    this.duracion = Number(seccion.dataset.duration) || 0
    this.tiempoEl = seccion.querySelector("[data-time]")
    this.barraEl = seccion.querySelector("[data-bar]")
  }

  async cargar() {
    for (let intento = 1; intento <= 3 && !this.cancelado; intento++) {
      try {
        const res = await fetch(this.src)
        if (!res.ok) throw new Error(String(res.status))
        const blob = await res.blob()
        if (this.cancelado) return
        this.url = URL.createObjectURL(blob)
        const v = this.video
        await new Promise<void>((listo) => {
          v.addEventListener("loadeddata", () => listo(), { once: true })
          v.src = this.url
          v.load()
        })
        // Safari no pinta el primer fotograma de un video que nunca se
        // reprodujo: un play/pause silencioso lo despierta.
        await v.play().catch(() => {})
        v.pause()
        v.currentTime = this.actual
        this.listo = true
        this.seccion.classList.add("video-listo")
        return
      } catch {
        // Redes móviles: dos reintentos y después se queda el póster.
        await new Promise((r) => setTimeout(r, 1200 * intento))
      }
    }
  }

  /** Lee la posición del scroll. Barato: se llama en cada cuadro. */
  medir() {
    const r = this.seccion.getBoundingClientRect()
    this.visible = r.top < innerHeight && r.bottom > 0
    this.progreso = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)))
    this.objetivo = this.progreso * Math.max(0, this.duracion - 0.05)
  }

  cuadro(dt: number) {
    this.medir()
    if (!this.visible) return
    const k = 1 - Math.exp(-dt / INERCIA)
    this.actual += (this.objetivo - this.actual) * k
    this.seccion.classList.toggle("copy-in", this.progreso > 0.03 && this.progreso < 0.9)
    // Un salto a la vez: si el anterior no ha terminado, se espera al
    // siguiente cuadro con el instante ya actualizado. Pedir saltos encima de
    // otros es lo que traba el scrub en los navegadores.
    const v = this.video
    if (this.listo && !v.seeking && Math.abs(v.currentTime - this.actual) > 1 / 48) v.currentTime = this.actual
    const tiempo = `${reloj(this.progreso * this.duracion)} / ${reloj(this.duracion)}`
    if (this.tiempoEl && tiempo !== this.ultimoTiempo) {
      this.tiempoEl.textContent = tiempo
      this.ultimoTiempo = tiempo
    }
    if (this.barraEl) this.barraEl.style.transform = `scaleX(${this.progreso.toFixed(3)})`
  }

  liberar() {
    this.cancelado = true
    if (this.url) URL.revokeObjectURL(this.url)
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

  const actos = [...raiz.querySelectorAll<HTMLElement>("[data-scrub]")].map((s) => new Acto(s, movil))

  // El bucle corre solo mientras algún acto está en pantalla o acomodándose.
  let anterior = performance.now()
  let pedido = 0
  const bucle = (ahora: number) => {
    const dt = Math.min(0.1, (ahora - anterior) / 1000)
    anterior = ahora
    actos.forEach((a) => a.cuadro(dt))
    const enMovimiento = actos.some((a) => a.visible && Math.abs(a.objetivo - a.actual) > 0.002)
    pedido = enMovimiento ? requestAnimationFrame(bucle) : 0
  }
  const despertar = () => {
    if (pedido) return
    anterior = performance.now()
    pedido = requestAnimationFrame(bucle)
  }
  addEventListener("scroll", despertar, { passive: true })
  addEventListener("resize", despertar)

  // El cargador se va con el primer video o a los 2,5 s, lo que pase primero:
  // en una conexión lenta se ve el póster en vez de una pantalla de espera.
  let avisado = false
  const avisar = () => {
    if (avisado) return
    avisado = true
    opciones.alEstarListo?.()
  }
  const espera = setTimeout(avisar, 2500)

  // Los videos se piden en orden, después del evento `load`, para no
  // competir con la página.
  void (async () => {
    if (document.readyState !== "complete") await new Promise((r) => addEventListener("load", r, { once: true }))
    for (const [i, a] of actos.entries()) {
      await a.cargar()
      if (i === 0) avisar()
      despertar()
    }
    avisar()
  })()

  despertar()

  return () => {
    clearTimeout(espera)
    cancelAnimationFrame(pedido)
    actos.forEach((a) => a.liberar())
    removeEventListener("scroll", despertar)
    removeEventListener("resize", despertar)
  }
}
