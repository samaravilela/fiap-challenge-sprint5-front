import { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export default function Button({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  className = ''
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-white/10 text-white border border-white/30 hover:bg-white/20',
    danger: 'bg-gradient-to-r from-white via-pink-200 to-red-600 text-black',
    success: 'bg-success text-white hover:bg-success/90'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-4 text-lg',
    lg: 'px-8 py-6 text-xl'
  }
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  )
}





