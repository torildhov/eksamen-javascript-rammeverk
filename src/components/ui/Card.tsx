interface CardProps {
    children: React.ReactNode
    className?: string
    title?: string
  }
  
  export function Card({ children, className = '', title }: CardProps) {
    return (
      <div className={`bg-gray-100 p-8 rounded-lg shadow-lg ${className}`}>
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            {title}
          </h2>
        )}
        {children}
      </div>
    )
  }
  