import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-accent/15 blur-2xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-[12px] border border-line bg-paper text-accent">
          <Icon className="h-7 w-7" strokeWidth={1.4} />
        </div>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-graphite">{description}</p>
      {actionHref && actionLabel && (
        <Button href={actionHref} className="mt-6">{actionLabel}</Button>
      )}
    </Card>
  )
}
