import { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validateCVForm } from "../../utils/CVFormValidation";
import type { CV, Education, Experience, Reference } from "../../store/slices/cvSlice";
import type { User } from "../../store/slices/userSlice";
import type { CVFormErrors } from "../../utils/CVFormValidation";


// Definerer props-interface for CV-skjemakomponenten
interface CVFormProps {
  onSubmit: (cvData: Omit<CV, "_uuid">) => Promise<void>;
  initialData?: Partial<CV>;
  submitLabel?: string;
  currentUser: User | null;
  users?: User[];
  isModal?: boolean;
  formErrors?: CVFormErrors;
  onCancel?: () => void;
}

// Hovedkomponent for CV-skjemaet
export function CVForm({
  onSubmit,
  initialData = {},
  submitLabel = "Create CV",
  currentUser,
  users = [],
  isModal = false,
  onCancel
}: CVFormProps) {
  // State for å holde styr på valgt bruker-ID (viktig for admin-funksjonalitet)
  const [selectedUserId, setSelectedUserId] = useState<string>(
    currentUser?._uuid || ""
  );

  // Hovedstate for skjemadata med standard verdier
  const [formData, setFormData] = useState({
    personalInfo: {
      name: initialData.personalInfo?.name || currentUser?.name || '',
      email: initialData.personalInfo?.email || currentUser?.email || '',
      phone: initialData.personalInfo?.phone || ''
    },
    skills: initialData.skills || [],
    education: initialData.education || [],
    experience: initialData.experience || [],
    references: initialData.references || []
  })

  // State for midlertidig lagring av ny ferdighet
  const [newSkill, setNewSkill] = useState("");

  // State for å håndtere valideringsfeil i skjemaet
  const [formErrors, setFormErrors] = useState<CVFormErrors>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
    },
    skills: [],
    education: [],
    experience: [],
    references: [],
  });

  // Effect hook som oppdaterer skjemadata basert på brukervalg
  useEffect(() => {
    if (!initialData.personalInfo) {
      if (currentUser?.role === 'user') {
        // Setter standardverdier for vanlig bruker
        setFormData({
          personalInfo: {
            name: currentUser.name,
            email: currentUser.email,
            phone: ''
          },
          skills: [],
          education: [],
          experience: [],
          references: []
        })
      } else if (selectedUserId) {
        // Setter verdier basert på admin-valgt bruker
        const selectedUser = users.find(u => u._uuid === selectedUserId)
        if (selectedUser) {
          setFormData({
            personalInfo: {
              name: selectedUser.name,
              email: selectedUser.email,
              phone: ''
            },
            skills: [],
            education: [],
            experience: [],
            references: []
          })
        }
      }
    }
  }, [currentUser, selectedUserId, users, initialData.personalInfo])

  // Håndterer innsending av skjemaet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCVForm(formData);

    if (validation.isValid) {
      // Bestemmer målbruker basert på rolle
      const targetUserId = currentUser?.role === 'admin' ? selectedUserId : currentUser?._uuid;
    
      if (!targetUserId) {
        return;
      }

      // Oppretter komplett CV-dataobjekt
      const cvData = {
        ...formData,
        userId: targetUserId,
        _user: targetUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      //Sender CV-data
      await onSubmit(cvData);

      // Nullstiller skjemaet etter vellykket innsending
      setFormData({
        personalInfo: {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          phone: ''
        },
        skills: [],
        education: [],
        experience: [],
        references: []
      })
      setFormErrors({
        personalInfo: { name: '', email: '', phone: '' },
        skills: [],
        education: [],
        experience: [],
        references: []
      })
    } else {
      // Setter eventuelle valideringsfeil
      setFormErrors(validation.errors);
    }
  };

  // Håndterer tillegg av nye ferdigheter
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  // Håndterer fjerning av ferdigheter
  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Håndterer endringer i utdanningsseksjonen
  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      education: prev.education.map((edu: Education, i: number) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  // Legger til ny tom utdanningsoppføring
  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", year: "" }],
    }));
  };

  // Fjerner en utdanningsoppføring
  const handleRemoveEducation = (index: number) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      education: prev.education.filter(
        (_: Education, i: number) => i !== index
      ),
    }));
  };


  // Håndterer endringer i erfaringsseksjonen
  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      experience: prev.experience.map((exp: Experience, i: number) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  // Legger til ny tom erfaringsoppføring
  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: "",
          company: "",
          years: "",
          description: "",
          projects: "",
        },
      ],
    }));
  };

  // Fjerner en erfaringsoppføring
  const handleRemoveExperience = (index: number) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      experience: prev.experience.filter(
        (_: Experience, i: number) => i !== index
      ),
    }));
  };

  // Håndterer endringer i referanseseksjonen
  const handleReferenceChange = (
    index: number,
    field: keyof Reference,
    value: string
  ) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      references: prev.references.map((ref: Reference, i: number) =>
        i === index ? { ...ref, [field]: value } : ref
      ),
    }));
  };

  // Legger til ny tom referanseoppføring
  const handleAddReference = () => {
    setFormData((prev) => ({
      ...prev,
      references: [...prev.references, { name: "", contactInfo: "" }],
    }));
  };

  // Fjerner en referanseoppføring
  const handleRemoveReference = (index: number) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      references: prev.references.filter(
        (_: Reference, i: number) => i !== index
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-100 p-8 rounded-lg">
      {/* Brukervalg-seksjon (Vises kun for admin) */}
      {currentUser?.role === 'admin' && !isModal && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-900">Select User</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-gray-900"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._uuid} value={user._uuid}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Personlig informasjon-seksjon */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-gray-900 font-medium">
              {formData.personalInfo.name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-gray-900 font-medium">
              {formData.personalInfo.email}
            </p>
          </div>
          <Input
            label="Phone"
            value={formData.personalInfo.phone}
            onChange={e => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
            error={formErrors.personalInfo.phone}
            required
          />
        </div>
      </div>

      {/* Ferdigheter-seksjon */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            error={formErrors.skills[formData.skills.length]}
          />
          <Button type="button" onClick={handleAddSkill}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {formData.skills.map((skill, index) => (
            <div key={index} className="bg-blue-100 text-blue-800 h-7 px-3 flex items-center rounded-full gap-2">
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="bg-blue-100 text-blue-800 hover:text-blue-900 h-5 flex items-center"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Utdanning-seksjon */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
        <Button type="button" onClick={handleAddEducation}>Add Education</Button>
        <div className="space-y-4 mt-4">
          {formData.education.map((edu, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  className="bg-white text-gray-400 hover:text-red-600 transition-colors"
                >
                  ❌
                </button>
              </div>
              <div className="space-y-4">
                <Input
                  label="Institution"
                  value={edu.institution}
                  onChange={e => handleEducationChange(index, 'institution', e.target.value)}
                  error={formErrors.education[index]?.institution}
                  required
                />
                <Input
                  label="Degree"
                  value={edu.degree}
                  onChange={e => handleEducationChange(index, 'degree', e.target.value)}
                  error={formErrors.education[index]?.degree}
                  required
                />
                <Input
                  label="Graduated Year"
                  value={edu.year}
                  onChange={e => handleEducationChange(index, 'year', e.target.value)}
                  error={formErrors.education[index]?.year}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arbeidserfaring-seksjon */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience</h3>
        <Button type="button" onClick={handleAddExperience}>Add Experience</Button>
        <div className="space-y-4 mt-4">
          {formData.experience.map((exp, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(index)}
                  className="bg-white text-gray-400 hover:text-red-600 transition-colors"
                >
                  ❌
                </button>
              </div>
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={exp.title}
                  onChange={e => handleExperienceChange(index, 'title', e.target.value)}
                  error={formErrors.experience[index]?.title}
                  required
                />
                <Input
                  label="Company"
                  value={exp.company}
                  onChange={e => handleExperienceChange(index, 'company', e.target.value)}
                  error={formErrors.experience[index]?.company}
                  required
                />
                <Input
                  label="Years"
                  value={exp.years}
                  onChange={e => handleExperienceChange(index, 'years', e.target.value)}
                  error={formErrors.experience[index]?.years}
                  placeholder="YYYY-YYYY or YYYY-Present"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-900">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={e => handleExperienceChange(index, 'description', e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-gray-900"
                    rows={3}
                  />
                  {formErrors.experience[index]?.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.experience[index]?.description}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Projects</label>
                  <textarea
                    value={exp.projects}
                    onChange={e => handleExperienceChange(index, 'projects', e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-gray-900"
                    rows={3}
                  />
                  {formErrors.experience[index]?.projects && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.experience[index]?.projects}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referanser-seksjon */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">References</h3>
        <Button type="button" onClick={handleAddReference}>Add Reference</Button>
        <div className="space-y-4 mt-4">
          {formData.references.map((ref, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => handleRemoveReference(index)}
                  className="bg-white text-gray-400 hover:text-red-600 transition-colors"
                >
                  ❌
                </button>
              </div>
              <div className="space-y-4">
                <Input
                  label="Name"
                  value={ref.name}
                  onChange={e => handleReferenceChange(index, 'name', e.target.value)}
                  error={formErrors.references[index]?.name}
                  required
                />
                <Input
                  label="Contact Info"
                  value={ref.contactInfo}
                  onChange={e => handleReferenceChange(index, 'contactInfo', e.target.value)}
                  error={formErrors.references[index]?.contactInfo}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Handlingsknapper */}
      <div className="flex justify-end gap-4">
        <Button type="submit">{submitLabel}</Button>
        {isModal && onCancel && (
          <Button variant="danger" onClick={onCancel} type="button">
            Cancel
          </Button>
        )}
      </div>
    </form>
  )



}
