// Importerer PDFViewer for å vise PDF direkte i nettleseren
// Importerer CVDocument som inneholder selve PDF-strukturen
import { PDFViewer } from '@react-pdf/renderer'
import { CVDocument } from './CVDocument'
import type { CV } from '../../store/slices/cvSlice'

// Interface som definerer props for forhåndsvisning
interface CVPreviewProps {
  cv: CV | undefined
  // Objekt som kontrollerer hvilke seksjoner som skal vises i forhåndsvisningen
  selectedSections: {
    skills: string[]
    education: string[]
    experience: string[]
    references: string[]
  }
}

// Komponent for forhåndsvisning av CV i PDF-format
export function CVPreview({ cv, selectedSections }: CVPreviewProps) {
  // Viser lastestatus hvis CV-data ikke er tilgjengelig
  if (!cv) return <div>Loading CV data...</div>
  
  // Try-catch for å håndtere eventuelle renderingsfeil
  try {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">PDF Preview</h3>
        <PDFViewer className="w-full h-[1200px] rounded-lg shadow-lg">
          <CVDocument cv={cv} selectedSections={selectedSections} />
        </PDFViewer>
      </div>
    )
  } catch (error) {
    // Feilhåndtering med logging og brukermelding
    console.error('PDF Preview Error:', error)
    return <div>Error loading PDF preview</div>
  }
}
