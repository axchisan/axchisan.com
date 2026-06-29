/**
 * Sparkline SVG ligero (sin dependencias): línea + área con gradiente + punto final.
 * Server component puro. data = serie de números (ej. vistas por día).
 */
export function Sparkline({
  data,
  width = 260,
  height = 48,
  className,
}: {
  data: number[]
  width?: number
  height?: number
  className?: string
}) {
  const n = data.length
  if (n === 0) return null

  const max = Math.max(...data, 1)
  const pad = 3
  const w = width
  const h = height
  const stepX = n > 1 ? (w - pad * 2) / (n - 1) : 0
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2)
  const x = (i: number) => pad + i * stepX

  const line = data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")
  const area = `${line} L ${x(n - 1).toFixed(1)} ${h} L ${x(0).toFixed(1)} ${h} Z`
  const lastX = x(n - 1)
  const lastY = y(data[n - 1])
  const gid = `spark-${n}-${max}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden width="100%" height={h}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={lastX} cy={lastY} r="2.4" fill="var(--color-accent)" />
    </svg>
  )
}
