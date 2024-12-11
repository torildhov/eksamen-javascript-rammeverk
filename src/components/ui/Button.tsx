interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'success'
    children: React.ReactNode
  }
  
  export function Button({ 
    children, 
    variant = 'primary', 
    className = '',
    ...props 
  }: ButtonProps) {
    const baseStyles = 'px-4 py-2 rounded-md transition-colors font-semibold'
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700'
    }
  
    return (
      <button 
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
  