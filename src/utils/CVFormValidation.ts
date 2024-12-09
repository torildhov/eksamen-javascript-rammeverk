//Form validation functions for CV page
export const validatePhone = (phone: string) => {
    const phoneRegexWithCodeAndSpace = /^\+[0-9]{2,4}\s[0-9]{8}$/
    const phoneRegexWithCodeNoSpace = /^\+[0-9]{2,4}[0-9]{8}$/
    const phoneRegexNoCode = /^[0-9]{8}$/
    return phoneRegexWithCodeAndSpace.test(phone) || phoneRegexWithCodeNoSpace.test(phone) || phoneRegexNoCode.test(phone)
  }
  
  export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const validateName = (name: string) => {
    return name.length >= 4 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(name)
  }  

  export const validateSkill = (skill: string) => {
    return skill.length >= 2 && /^[a-zA-ZæøåÆØÅ\s-+#.]+$/.test(skill)
  }  

  export const validateInstitution = (institution: string) => {
    return institution.length >= 4 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(institution)
  }
  
  export const validateDegree = (degree: string) => {
    return degree.length >= 4 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(degree)
  }
  
  export const validateYear = (year: string) => {
    const currentYear = new Date().getFullYear()
    const yearNumber = parseInt(year)
    return !isNaN(yearNumber) && yearNumber >= 1960 && yearNumber <= currentYear
  }
  
  export const validateTitle = (title: string) => {
    return title.length >= 4 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(title)
  }
  
  export const validateCompany = (company: string) => {
    return company.length >= 4 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(company)
  }

  export const validateDescription = (description: string) => {
    if (!description) return true
    const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length
    return wordCount <= 150
  }
  
  export const validateProjects = (projects: string) => {
    if (!projects) return true
    const wordCount = projects.trim().split(/\s+/).filter(word => word.length > 0).length
    return wordCount <= 150
  }
  
  
  export const validateYears = (years: string) => {
    const yearsRegex = /^(19|20)\d{2}-(19|20)\d{2}|Present$/
    return yearsRegex.test(years)
  }
  
  export const validateRefName = (name: string) => {
    return name.length >= 4 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(name)
  }
  
  export const validateContactInfo = (contactInfo: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegexWithCodeAndSpace = /^\+[0-9]{2,4}\s[0-9]{8}$/
    const phoneRegexWithCodeNoSpace = /^\+[0-9]{2,4}[0-9]{8}$/
    const phoneRegexNoCode = /^[0-9]{8}$/
    return emailRegex.test(contactInfo) || phoneRegexWithCodeAndSpace.test(contactInfo) || phoneRegexWithCodeNoSpace.test(contactInfo) || phoneRegexNoCode.test(contactInfo)
  }
  
//Form validation functions for user registration page