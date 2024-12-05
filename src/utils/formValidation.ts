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
  
  export const validateYears = (years: string) => {
    const yearsRegex = /^(19|20)\d{2}-(19|20)\d{2}|Present$/
    return yearsRegex.test(years)
  }
  
  export const validateRefName = (name: string) => {
    return name.length >= 4 && /^[a-zA-ZæøåÆØÅ\s-]+$/.test(name)
  }
  
  export const validateContactInfo = (contactInfo: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+[0-9]{2,4}\s[0-9]{8}$|^\+[0-9]{2,4}[0-9]{8}$|^[0-9]{8}$/
    return emailRegex.test(contactInfo) || phoneRegex.test(contactInfo)
  }
  