import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { fetchCVs } from '../store/slices/cvSlice'
import { CVPreview } from '../components/cv/CVPreview'
import { CVExport } from '../components/cv/CVExport'
import { CVSelectionForm } from '../components/cv/CVSelectionForm'

// Hovedkomponent for CV-detaljvisning og eksport
export function CVDetail() {
  // Henter CV-ID fra URL-parametere
  const { id } = useParams()
  // Henter CV-data fra Redux store basert på ID
  const cv = useSelector((state: RootState) => 
    state.cv.cvs.find(cv => cv._uuid === id)
  )
  const dispatch = useDispatch<AppDispatch>()
  
  // Tilstand for valgte seksjoner i CV-en
  const [selectedSections, setSelectedSections] = useState({
    skills: cv?.skills || [],
    education: cv?.education.map(edu => edu.institution) || [],
    experience: cv?.experience.map(exp => exp.title) || [],
    references: cv?.references.map(ref => ref.name) || []
  })
  // Tilstand for søk etter ferdigheter
  const [searchSkill, setSearchSkill] = useState('')

  // Effekt for å laste CV-data hvis den ikke finnes
  useEffect(() => {
    if (!cv) {
      void dispatch(fetchCVs())
    } else {
      // Oppdaterer valgte seksjoner når CV-data er tilgjengelig
      setSelectedSections({
        skills: cv.skills,
        education: cv.education.map(edu => edu.institution),
        experience: cv.experience.map(exp => exp.title),
        references: cv.references.map(ref => ref.name)
      })
    }
  }, [cv, dispatch])

  // Viser lasteskjerm hvis CV ikke er tilgjengelig
  if (!cv) return <div>Loading...</div>

  // Rendrer hovedinnholdet med CV-eksport funksjonalitet
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero-seksjon med instruksjoner */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">Export Your Professional CV</h2>
          <div className="text-white/90 space-y-2">
            <p>Customize and export your CV in a clean, professional format.</p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-semibold">✨ Select Content</p>
                <p className="text-sm">Choose which skills, education, experiences and references to include</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-semibold">👀 Live Preview</p>
                <p className="text-sm">See exactly how your CV will look</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-semibold">📄 PDF Export</p>
                <p className="text-sm">Download your CV in professional PDF format</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hovedinnhold med CV-redigering og forhåndsvisning */}
        <div className="max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Export CV</h2>
          
          {/* Skjema for å velge CV-seksjoner */}
          <CVSelectionForm 
            cv={cv}
            selectedSections={selectedSections}
            onSectionChange={{
              skills: (skills) => setSelectedSections(prev => ({ ...prev, skills })),
              education: (education) => setSelectedSections(prev => ({ ...prev, education })),
              experience: (experience) => setSelectedSections(prev => ({ ...prev, experience })),
              references: (references) => setSelectedSections(prev => ({ ...prev, references }))
            }}
            searchSkill={searchSkill}
            onSearchSkillChange={setSearchSkill}
          />

          {/* Eksport-knapp og PDF-forhåndsvisning */}
          <CVExport cv={cv} selectedSections={selectedSections} />
          <CVPreview cv={cv} selectedSections={selectedSections} />
        </div>
      </div>
    </div>
  )
}
