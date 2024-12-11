export interface CVFormData {
  personalInfo: {
    name: string
    email: string
    phone: string
  }
  skills: string[]
  education: Array<{
    institution: string
    degree: string
    year: string
  }>
  experience: Array<{
    title: string
    company: string
    years: string
    description?: string
    projects?: string
  }>
  references: Array<{
    name: string
    contactInfo: string
  }>
}

export interface CVFormErrors {
  personalInfo: {
    name: string
    email: string
    phone: string
  }
  skills: string[]
  education: Array<{
    institution: string
    degree: string
    year: string
  }>
  experience: Array<{
    title: string
    company: string
    years: string
    description: string
    projects: string
  }>
  references: Array<{
    name: string
    contactInfo: string
  }>
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegexWithCodeAndSpace = /^\+[0-9]{2,4}\s[0-9]{8}$/
  const phoneRegexWithCodeNoSpace = /^\+[0-9]{2,4}[0-9]{8}$/
  const phoneRegexNoCode = /^[0-9]{8}$/
  return phoneRegexWithCodeAndSpace.test(phone) || 
         phoneRegexWithCodeNoSpace.test(phone) || 
         phoneRegexNoCode.test(phone)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(name)
}

export const validateSkill = (skill: string): boolean => {
  return skill.length >= 2 && /^[a-zA-ZæøåÆØÅ\s-+#.]+$/.test(skill)
}

export const validateInstitution = (institution: string): boolean => {
  return institution.length >= 2 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(institution)
}

export const validateDegree = (degree: string): boolean => {
  return degree.length >= 2 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(degree)
}

export const validateYear = (year: string): boolean => {
  const currentYear = new Date().getFullYear()
  const yearNumber = parseInt(year)
  return !isNaN(yearNumber) && yearNumber >= 1960 && yearNumber <= currentYear
}

export const validateTitle = (title: string): boolean => {
  return title.length >= 2 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(title)
}

export const validateCompany = (company: string): boolean => {
  return company.length >= 2 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(company)
}

export const validateYears = (years: string): boolean => {
  const yearsRegex = /^(19|20)\d{2}-(19|20)\d{2}|Present$/
  return yearsRegex.test(years)
}

export const validateDescription = (description: string): boolean => {
  if (!description) return true
  const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length
  return wordCount <= 150
}

export const validateProjects = (projects: string): boolean => {
  if (!projects) return true
  const wordCount = projects.trim().split(/\s+/).filter(word => word.length > 0).length
  return wordCount <= 150
}

export const validateRefName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(name)
}

export const validateContactInfo = (contactInfo: string): boolean => {
  return validateEmail(contactInfo) || validatePhone(contactInfo)
}

export const validateCVForm = (formData: CVFormData) => {
  const errors: CVFormErrors = {
    personalInfo: {
      name: !validateName(formData.personalInfo.name) ? 
        'Name must be at least 2 characters and contain only letters, spaces, or hyphens' : '',
      email: !validateEmail(formData.personalInfo.email) ? 
        'Please enter a valid email address (e.g., user@example.com)' : '',
      phone: !validatePhone(formData.personalInfo.phone) ? 
        'Please enter a valid phone number (8 digits with optional country code, e.g., +47 12345678)' : ''
    },
    skills: formData.skills.map(skill => 
      !validateSkill(skill) ? 'Skill must be at least 2 characters and contain only letters, numbers, and basic symbols' : ''
    ),
    education: formData.education.map(edu => ({
      institution: !validateInstitution(edu.institution) ? 
        'Institution name must be at least 2 characters' : '',
      degree: !validateDegree(edu.degree) ? 
        'Degree must be at least 2 characters' : '',
      year: !validateYear(edu.year) ? 
        `Year must be between 1960 and ${new Date().getFullYear()}` : ''
    })),
    experience: formData.experience.map(exp => ({
      title: !validateTitle(exp.title) ? 
        'Job title must be at least 2 characters' : '',
      company: !validateCompany(exp.company) ? 
        'Company name must be at least 2 characters' : '',
      years: !validateYears(exp.years) ? 
        'Please use format YYYY-YYYY or YYYY-Present' : '',
      description: exp.description && !validateDescription(exp.description) ? 
        'Description must not exceed 150 words' : '',
      projects: exp.projects && !validateProjects(exp.projects) ? 
        'Projects description must not exceed 150 words' : ''
    })),
    references: formData.references.map(ref => ({
      name: !validateRefName(ref.name) ? 
        'Reference name must be at least 2 characters' : '',
      contactInfo: !validateContactInfo(ref.contactInfo) ? 
        'Please enter a valid email or phone number for contact information' : ''
    }))
  }

  const isValid = 
    !errors.personalInfo.name &&
    !errors.personalInfo.email &&
    !errors.personalInfo.phone &&
    !errors.skills.some(error => error) &&
    !errors.education.some(edu => edu.institution || edu.degree || edu.year) &&
    !errors.experience.some(exp => exp.title || exp.company || exp.years || exp.description || exp.projects) &&
    !errors.references.some(ref => ref.name || ref.contactInfo)

  return { isValid, errors }
}
