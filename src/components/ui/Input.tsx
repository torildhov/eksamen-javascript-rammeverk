// Props-interface som utvider standard HTML input attributter
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string    
  error?: string  
}

// Gjenbrukbar input-komponent med støtte for label og feilhåndtering
export function Input({ 
  label, 
  error, 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div>
      {/* Viser label hvis den er definert */}
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-1">
          {label}
        </label>
      )}
      {/* Input-felt med dynamiske stiler basert på feilstatus */}
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
      {/* Viser feilmelding hvis den er definert */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}
