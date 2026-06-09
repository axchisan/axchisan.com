"use client"

import { useState, useEffect } from "react"

export interface SiteMetrics {
  projectsCount: number
  technologiesCount: number
  blogPostsCount: number
  categoriesCount: number
  yearsExperience: number
  clientsCount: number
}

/** Métricas reales del sitio (BD + editables) para los heros. */
export function useMetrics() {
  const [metrics, setMetrics] = useState<SiteMetrics | null>(null)

  useEffect(() => {
    fetch("/api/stats/public")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setMetrics(d))
      .catch(() => {})
  }, [])

  return metrics
}
