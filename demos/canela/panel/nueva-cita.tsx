"use client"

import { useMemo, useRef, useState } from "react"
import { Plus, X } from "lucide-react"
import { agendar, buscarMascotas, conArticulo, horasLibres, useClinica } from "../estado"
import { claveDia, SERVICIOS, sumarDias, textoDia, textoHora } from "../modelo"

/**
 * Recepción agenda por teléfono o en el mostrador. Mismas reglas que la página
 * pública: solo horas libres del profesional que presta el servicio.
 */
export function NuevaCita() {
  const clinica = useClinica()
  const dialogo = useRef<HTMLDialogElement>(null)
  const [busqueda, setBusqueda] = useState("")
  const [mascotaId, setMascotaId] = useState("")
  const [servicioId, setServicioId] = useState("consulta")
  const [dia, setDia] = useState(() => claveDia(new Date()))
  const [hora, setHora] = useState("")
  const [aviso, setAviso] = useState("")

  const coincidencias = useMemo(() => {
    if (!clinica || busqueda.trim().length < 2) return []
    return buscarMascotas(clinica, busqueda).slice(0, 6)
  }, [clinica, busqueda])

  if (!clinica) return null
  const libres = horasLibres(clinica, dia, servicioId)
  const elegida = clinica.mascotas.find((m) => m.id === mascotaId)
  const dias = Array.from({ length: 7 }, (_, i) => sumarDias(claveDia(new Date()), i))

  function guardar() {
    const h = libres.find((x) => x.inicio === hora)
    if (!elegida || !h) {
      setAviso("Elige la mascota y una hora libre.")
      return
    }
    agendar({
      mascotaId: elegida.id,
      servicioId,
      profesionalId: h.profesionales[0],
      inicio: h.inicio,
      origen: "recepcion",
    })
    dialogo.current?.close()
    setBusqueda("")
    setMascotaId("")
    setHora("")
    setAviso("")
  }

  const campo = "mt-1.5 block h-11 w-full rounded-[10px] border-2 border-cn-linea bg-white px-3 text-[1rem] outline-none focus:border-cn-collar"

  return (
    <>
      <button
        type="button"
        onClick={() => dialogo.current?.showModal()}
        className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-cn-collar px-4 text-[0.9375rem] font-bold text-white hover:bg-cn-collar-2"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Nueva cita
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby="nueva-cita-titulo"
        className="m-auto w-[min(94vw,520px)] rounded-[18px] bg-white p-0 font-cn-texto text-cn-collar backdrop:bg-cn-collar/50"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 id="nueva-cita-titulo" className="text-[1.25rem] font-bold">
              Nueva cita
            </h2>
            <button type="button" onClick={() => dialogo.current?.close()} className="rounded-[8px] p-1" aria-label="Cerrar">
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {elegida ? (
              <p className="flex items-center justify-between rounded-[10px] bg-cn-nube px-3 py-2.5 text-[0.9375rem]">
                <span>
                  <strong>{elegida.nombre}</strong>,{" "}
                  {clinica.propietarios.find((p) => p.id === elegida.propietarioId)?.nombre}
                </span>
                <button type="button" className="font-bold underline" onClick={() => setMascotaId("")}>
                  Cambiar
                </button>
              </p>
            ) : (
              <label className="block">
                <span className="text-[0.9375rem] font-bold">Mascota o propietario</span>
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre o teléfono"
                  className={campo}
                  autoFocus
                />
                {coincidencias.length > 0 && (
                  <ul className="mt-2 divide-y divide-cn-linea rounded-[10px] border border-cn-linea">
                    {coincidencias.map(({ m, p }) => (
                      <li key={m.id}>
                        <button
                          type="button"
                          onClick={() => setMascotaId(m.id)}
                          className="w-full px-3 py-2 text-left text-[0.9375rem] hover:bg-cn-nube"
                        >
                          <strong>{m.nombre}</strong> ({m.raza}), {p.nombre}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </label>
            )}

            <label className="block">
              <span className="text-[0.9375rem] font-bold">Servicio</span>
              <select
                value={servicioId}
                onChange={(e) => {
                  setServicioId(e.target.value)
                  setHora("")
                }}
                className={campo}
              >
                {SERVICIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[0.9375rem] font-bold">Día</span>
                <select
                  value={dia}
                  onChange={(e) => {
                    setDia(e.target.value)
                    setHora("")
                  }}
                  className={campo}
                >
                  {dias.map((d) => (
                    <option key={d} value={d}>
                      {textoDia(d)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[0.9375rem] font-bold">Hora</span>
                <select value={hora} onChange={(e) => setHora(e.target.value)} className={campo}>
                  <option value="">{libres.length ? "Elegir" : "Sin horas libres"}</option>
                  {libres.map((h) => (
                    <option key={h.inicio} value={h.inicio}>
                      {textoHora(h.inicio)}, {conArticulo(h.profesionales[0])}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {aviso && (
            <p role="alert" className="mt-4 text-[0.9375rem] font-bold text-cn-coral">
              {aviso}
            </p>
          )}

          <button
            type="button"
            onClick={guardar}
            className="mt-6 h-11 w-full rounded-[10px] bg-cn-pelota text-[1rem] font-bold hover:bg-cn-pelota-2"
          >
            Agendar
          </button>
        </div>
      </dialog>
    </>
  )
}
