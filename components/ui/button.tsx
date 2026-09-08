import * as React from "react"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Los botones son de texto en caja baja, con la misma familia que el resto del
 * sitio. Nada de versalitas monoespaciadas, resplandores ni flechas pegadas al
 * texto: la etiqueta dice qué pasa al pulsar y eso basta.
 */
const button = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] font-medium " +
    "transition-[background-color,border-color,color] duration-150 ease-[var(--ease)] " +
    "disabled:pointer-events-none disabled:opacity-50 cursor-pointer " +
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-accent text-on-accent hover:bg-accent-hover",
        outline: "border border-line-firm text-ink hover:bg-raised",
        ghost: "text-graphite hover:bg-raised hover:text-ink",
        danger: "bg-danger text-white hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-[0.875rem]",
        md: "h-10 px-4 text-[0.9375rem]",
        lg: "h-11 px-5 text-[1rem]",
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
