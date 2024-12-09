import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import type { RootState } from '../store/store'
import { fetchCVs } from '../store/slices/cvSlice'
import type { AppDispatch } from '../store/store'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40
  },
  header: {
    borderBottom: '2px solid #1F2937',
    paddingBottom: 15,
    marginBottom: 25
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    letterSpacing: 1
  },
  contactInfo: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8
  },
  contactText: {
    fontSize: 11,
    color: '#4B5563'
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15
  },
  skill: {
    backgroundColor: '#EFF6FF',
    padding: '6 12',
    borderRadius: 15,
    fontSize: 10,
    color: '#1D4ED8'
  },
  experienceItem: {
    marginBottom: 15,
    paddingLeft: 12,
    borderLeft: '2px solid #E5E7EB'
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3
  },
  company: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 3
  },
  period: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6
  },
  descriptionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 6,
    marginBottom: 3
  },
  description: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.5,
    textAlign: 'justify'
  }
})

export function CVDetail() {
  const { id } = useParams()
  const cv = useSelector((state: RootState) => 
    state.cv.cvs.find(cv => cv._uuid === id)
  )

  const dispatch = useDispatch<AppDispatch>()

  
  useEffect(() => {
    void dispatch(fetchCVs())
  }, [dispatch])
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([])
  const [searchSkill, setSearchSkill] = useState('')
  const [selectedEducation, setSelectedEducation] = useState<string[]>([])
  const [selectedReferences, setSelectedReferences] = useState<string[]>([])

  const filteredSkills = cv?.skills.filter(skill => 
    skill.toLowerCase().startsWith(searchSkill.toLowerCase())
  )
  
  const CVDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{cv?.personalInfo.name}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>{cv?.personalInfo.email}</Text>
            <Text style={styles.contactText}>•</Text>
            <Text style={styles.contactText}>{cv?.personalInfo.phone}</Text>
          </View>
        </View>
  
        <View>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {selectedSkills.map((skill, index) => (
              <Text key={index} style={styles.skill}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
  
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {cv?.education
            .filter(edu => selectedEducation.includes(edu.institution))
            .map((edu, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{edu.degree}</Text>
                <Text style={styles.company}>{edu.institution}</Text>
                <Text style={styles.period}>{edu.year}</Text>
              </View>
            ))}
        </View>
  
        <View>
          <Text style={styles.sectionTitle}>Experience</Text>
          {cv?.experience
            .filter(exp => selectedExperiences.includes(exp.title))
            .map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{exp.title}</Text>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.period}>{exp.years}</Text>
                <Text style={styles.descriptionTitle}>Job Description</Text>
                <Text style={styles.description}>{exp.description}</Text>
                <Text style={styles.descriptionTitle}>Related Projects</Text>
                <Text style={styles.description}>{exp.projects}</Text>
              </View>
            ))}
        </View>
  
        <View>
          <Text style={styles.sectionTitle}>References</Text>
          {cv?.references
            .filter(ref => selectedReferences?.includes(ref.name))
            .map((ref, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{ref.name}</Text>
                <Text style={styles.description}>{ref.contactInfo}</Text>
              </View>
            ))}
        </View>
      </Page>
    </Document>
  )

  return (
<div className="min-h-screen bg-gray-900 p-8">

<div className="max-w-4xl mx-auto">
  <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg shadow-lg p-6 mb-8">
    <h2 className="text-2xl font-bold text-white mb-3">Export Your Professional CV</h2>
    <div className="text-white/90 space-y-2">
      <p>Customize and export your CV in a clean, professional format.</p>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="font-semibold">✨ Select Content</p>
          <p className="text-sm">Choose which skills and experiences to include</p>
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
</div>



  <div className="max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg p-8">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Export CV</h2>
    
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <p className="font-medium text-gray-900">{cv?.personalInfo.name}</p>
          <p className="text-sm text-gray-500">Email: {cv?.personalInfo.email}</p>
          <p className="text-sm text-gray-500">Phone: {cv?.personalInfo.phone}</p>
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
        <input
          type="text"
          value={searchSkill}
          onChange={(e) => setSearchSkill(e.target.value)}
          className="block w-full rounded-md border px-3 py-2 mb-4 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
          placeholder="Search skills..."
        />
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredSkills?.map((skill, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSkills([...selectedSkills, skill])
                    } else {
                      setSelectedSkills(selectedSkills.filter(s => s !== skill))
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
            {cv?.education.map((edu, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedEducation.includes(edu.institution)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedEducation([...selectedEducation, edu.institution])
                    } else {
                      setSelectedEducation(selectedEducation.filter(i => i !== edu.institution))
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
      {cv?.experience.map((exp, index) => (
        <label key={index} className="flex items-start">
          <input
            type="checkbox"
            checked={selectedExperiences.includes(exp.title)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedExperiences([...selectedExperiences, exp.title])
              } else {
                setSelectedExperiences(selectedExperiences.filter(title => title !== exp.title))
              }
            }}
            className="appearance-none h-5 w-5 border border-gray-300 rounded bg-white checked:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all duration-200 ease-in-out cursor-pointer relative before:content-['✔'] before:hidden checked:before:block before:absolute before:text-emerald-600 before:font-bold before:text-sm before:top-0 before:left-[3px] mt-1"
          />
          <div className="ml-2 flex-1">
            <p className="text-gray-900 font-medium">{exp.title}</p>
            <p className="text-sm text-gray-500">{exp.company} - {exp.years}</p>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Job Description:</p>
              <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Related Projects:</p>
              <p className="text-sm text-gray-600 mt-1">{exp.projects}</p>
            </div>
          </div>
        </label>
      ))}
    </div>
  </div>
</div>


      {/* References Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">References</h3>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="space-y-3">
            {cv?.references.map((ref, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedReferences?.includes(ref.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedReferences([...selectedReferences || [], ref.name])
                    } else {
                      setSelectedReferences(selectedReferences?.filter(name => name !== ref.name))
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

      <div className="flex justify-center mb-6">
      <PDFDownloadLink
  document={<CVDocument />}
  fileName={`${cv?.personalInfo.name}-CV.pdf`}
  className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 hover:text-white transition-colors font-semibold"
>
  Download CV
</PDFDownloadLink>
</div>
      {/* PDF Viewer */}
      <div className="mt-8">
  <PDFViewer className="w-full h-[1200px] rounded-lg shadow-lg">
    <CVDocument />
  </PDFViewer>
</div>
    </div>
  </div>
</div>


  )
}
