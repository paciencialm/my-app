import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { getButtonClasses } from '../utils/buttonStyles'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantInlineStyles: Record<ButtonVariant, CSSProperties> = {
  primary: { backgroundColor: '#2C3947', color: '#E8EDF2' },
  secondary: { backgroundColor: '#547A95', color: '#E8EDF2' },
  danger: { backgroundColor: '#C2A56D', color: '#2C3947' },
  ghost: { backgroundColor: 'transparent', color: '#374151' },
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClasses({ variant, size, fullWidth, className })}
      style={{ ...variantInlineStyles[variant], ...style }}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
