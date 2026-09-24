import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Band, Body, PageBand } from "@/components/site/band"
import { ServiceCard } from "@/components/site/service-card"
import { Button } from "@/components/ui/button"
import { SERVICIOS } from "@/lib/servicios"
import { PROFILE, SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Desarrollo de aplicaciones web y multiplataforma, automatización con IA e infraestructura serverless para empresas. Alcance y precio cerrados antes de empezar.",
  alternates: { canonical: "/servicios" },
}

export default function ServiciosPage() {
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
                  url: `${SITE_URL}/servicios#${s.id}`,
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
          titulo="Capacidades de desarrollo"
          entradilla="Áreas en las que puedo asumir la implementación técnica: arquitectura, desarrollo, integración, pruebas y despliegue según las necesidades de cada proyecto."
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
            <h2 className="text-[1.9375rem] text-ink">Alcance de trabajo</h2>
            <p className="mt-3 max-w-[58ch] text-[1.0625rem] leading-relaxed text-mid">
              Definir qué tipo de proyectos encajan permite evaluar una colaboración con claridad desde el inicio.
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  t: "Implementaciones estándar de comercio electrónico",
                  d: "Para una tienda sin requisitos técnicos particulares, una plataforma especializada suele ser la alternativa más eficiente.",
                },
                {
                  t: "Identidad visual y branding",
                  d: "El alcance se centra en producto e interfaces. La identidad de marca requiere una especialidad de diseño distinta.",
                },
                {
                  t: "Mantenimiento sin acceso técnico verificable",
                  d: "Para evaluar un sistema existente se requiere acceso al repositorio, dependencias y una forma de reproducir el entorno.",
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
              ¿El alcance coincide con tu necesidad?
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-on-band-mid">
              Con el contexto adecuado puedo evaluar viabilidad, alcance técnico y próximos pasos.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href="/contacto#agendar" size="lg">Contactar</Button>
              <Button href="/trabajo" variant="outline-band" size="lg">Ver proyectos</Button>
            </div>
          </div>
        </Band>
      </main>

      <Footer />
    </>
  )
}
