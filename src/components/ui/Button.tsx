// Props-interface for knappen som utvider standard HTML-knapp attributter
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success' // Definerer ulike varianter av knappen
  children: React.ReactNode
}

// Hovedkomponent for knappen med standardverdi 'primary'
export function Button({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}: ButtonProps) {
 
  const baseStyles = 'px-4 py-2 rounded-md transition-colors font-semibold'
  
  // Definerer spesifikke stiler for hver variant av knappen
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700'
  }

  // Returnerer knappen med kombinerte stiler og props
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
