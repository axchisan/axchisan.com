import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, Body, PageBand } from "@/components/site/band"
import { ServiceCard } from "@/components/site/service-card"
import { Button } from "@/components/ui/button"
import { SERVICIOS } from "@/lib/servicios"
import { PROFILE, SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Desarrollo de software a medida",
  description:
    "Aplicaciones web y multiplataforma, automatización de procesos con IA e infraestructura en la nube para empresas en Colombia. Precio por jornada y alcance cerrado antes de empezar.",
  alternates: { canonical: "/a-medida" },
}

export default function AMedidaPage() {
  return (
    <>
      <Header />

      <main id="contenido">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Servicios de Axchi",
              itemListElement: SERVICIOS.map((s, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Service",
                  name: s.titulo,
                  description: s.descripcion,
                  serviceType: s.gancho,
                  url: `${SITE_URL}/a-medida#${s.id}`,
                  areaServed: [{ "@type": "Country", name: "Colombia" }, "Remoto"],
                  provider: {
                    "@type": "ProfessionalService",
                    name: SITE_NAME,
                    url: SITE_URL,
                    email: PROFILE.email,
                  },
                },
              })),
            }),
          }}
        />

        <PageBand
          titulo="Desarrollo a medida"
          entradilla="Para empresas con un proyecto que no encaja en un plan del catálogo: integraciones, automatizaciones, aplicaciones y la infraestructura para operarlas. Se cotiza por jornada, con un diagnóstico de $ 450.000 que se descuenta si contratas."
        />

        <Body>
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICIOS.map((s) => (
              <ServiceCard key={s.id} servicio={s} />
            ))}
          </div>
        </Body>

        <div className="bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-[1.9375rem] text-ink">Lo que no hacemos</h2>
            <p className="mt-3 max-w-[58ch] text-[1.0625rem] leading-relaxed text-mid">
              Decirlo desde el principio ahorra una reunión a los dos.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  t: "Construir desde cero lo que ya existe",
                  d: "Si una herramienta o un plan del catálogo te resuelve, te lo recomendamos antes que cobrarte un desarrollo.",
                },
                {
                  t: "Logos y manuales de marca",
                  d: "Diseñamos interfaces, no identidades. Para tu logo te recomendamos a alguien de esa disciplina.",
                },
                {
                  t: "Mantener código que no podemos revisar",
                  d: "Para cotizar sobre un sistema existente necesitamos el código y una forma de ejecutarlo. Sin eso, cualquier precio sería inventado.",
                },
              ].map((x) => (
                <li key={x.t} className="rounded-[16px] border border-line bg-paper p-6">
                  <h3 className="text-[1.0625rem] font-semibold text-ink">{x.t}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-mid">{x.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Band>
          <div className="py-20 text-center sm:py-24">
            <h2 className="mx-auto max-w-[22ch] text-[1.9375rem] sm:text-[2.4375rem]">
              ¿Tienes un proyecto así?
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Cuéntanos qué hace hoy tu equipo a mano, con qué sistemas trabaja y qué quiere lograr.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href="/cotizar?plan=a-medida" size="lg">Cotizar</Button>
              <Button href="/planes" variant="outline-band" size="lg">Ver planes</Button>
            </div>
          </div>
        </Band>
      </main>

      <Footer />
    </>
  )
}
