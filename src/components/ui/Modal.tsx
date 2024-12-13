import { useEffect } from 'react'

// Interface for modal-komponentens props
interface ModalProps {
  isOpen: boolean          
  onClose: () => void      
  children: React.ReactNode 
  title?: string           
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' 
}

// Hovedkomponent for modal-vinduet
export function Modal({ isOpen, onClose, children, title, maxWidth = 'md' }: ModalProps) {
  // Effekt for å håndtere lukking med Escape-tasten
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    // Legger til event listener når modalen er åpen
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    // Fjerner event listener ved cleanup
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, onClose])

  // Returnerer ingenting hvis modalen er lukket
  if (!isOpen) return null

  // Definerer bredde-klasser for ulike størrelser
  const maxWidthClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  }

  // Rendrer modal-strukturen
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={`bg-white rounded-lg w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto`}>
        {/* Viser tittel-seksjonen hvis tittel er definert */}
        {title && (
          <div className="sticky top-0 bg-white px-6 py-4 border-b">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        {/* Innholds-container */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
