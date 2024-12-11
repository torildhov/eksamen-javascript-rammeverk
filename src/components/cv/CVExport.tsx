import { PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from '../ui/Button'
import { CVDocument } from './CVDocument'
import type { CV } from '../../store/slices/cvSlice'

interface CVExportProps {
  cv: CV | undefined
  selectedSections: {
    skills: string[]
    education: string[]
    experience: string[]
    references: string[]
  }
}

export function CVExport({ cv, selectedSections }: CVExportProps) {
  if (!cv) return null

  return (
    <div className="flex justify-center mb-6">
      <PDFDownloadLink
        document={<CVDocument cv={cv} selectedSections={selectedSections} />}
        fileName={`${cv.personalInfo.name}-CV.pdf`}
      >
        <Button variant="primary">Download CV</Button>
      </PDFDownloadLink>
    </div>
  )
}



