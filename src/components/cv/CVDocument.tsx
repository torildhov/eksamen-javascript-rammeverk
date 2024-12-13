// Importerer nødvendige komponenter fra react-pdf/renderer for å generere PDF-dokumenter
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CV } from '../../store/slices/cvSlice'

// Interface som definerer props for CV-dokumentet, inkludert CV-data og valgte seksjoner som skal vises
interface CVDocumentProps {
  cv: CV
  selectedSections: {
    skills: string[]
    education: string[]
    experience: string[]
    references: string[]
  }
}

// Definerer alle stilene som brukes i PDF-dokumentet med react-pdf's StyleSheet
const styles = StyleSheet.create({
  // Hovedstilen for PDF-siden med vertikal layout og hvit bakgrunn
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40
  },
  // Header-seksjon stil med understrek og spacing
  header: {
    borderBottom: '2px solid #1F2937',
    paddingBottom: 15,
    marginBottom: 25,
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  // Stil for navnet i header
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    letterSpacing: 1
  },
  // Stil for kontaktinformasjon-container
  contactInfo: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8
  },
  // Stil for kontaktinformasjon-tekst
  contactText: {
    fontSize: 11,
    color: '#4B5563'
  },
  // Stil for seksjonsoverskrifter
  sectionTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  // Container for ferdigheter med flex-wrap
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15
  },
  // Stil for individuelle ferdighets-tags
  skill: {
    backgroundColor: '#EFF6FF',
    padding: '6 12',
    borderRadius: 15,
    fontSize: 10,
    color: '#1D4ED8'
  },
  // Stil for erfarings-elementer med venstre border
  experienceItem: {
    marginBottom: 15,
    paddingLeft: 12,
    borderLeft: '2px solid #E5E7EB'
  },
  // Stil for jobbtitler
  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3
  },
  // Stil for firmanavn
  company: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 3
  },
  // Stil for tidsperioder
  period: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6
  },
  // Stil for beskrivelse-overskrifter
  descriptionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 6,
    marginBottom: 3
  },
  // Stil for beskrivelsestekst
  description: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.5,
    textAlign: 'justify'
  }
})

// Hovedkomponent for PDF-generering
export function CVDocument({ cv, selectedSections }: CVDocumentProps) {
  // Sjekker om nødvendig personlig informasjon eksisterer
  if (!cv?.personalInfo) {
    console.error('Missing personal info')
    return null
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Personlig informasjon seksjonen */}
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

        {/* Ferdigheter-seksjon */}
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

        {/* Utdanning-seksjon */}
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

        {/* Arbeidserfaring-seksjon */}
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

        {/* Referanser-seksjon */}
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
