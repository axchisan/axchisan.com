import { cn } from "@/lib/utils"

/**
 * Ilustraciones SVG on-brand (gradiente violeta→cian). Inline, ligeras y
 * theme-aware vía currentColor / variables. Pensadas para dar atractivo visual
 * sin imágenes externas ni dependencias. Animaciones sutiles vía clases Tailwind.
 */

function GradientDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(var(--gradient-from))" />
        <stop offset="100%" stopColor="hsl(var(--gradient-to))" />
      </linearGradient>
    </defs>
  )
}

/** Ilustración para estados vacíos (sin resultados / sin contenido aún). */
export function EmptyIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={cn("w-44 h-auto", className)} aria-hidden>
      <GradientDefs id="empty-grad" />
      {/* halo */}
      <ellipse cx="100" cy="135" rx="70" ry="10" fill="url(#empty-grad)" opacity="0.12" />
      {/* caja */}
      <g className="animate-float">
        <rect x="55" y="62" width="90" height="62" rx="10" fill="hsl(var(--card))" stroke="url(#empty-grad)" strokeWidth="2" />
        <path d="M55 80 H145" stroke="url(#empty-grad)" strokeWidth="2" opacity="0.5" />
        <circle cx="68" cy="71" r="2.5" fill="url(#empty-grad)" />
        <circle cx="78" cy="71" r="2.5" fill="url(#empty-grad)" opacity="0.6" />
        {/* líneas de contenido */}
        <rect x="68" y="92" width="64" height="5" rx="2.5" fill="url(#empty-grad)" opacity="0.35" />
        <rect x="68" y="104" width="40" height="5" rx="2.5" fill="url(#empty-grad)" opacity="0.2" />
      </g>
      {/* destellos */}
      <circle cx="150" cy="55" r="3" fill="url(#empty-grad)" className="animate-pulse-neon" />
      <circle cx="44" cy="70" r="2" fill="url(#empty-grad)" className="animate-pulse-neon" />
      <path d="M158 44 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5z" fill="url(#empty-grad)" opacity="0.7" />
    </svg>
  )
}

/** Ventana de código estilizada (para secciones sobre desarrollo). */
export function CodeWindowIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 180" fill="none" className={cn("w-full h-auto", className)} aria-hidden>
      <GradientDefs id="code-grad" />
      <rect x="20" y="24" width="200" height="132" rx="14" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <path d="M20 50 H220" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <circle cx="38" cy="37" r="4" fill="url(#code-grad)" />
      <circle cx="52" cy="37" r="4" fill="url(#code-grad)" opacity="0.6" />
      <circle cx="66" cy="37" r="4" fill="url(#code-grad)" opacity="0.35" />
      {/* líneas de código */}
      {[
        { y: 70, w: 60, o: 0.8, x: 40 },
        { y: 84, w: 110, o: 0.3, x: 56 },
        { y: 98, w: 80, o: 0.3, x: 56 },
        { y: 112, w: 130, o: 0.5, x: 40 },
        { y: 126, w: 70, o: 0.3, x: 56 },
        { y: 140, w: 50, o: 0.6, x: 40 },
      ].map((l, i) => (
        <rect key={i} x={l.x} y={l.y} width={l.w} height="6" rx="3" fill="url(#code-grad)" opacity={l.o} />
      ))}
    </svg>
  )
}

/** Formas decorativas flotantes para fondos de sección (sutiles). */
export function FloatingShapes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={cn("pointer-events-none", className)} aria-hidden>
      <GradientDefs id="shapes-grad" />
      <circle cx="80" cy="90" r="40" stroke="url(#shapes-grad)" strokeWidth="1.5" opacity="0.25" className="animate-float" />
      <rect x="280" y="60" width="60" height="60" rx="14" stroke="url(#shapes-grad)" strokeWidth="1.5" opacity="0.2" transform="rotate(20 310 90)" />
      <path d="M320 300 l10 20 20 10 -20 10 -10 20 -10 -20 -20 -10 20 -10z" fill="url(#shapes-grad)" opacity="0.15" className="animate-pulse-neon" />
      <circle cx="120" cy="320" r="6" fill="url(#shapes-grad)" opacity="0.4" />
    </svg>
  )
}
