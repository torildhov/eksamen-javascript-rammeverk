import { Button } from '../ui/Button'
import type { CV } from '../../store/slices/cvSlice'

// Interface for props som definerer hvilke handlinger som kan utføres på CV-listen
interface CVListProps {
  cvs: CV[]
  onEdit: (cv: CV) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}

// Hjelpefunksjon for å formatere dato og tid til norsk format
const formatNorwegianDateTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('no-NO', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Hovedkomponent for visning av CV-liste
export function CVList({ cvs, onEdit, onDelete, onView }: CVListProps) {
  return (
    <div className="space-y-4">
      {/* Mapper gjennom alle CVer og viser dem i kort-format */}
      {cvs.map((cv) => (
        <div key={cv._uuid} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            {/* Venstre side: CV-informasjon */}
            <div>
              {/* Personlig informasjon */}
              <h3 className="text-xl font-semibold text-gray-900">{cv.personalInfo.name}</h3>
              <p className="text-gray-600">Email: {cv.personalInfo.email}</p>
              <p className="text-gray-600">Phone: {cv.personalInfo.phone}</p>
              
              {/* Ferdigheter med begrensning på visning av 3 stk */}
              <div className="mt-2 flex flex-wrap gap-2">
                {cv.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
                {cv.skills.length > 3 && (
                  <span className="text-gray-500 text-sm">+{cv.skills.length - 3} more</span>
                )}
              </div>

              {/* Tidsstempler for opprettelse og redigering */}
              <div className="mt-2 text-sm text-gray-500">
                <p>Created: {formatNorwegianDateTime(cv.createdAt)}</p>
                {cv.updatedAt !== cv.createdAt && (
                  <p>Edited: {formatNorwegianDateTime(cv.updatedAt)}</p>
                )}
              </div>
            </div>

            {/*Handlingsknapper */}
            <div className="flex flex-col md:flex-row gap-2">
              <Button 
                onClick={() => cv._uuid && onView(cv._uuid)}
                variant="success"
              >
                Export
              </Button>
              <Button variant="primary" onClick={() => onEdit(cv)}>
                Edit
              </Button>
              <Button 
                variant="danger"
                onClick={() => cv._uuid && onDelete(cv._uuid)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

