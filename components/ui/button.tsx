import * as React from "react"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const button = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-mono text-xs uppercase tracking-[0.08em] font-medium transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-ink border border-accent hover:shadow-[0_0_32px_-8px_var(--color-accent)]",
        outline:
          "border border-border text-text hover:border-border-strong hover:bg-surface-2",
        ghost: "text-muted hover:text-text hover:bg-surface-2",
        signal:
          "bg-signal text-bg border border-signal hover:shadow-[0_0_32px_-8px_var(--color-signal)]",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-[13px]",
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
