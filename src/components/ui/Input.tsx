interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
  }
  
  export function Input({ 
    label, 
    error, 
    className = '', 
    ...props 
  }: InputProps) {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-1">
            {label}
          </label>
        )}
        <input
          className={`
            mt-1 block w-full rounded-md border px-3 py-2 
            focus:outline-none focus:border-blue-500 
            bg-white text-gray-900
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }
  