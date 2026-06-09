import { NextResponse } from "next/server"
import { getSiteMetrics } from "@/lib/data"

// Métricas públicas para los heros (reales de BD + editables). Cacheadas.
export async function GET() {
  const metrics = await getSiteMetrics()
  return NextResponse.json(metrics)
}
