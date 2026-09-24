import type { Metadata } from "next"

/**
 * Las demos son negocios ficticios: no deben aparecer en Google como si
 * existieran. Se siguen sus enlaces, pero no se indexan. La página que compite
 * en buscadores es la ficha de cada solución.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function DemosLayout({ children }: { children: React.ReactNode }) {
  return children
}
