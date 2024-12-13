// Importerer CV type for typesikkerhet
import type { CV } from '../../store/slices/cvSlice'

// Interface som definerer props for skjemaet
// Håndterer både data og callback-funksjoner for seksjonshåndtering
interface CVSelectionFormProps {
  cv: CV | undefined
  // Holder oversikt over hvilke seksjoner som er valgt
  selectedSections: {
    skills: string[]
    education: string[]
    experience: string[]
    references: string[]
  }
  // Callback-funksjoner for å oppdatere valgte seksjoner
  onSectionChange: {
    skills: (skills: string[]) => void
    education: (institutions: string[]) => void
    experience: (titles: string[]) => void
    references: (names: string[]) => void
  }
  // Søkefunksjonalitet for ferdigheter
  searchSkill: string
  onSearchSkillChange: (search: string) => void
}

export function CVSelectionForm({ 
  cv, 
  selectedSections,
  onSectionChange,
  searchSkill,
  onSearchSkillChange
}: CVSelectionFormProps) {
  // Returnerer null hvis ingen CV-data er tilgjengelig
  if (!cv) return null

  // Filtrerer ferdigheter basert på søketekst
  const filteredSkills = cv.skills.filter(skill => 
    skill.toLowerCase().startsWith(searchSkill.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Personal Info Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="space-y-2">
            <p className="text-gray-900"><span className="font-medium">Name:</span> {cv.personalInfo.name}</p>
            <p className="text-gray-900"><span className="font-medium">Email:</span> {cv.personalInfo.email}</p>
            <p className="text-gray-900"><span className="font-medium">Phone:</span> {cv.personalInfo.phone}</p>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
        <input
          type="text"
          value={searchSkill}
          onChange={(e) => onSearchSkillChange(e.target.value)}
          className="block w-full rounded-md border px-3 py-2 mb-4 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
          placeholder="Search skills..."
        />
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredSkills.map((skill, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSections.skills.includes(skill)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSectionChange.skills([...selectedSections.skills, skill])
                    } else {
                      onSectionChange.skills(selectedSections.skills.filter(s => s !== skill))
                    }
                  }}
                  className="appearance-none h-5 w-5 border border-gray-300 rounded bg-white checked:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all duration-200 ease-in-out cursor-pointer relative before:content-['✔'] before:hidden checked:before:block before:absolute before:text-emerald-600 before:font-bold before:text-sm before:top-0 before:left-[3px]"
                />
                <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {skill}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="space-y-3">
            {cv.education.map((edu, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSections.education.includes(edu.institution)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSectionChange.education([...selectedSections.education, edu.institution])
                    } else {
                      onSectionChange.education(selectedSections.education.filter(i => i !== edu.institution))
                    }
                  }}
                  className="appearance-none h-5 w-5 border border-gray-300 rounded bg-white checked:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all duration-200 ease-in-out cursor-pointer relative before:content-['✔'] before:hidden checked:before:block before:absolute before:text-emerald-600 before:font-bold before:text-sm before:top-0 before:left-[3px]"
                />
                <div className="ml-2">
                  <p className="text-gray-900">{edu.institution}</p>
                  <p className="text-sm text-gray-500">{edu.degree} - {edu.year}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience</h3>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="space-y-4">
            {cv.experience.map((exp, index) => (
              <label key={index} className="flex items-start">
                <input
                  type="checkbox"
                  checked={selectedSections.experience.includes(exp.title)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSectionChange.experience([...selectedSections.experience, exp.title])
                    } else {
                      onSectionChange.experience(selectedSections.experience.filter(title => title !== exp.title))
                    }
                  }}
                  className="appearance-none h-5 w-5 border border-gray-300 rounded bg-white checked:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all duration-200 ease-in-out cursor-pointer relative before:content-['✔'] before:hidden checked:before:block before:absolute before:text-emerald-600 before:font-bold before:text-sm before:top-0 before:left-[3px] mt-1"
                />
                <div className="ml-2 flex-1">
                  <p className="text-gray-900 font-medium">{exp.title}</p>
                  <p className="text-sm text-gray-500">{exp.company} - {exp.years}</p>
                  {exp.description && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Job Description:</p>
                      <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                    </div>
                  )}
                  {exp.projects && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Related Projects:</p>
                      <p className="text-sm text-gray-600 mt-1">{exp.projects}</p>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* References Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">References</h3>
        <div className="bg-white p-4 rounded-md shadow-sm mb-4">
          <div className="space-y-3">
            {cv.references.map((ref, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSections.references.includes(ref.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSectionChange.references([...selectedSections.references, ref.name])
                    } else {
                      onSectionChange.references(selectedSections.references.filter(name => name !== ref.name))
                    }
                  }}
                  className="appearance-none h-5 w-5 border border-gray-300 rounded bg-white checked:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all duration-200 ease-in-out cursor-pointer relative before:content-['✔'] before:hidden checked:before:block before:absolute before:text-emerald-600 before:font-bold before:text-sm before:top-0 before:left-[3px]"
                />
                <div className="ml-2">
                  <p className="text-gray-900">{ref.name}</p>
                  <p className="text-sm text-gray-500">{ref.contactInfo}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

  