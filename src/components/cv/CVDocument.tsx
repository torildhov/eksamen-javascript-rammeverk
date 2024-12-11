import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CV } from '../../store/slices/cvSlice'

interface CVDocumentProps {
  cv: CV
  selectedSections: {
    skills: string[]
    education: string[]
    experience: string[]
    references: string[]
  }
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40
  },
  header: {
    borderBottom: '2px solid #1F2937',
    paddingBottom: 15,
    marginBottom: 25,
    // Add to ensure visibility
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
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

export function CVDocument({ cv, selectedSections }: CVDocumentProps) {
  if (!cv?.personalInfo) {
    console.error('Missing personal info')
    return null
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Personal Info Section */}
        <View style={[styles.header, { marginTop: 0 }]}>
          <Text style={[styles.name, { color: '#1F2937' }]}>
            {cv.personalInfo.name}
          </Text>
          <View style={[styles.contactInfo, { marginTop: 8 }]}>
            <Text style={styles.contactText}>{cv.personalInfo.email}</Text>
            <Text style={styles.contactText}> • </Text>
            <Text style={styles.contactText}>{cv.personalInfo.phone}</Text>
          </View>
        </View>
        {selectedSections.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {selectedSections.skills.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {selectedSections.education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {cv.education
              .filter(edu => selectedSections.education.includes(edu.institution))
              .map((edu, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.jobTitle}>{edu.degree}</Text>
                  <Text style={styles.company}>{edu.institution}</Text>
                  <Text style={styles.period}>{edu.year}</Text>
                </View>
              ))}
          </View>
        )}

        {selectedSections.experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {cv.experience
              .filter(exp => selectedSections.experience.includes(exp.title))
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
        )}

        {selectedSections.references.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>References</Text>
            {cv.references
              .filter(ref => selectedSections.references.includes(ref.name))
              .map((ref, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.jobTitle}>{ref.name}</Text>
                  <Text style={styles.description}>{ref.contactInfo}</Text>
                </View>
              ))}
          </View>
        )}
      </Page>
    </Document>
  )
}