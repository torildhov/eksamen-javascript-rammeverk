// Importerer PDFDownloadLink for å håndtere PDF-nedlasting direkte i nettleseren
// Importerer CVDocument som genererer selve PDF-innholdet
// Importerer gjenbrukbar Button-komponent for konsistent UI
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from '../ui/Button'
import { CVDocument } from './CVDocument'
import type { CV } from '../../store/slices/cvSlice'

// Interface for props som definerer hvilke data komponenten trenger
// CV kan være undefined for å håndtere tilstander hvor data ikke er lastet enda
interface CVExportProps {
  cv: CV | undefined
  // Objekt som kontrollerer hvilke seksjoner som skal inkluderes i CV-en
  selectedSections: {
    skills: string[]
    education: string[]
    experience: string[]
    references: string[]
  }
}

// Eksport-komponenten som håndterer nedlasting av CV som PDF
// Bruker destrukturering av props for bedre lesbarhet

export function CVExport({ cv, selectedSections }: CVExportProps) {

  // Tidlig retur hvis ingen CV-data er tilgjengelig
  // Dette forhindrer feil og unødvendig rendering
  if (!cv) return null

  return (
    <div className="flex justify-center mb-6">

      {/* PDFDownloadLink genererer en nedlastingslenke for PDF-en */}
      {/* Filnavnet blir automatisk generert basert på brukerens navn */}
      <PDFDownloadLink
        document={<CVDocument cv={cv} selectedSections={selectedSections} />}
        fileName={`${cv.personalInfo.name}-CV.pdf`}
      >
        {/* Bruker standard Button-komponent for konsistent utseende */}
        <Button variant="primary">Download CV</Button>
      </PDFDownloadLink>
    </div>
  )
}




