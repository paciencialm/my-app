type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const baseClasses =
  'inline-flex items-center justify-center rounded-xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60'

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-lg',
  '2xl': 'px-8 py-4 text-xl',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-brand-700)] text-[var(--color-brand-50)] hover:bg-[var(--color-brand-500)] hover:text-[var(--color-brand-50)]',
  secondary:
    'bg-[var(--color-brand-500)] text-[var(--color-brand-50)] hover:bg-[var(--color-brand-700)] hover:text-[var(--color-brand-50)]',
  danger: 'bg-[var(--color-accent)] text-[var(--color-brand-700)] hover:opacity-90',
  ghost: 'bg-transparent text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]',
}

export const getButtonClasses = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}) => `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`.trim()
