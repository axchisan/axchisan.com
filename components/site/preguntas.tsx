/**
 * Preguntas frecuentes plegables. Publica además los datos estructurados
 * FAQPage, para que Google pueda mostrarlas en los resultados.
 */
export function Preguntas({ preguntas }: { preguntas: { p: string; r: string }[] }) {
  return (
    <div className="border-t border-line">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: preguntas.map((q) => ({
              "@type": "Question",
              name: q.p,
              acceptedAnswer: { "@type": "Answer", text: q.r },
            })),
          }),
        }}
      />
      {preguntas.map((q) => (
        <details key={q.p} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.0625rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
            {q.p}
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-[1.125rem] leading-none text-mid transition-transform group-open:rotate-45"
              aria-hidden
            >
              +
            </span>
          </summary>
          <p className="measure pb-6 text-[1rem] leading-relaxed text-mid">{q.r}</p>
        </details>
      ))}
    </div>
  )
}
