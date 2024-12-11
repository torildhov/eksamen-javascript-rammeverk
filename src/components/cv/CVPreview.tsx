import { PDFViewer } from '@react-pdf/renderer'
import { CVDocument } from './CVDocument'
import type { CV } from '../../store/slices/cvSlice'

interface CVPreviewProps {
  cv: CV | undefined
  selectedSections: {
    skills: string[]
    education: string[]
    experience: string[]
    references: string[]
  }
}

export function CVPreview({ cv, selectedSections }: CVPreviewProps) {
  if (!cv) return <div>Loading CV data...</div>
  
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
    console.error('PDF Preview Error:', error)
    return <div>Error loading PDF preview</div>
  }
}
