import { ExternalLink } from "lucide-react"
import { SoloEnNivel } from "@/demos/comun/solo-en-nivel"
import { AppCliente } from "@/demos/cafe-del-barrio/app"
import { RAIZ } from "@/demos/cafe-del-barrio/config"
import { Instalar } from "@/demos/cafe-del-barrio/instalar"
import { EMPRESA, PROGRAMA } from "@/demos/cafe-del-barrio/modelo"

export default function CafeDelBarrioApp() {
  return (
    <main id="contenido" className="mx-auto grid max-w-6xl lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16 lg:px-6 lg:py-12">
      <div className="order-2 px-4 py-10 lg:order-1 lg:px-0 lg:py-0">
        <h1 className="max-w-[16ch] font-cb-marca text-[2.5rem] leading-[1.05] text-cb-cafeto sm:text-[3.25rem]">Tu tarjeta de sellos, ahora en el celular</h1>
        <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-cb-gris">
          En {EMPRESA.nombre} cada compra suma puntos y un sello. Con {PROGRAMA.sellos} sellos, el siguiente café es gratis, y los puntos se cambian por premios desde la app.
        </p>
        <div className="mt-8 max-w-md space-y-4">
          <div className="rounded-[14px] bg-cb-hoja p-4">
            <p className="font-semibold text-cb-cafeto">Pruébalo como lo usaría el café</p>
            <p className="mt-1 text-[0.9375rem] text-cb-gris">
              Abre la caja en otra pestaña, busca el código de la app y registra una compra: los puntos y el sello aparecen aquí sin recargar.
            </p>
            <a href={`${RAIZ}/caja`} target="_blank" rel="noopener" className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-cb-cafeto px-5 text-[0.9375rem] font-semibold text-white hover:bg-cb-cafeto-2">
              Abrir la caja en otra pestaña
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <SoloEnNivel nivel="completo" compacto>
            <Instalar />
          </SoloEnNivel>
        </div>
      </div>

      {/* En el computador, dentro de un teléfono; en el celular, la app a pantalla completa. */}
      <div className="order-1 lg:order-2">
        <div className="h-[calc(100svh-6rem)] min-h-[36rem] lg:h-[min(780px,calc(100vh-10rem))] lg:min-h-[34rem] lg:w-[380px] lg:overflow-hidden lg:rounded-[44px] lg:border-[10px] lg:border-cb-tinta lg:shadow-2xl">
          <AppCliente />
        </div>
      </div>
    </main>
  )
}
