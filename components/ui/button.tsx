import * as React from "react"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * El texto del botón de acento es oscuro, no blanco.
 *
 * Blanco sobre el verde de marca da 3.0:1 y no llega al mínimo accesible de
 * 4.5:1 — es el error que comete el sitio que sirve de referencia a este
 * diseño. Con tinta verdosa oscura sube a 5.6:1 y además se ve más caro.
 */
const button = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-medium " +
    "transition-[background-color,border-color,color,opacity] duration-150 ease-[var(--ease)] " +
    "disabled:pointer-events-none disabled:opacity-50 cursor-pointer " +
    "focus-visible:outline-2 focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        /** Acción principal. Funciona igual sobre la banda oscura y sobre el cuerpo. */
        primary:
          "bg-accent text-on-accent hover:bg-[#12bcbc] focus-visible:outline-accent",
        /** Secundaria sobre el cuerpo claro. */
        outline:
          "border border-line-firm bg-card text-ink hover:border-ink focus-visible:outline-accent-ink",
        /** Secundaria sobre la banda oscura. */
        "outline-band":
          "border border-[#2a3541] bg-transparent text-on-band hover:border-[#48586a] hover:bg-[#151d27] focus-visible:outline-accent",
        ghost:
          "text-mid hover:bg-[#eaeff5] hover:text-ink focus-visible:outline-accent-ink",
        danger: "bg-danger text-white hover:opacity-90 focus-visible:outline-danger",
      },
      size: {
        sm: "h-9 px-3.5 text-[0.9375rem]",
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-12 px-6 text-[1rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

type ButtonBaseProps = VariantProps<typeof button> & { className?: string }

type ButtonProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type AnchorProps = ButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "className"> & { href: string }

export function Button(props: ButtonProps): React.JSX.Element
export function Button(props: AnchorProps): React.JSX.Element
export function Button({ className, variant, size, ...props }: ButtonProps | AnchorProps) {
  const classes = cn(button({ variant, size }), className)
  if ("href" in props && props.href !== undefined) {
    return <Link className={classes} {...(props as AnchorProps)} />
  }
  return <button className={classes} {...(props as ButtonProps)} />
}
