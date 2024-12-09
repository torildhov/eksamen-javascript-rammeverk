import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCVs,
  createCV,
  deleteCV,
  updateCV,
  type CV,
  type Education,
  type Experience,
  type Reference,
} from "../store/slices/cvSlice";
import type { RootState } from "../store/store";
import type { AppDispatch } from "../store/store";
import {
  validateEmail,
  validateName,
  validatePhone,
  validateInstitution,
  validateDegree,
  validateYear,
  validateTitle,
  validateCompany,
  validateYears,
  validateDescription,
  validateProjects,
  validateRefName,
  validateContactInfo,
  validateSkill,
} from "../utils/CVFormValidation";
import { fetchUsers } from "../store/slices/userSlice";

export function CVList() {
  const dispatch = useDispatch<AppDispatch>();
  const cvs = useSelector((state: RootState) => state.cv.cvs);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [currentSkill, setCurrentSkill] = useState("");

  const users = useSelector((state: RootState) => state.users.users);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isAdmin = currentUser?.role === "admin";
  const [selectedUserId, setSelectedUserId] = useState(
    currentUser?._uuid || ""
  );
  const navigate = useNavigate()

  const [newCV, setNewCV] = useState<Omit<CV, "_uuid">>({
    userId: selectedUserId || currentUser?._uuid || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

  useEffect(() => {
    void dispatch(fetchCVs());
  }, [dispatch]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      void dispatch(fetchUsers());
    }
  }, [dispatch, isAdmin]);

  useEffect(() => {
    setNewCV((prev) => ({
      ...prev,
      userId: selectedUserId || currentUser?._uuid || "",
    }));
  }, [selectedUserId, currentUser]);

  const handleModalPersonalInfoChange = (field: string, value: string) => {
    if (!selectedCV) return;
    setIsSubmitted(true);
    setSelectedCV({
      ...selectedCV,
      personalInfo: { ...selectedCV.personalInfo, [field]: value },
    });
  };

  const handleModalEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    if (!selectedCV) return;
    setIsSubmitted(true);
    const updatedEducation = selectedCV.education.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setSelectedCV({
      ...selectedCV,
      education: updatedEducation,
    });
  };

  const handleModalExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    if (!selectedCV) return;
    setIsSubmitted(true);
    const updatedExperience = selectedCV.experience.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setSelectedCV({
      ...selectedCV,
      experience: updatedExperience,
    });
  };

  const handleModalReferenceChange = (
    index: number,
    field: keyof Reference,
    value: string
  ) => {
    if (!selectedCV) return;
    setIsSubmitted(true);
    const updatedReferences = selectedCV.references.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setSelectedCV({
      ...selectedCV,
      references: updatedReferences,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateName(newCV.personalInfo.name)) {
      return;
    }

    if (!validateEmail(newCV.personalInfo.email)) {
      return;
    }

    if (!validatePhone(newCV.personalInfo.phone)) {
      return;
    }

    const isEducationValid = newCV.education.every(
      (edu) =>
        validateInstitution(edu.institution) &&
        validateDegree(edu.degree) &&
        validateYear(edu.year)
    );

    if (!isEducationValid) {
      return;
    }

    const newCVWithTimestamp = {
      ...newCV,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dispatch(createCV(newCVWithTimestamp));
    setNewCV({
      userId: user?._uuid || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      personalInfo: { name: "", email: "", phone: "" },
      skills: [],
      education: [],
      experience: [],
      references: [],
    });
    setIsSubmitted(false);
  };

  const handleDelete = async (cvId: string) => {
    await dispatch(deleteCV(cvId));
  };

  const handleEdit = (cv: CV) => {
    setSelectedCV(cv);
    setIsEditModalOpen(true);
    setIsSubmitted(false);
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && validateSkill(currentSkill.trim())) {
      setNewCV((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }));
      setCurrentSkill("");
    }
  };

  const handleRemoveEducation = (index: number) => {
    setNewCV((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setIsSubmitted(true);
    setNewCV((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleAddEducation = () => {
    setNewCV((prev) => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", year: "" }],
    }));
  };

  const handleAddExperience = () => {
    setNewCV((prev) => ({
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

  const handleAddReference = () => {
    setNewCV((prev) => ({
      ...prev,
      references: [...prev.references, { name: "", contactInfo: "" }],
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setNewCV((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setIsSubmitted(true);
    setNewCV((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-4xl space-y-8">
        
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-6 shadow-xl mb-8 mt-8">
  <h2 className="text-2xl font-bold text-white mb-3">Create Your Professional CV</h2>
  <div className="text-white/90 space-y-2">
    <p>Our CV builder helps you create a polished, professional CV that showcases your skills and experience.</p>
    <div className="grid md:grid-cols-3 gap-4 mt-4">
      <div className="bg-white/10 p-3 rounded-lg">
        <p className="font-semibold">✨ Easy to Use</p>
        <p className="text-sm">Step-by-step form with clear sections</p>
      </div>
      <div className="bg-white/10 p-3 rounded-lg">
        <p className="font-semibold">📄 Professional Format</p>
        <p className="text-sm">Clean, modern layout for your CV</p>
      </div>
      <div className="bg-white/10 p-3 rounded-lg">
        <p className="font-semibold">🚀 Export Ready</p>
        <p className="text-sm">Download as PDF when complete</p>
      </div>
    </div>
  </div>
</div>


        <div className="bg-gray-100 p-8 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Create New CV
          </h2>
          {isAdmin && (
            <div className="mb-6">
              <label className="text-xl font-semibold text-gray-900">
                Select User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-2">
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newCV.personalInfo.name}
                    onChange={(e) =>
                      setNewCV((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          name: e.target.value,
                        },
                      }))
                    }
                    className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                      isSubmitted &&
                      (!newCV.personalInfo.name ||
                        !validateName(newCV.personalInfo.name))
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {isSubmitted &&
                    (!newCV.personalInfo.name ||
                      !validateName(newCV.personalInfo.name)) && (
                      <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                        Please enter a valid name
                      </div>
                    )}
                </div>

                <div className="relative mb-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={newCV.personalInfo.email}
                    onChange={(e) =>
                      setNewCV((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          email: e.target.value,
                        },
                      }))
                    }
                    className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                      isSubmitted &&
                      (!newCV.personalInfo.email ||
                        !validateEmail(newCV.personalInfo.email))
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {isSubmitted &&
                    (!newCV.personalInfo.email ||
                      !validateEmail(newCV.personalInfo.email)) && (
                      <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                        Please enter a valid email
                      </div>
                    )}
                </div>
              </div>

              <div className="relative w-1/2 mb-2">
                <input
                  type="tel"
                  placeholder="+47 12345678"
                  value={newCV.personalInfo.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9+\s]/g, "");
                    setNewCV((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: value },
                    }));
                  }}
                  className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                    isSubmitted &&
                    (!newCV.personalInfo.phone ||
                      !validatePhone(newCV.personalInfo.phone))
                      ? "border-red-500"
                      : ""
                  }`}
                  maxLength={13}
                />
                {isSubmitted &&
                  (!newCV.personalInfo.phone ||
                    !validatePhone(newCV.personalInfo.phone)) && (
                    <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                      Please enter a valid phone number
                    </div>
                  )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Add a skill"
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                      currentSkill && !validateSkill(currentSkill)
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {currentSkill && !validateSkill(currentSkill) && (
                    <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                      Please enter a valid skill.
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                  disabled={!validateSkill(currentSkill)}
                >
                  Add Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newCV.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 mt-8"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedSkills = newCV.skills.filter(
                          (_, i) => i !== index
                        );
                        setNewCV((prev) => ({
                          ...prev,
                          skills: updatedSkills,
                        }));
                      }}
                      className="text-blue-800 hover:opacity-80 transition-opacity ml-1 font-bold bg-blue-100 text-sm leading-none"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Education</h3>
              {newCV.education.map((education, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gray-50 p-4 rounded"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 flex-grow">
                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Institution"
                        value={education.institution}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                        className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                          isSubmitted &&
                          (education.institution ||
                            education.degree ||
                            education.year) &&
                          !validateInstitution(education.institution)
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {isSubmitted &&
                        (education.institution ||
                          education.degree ||
                          education.year) &&
                        !validateInstitution(education.institution) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Please enter a valid institution
                          </div>
                        )}
                    </div>

                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Degree"
                        value={education.degree}
                        onChange={(e) =>
                          handleEducationChange(index, "degree", e.target.value)
                        }
                        className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                          isSubmitted &&
                          (education.institution ||
                            education.degree ||
                            education.year) &&
                          !validateDegree(education.degree)
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {isSubmitted &&
                        (education.institution ||
                          education.degree ||
                          education.year) &&
                        !validateDegree(education.degree) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Please enter a valid degree
                          </div>
                        )}
                    </div>

                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Year (YYYY)"
                        value={education.year}
                        onChange={(e) =>
                          handleEducationChange(index, "year", e.target.value)
                        }
                        className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                          isSubmitted &&
                          (education.institution ||
                            education.degree ||
                            education.year) &&
                          !validateYear(education.year)
                            ? "border-red-500"
                            : ""
                        }`}
                        maxLength={4}
                      />
                      {isSubmitted &&
                        (education.institution ||
                          education.degree ||
                          education.year) &&
                        !validateYear(education.year) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Please enter a valid graduation year
                          </div>
                        )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="text-base hover:opacity-80 transition-opacity bg-gray-50"
                  >
                    ❌
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddEducation}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors"
              >
                Add Education
              </button>
            </div>

            {/* Experience Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Experience
              </h3>
              {newCV.experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-md space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={exp.title}
                        onChange={(e) =>
                          handleExperienceChange(index, "title", e.target.value)
                        }
                        className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                          isSubmitted && !validateTitle(exp.title)
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {isSubmitted && !validateTitle(exp.title) && (
                        <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                          Please add a valid title
                        </div>
                      )}
                    </div>

                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                          isSubmitted && !validateCompany(exp.company)
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {isSubmitted && !validateCompany(exp.company) && (
                        <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                          Please enter a valid company name
                        </div>
                      )}
                    </div>

                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Years (YYYY-YYYY)"
                        value={exp.years}
                        onChange={(e) =>
                          handleExperienceChange(index, "years", e.target.value)
                        }
                        className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                          isSubmitted && !validateYears(exp.years)
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {isSubmitted && !validateYears(exp.years) && (
                        <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                          Please enter valid year format
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-8 mb-12">
                    <div className="relative">
                      <textarea
                        placeholder="Job Description"
                        value={exp.description}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 min-h-[100px] ${
                          isSubmitted && !validateDescription(exp.description)
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {isSubmitted && !validateDescription(exp.description) && (
                        <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                          Maximum 150 words
                        </div>
                      )}
                    </div>

                    <div className="relative mb-4">
                      <textarea
                        placeholder="Related Projects"
                        value={exp.projects}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "projects",
                            e.target.value
                          )
                        }
                        className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 min-h-[100px] ${
                          isSubmitted && !validateProjects(exp.projects)
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {isSubmitted && !validateProjects(exp.projects) && (
                        <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                          Maximum 150 words
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(index)}
                    className="text-base hover:opacity-80 transition-opacity bg-gray-50"
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddExperience}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
              >
                Add Experience
              </button>
            </div>

            {/* References Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                References
              </h3>
              {newCV.references.map((ref, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2 bg-gray-50 p-4 rounded-md"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Name"
                      value={ref.name}
                      onChange={(e) => {
                        const updatedReferences = [...newCV.references];
                        updatedReferences[index].name = e.target.value;
                        setNewCV((prev) => ({
                          ...prev,
                          references: updatedReferences,
                        }));
                      }}
                      className={`rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                        ref.name && !validateRefName(ref.name)
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {ref.name && !validateRefName(ref.name) && (
                      <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                        Please enter a valid name
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="Contact Info (Email or Phone)"
                        value={ref.contactInfo}
                        onChange={(e) => {
                          const updatedReferences = [...newCV.references];
                          updatedReferences[index].contactInfo = e.target.value;
                          setNewCV((prev) => ({
                            ...prev,
                            references: updatedReferences,
                          }));
                        }}
                        className={`rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 w-full ${
                          ref.contactInfo &&
                          !validateContactInfo(ref.contactInfo)
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {ref.contactInfo &&
                        !validateContactInfo(ref.contactInfo) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Please enter a valid email or phone number
                          </div>
                        )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedReferences = newCV.references.filter(
                          (_, i) => i !== index
                        );
                        setNewCV((prev) => ({
                          ...prev,
                          references: updatedReferences,
                        }));
                      }}
                      className="text-base hover:opacity-80 transition-opacity bg-gray-50"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddReference}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
              >
                Add Reference
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Create CV
            </button>
          </form>
        </div>

        {/* CV List */}
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            CV List
          </h2>
          <div className="space-y-4">
            {cvs
              .filter(
                (cv) => user?.role === "admin" || cv.userId === user?._uuid
              )
              .map((cv) => (

                <div key={cv._uuid} className="flex flex-col p-4 border rounded-md bg-white">
  <div className="flex justify-between items-start">
    <div>
      <p className="font-medium text-gray-900">{cv.personalInfo.name}</p>
      <p className="text-sm text-gray-500">Email: {cv.personalInfo.email}</p>
      <p className="text-sm text-gray-500">Phone: {cv.personalInfo.phone}</p>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/dashboard/cvs/${cv._uuid}`)}
        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
      >
        Export
      </button>
      <button
        onClick={() => handleEdit(cv)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => cv._uuid && handleDelete(cv._uuid)}
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
      >
        Delete
      </button>
    </div>
  </div>
  <div className="mt-4 flex flex-wrap gap-2">
    {cv.skills.map((skill, index) => (
      <span
        key={index}
        className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
      >
        {skill}
      </span>
    ))}
  </div>
</div>



              ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedCV && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditModalOpen(false);
            }
          }}
        >
          <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Edit CV</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (selectedCV._uuid) {
                  await dispatch(
                    updateCV({
                      id: selectedCV._uuid,
                      cvData: {
                        ...selectedCV,
                        updatedAt: new Date().toISOString(),
                      },
                    })
                  );
                  setIsEditModalOpen(false);
                }
              }}
              className="space-y-6"
            >
              {/* Personal Information in modal */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={selectedCV.personalInfo.name}
                      onChange={(e) =>
                        handleModalPersonalInfoChange("name", e.target.value)
                      }
                      className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                        isSubmitted &&
                        !validateName(selectedCV.personalInfo.name)
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {isSubmitted &&
                      !validateName(selectedCV.personalInfo.name) && (
                        <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                          Please enter a valid name
                        </div>
                      )}
                  </div>

                  <div className="relative mb-2">
                    <input
                      type="email"
                      placeholder="Email"
                      value={selectedCV.personalInfo.email}
                      onChange={(e) =>
                        handleModalPersonalInfoChange("email", e.target.value)
                      }
                      className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                        isSubmitted &&
                        !validateEmail(selectedCV.personalInfo.email)
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {isSubmitted &&
                      !validateEmail(selectedCV.personalInfo.email) && (
                        <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                          Please enter a valid email address
                        </div>
                      )}
                  </div>
                </div>

                <div className="relative w-1/2 mb-2">
                  <input
                    type="tel"
                    placeholder="+47 12345678"
                    value={selectedCV.personalInfo.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9+\s]/g, "");
                      handleModalPersonalInfoChange("phone", value);
                    }}
                    className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                      isSubmitted &&
                      !validatePhone(selectedCV.personalInfo.phone)
                        ? "border-red-500"
                        : ""
                    }`}
                    maxLength={13}
                  />
                  {isSubmitted &&
                    !validatePhone(selectedCV.personalInfo.phone) && (
                      <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                        Please enter a valid phone number
                      </div>
                    )}
                </div>
              </div>

              {/* Skills Section in Modal */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="Add a skill"
                      className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                        currentSkill && !validateSkill(currentSkill)
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {currentSkill && !validateSkill(currentSkill) && (
                      <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                        Please enter a valid skill
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateSkill(currentSkill.trim())) {
                        setSelectedCV({
                          ...selectedCV,
                          skills: [...selectedCV.skills, currentSkill.trim()],
                        });
                        setCurrentSkill("");
                      }
                    }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                    disabled={!validateSkill(currentSkill)}
                  >
                    Add Skill
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCV.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 mt-8"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedSkills = selectedCV.skills.filter(
                            (_, i) => i !== index
                          );
                          setSelectedCV({
                            ...selectedCV,
                            skills: updatedSkills,
                          });
                        }}
                        className="text-blue-800 hover:opacity-80 transition-opacity ml-1 font-bold bg-blue-100 text-sm leading-none"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Education Section in modal*/}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Education
                </h3>
                {selectedCV.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 flex-grow">
                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) =>
                            handleModalEducationChange(
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                            isSubmitted && !validateInstitution(edu.institution)
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {isSubmitted &&
                          !validateInstitution(edu.institution) && (
                            <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                              Please add a valid institution
                            </div>
                          )}
                      </div>

                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) =>
                            handleModalEducationChange(
                              index,
                              "degree",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                            isSubmitted && !validateDegree(edu.degree)
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {isSubmitted && !validateDegree(edu.degree) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Please add a valid degree
                          </div>
                        )}
                      </div>

                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Year (YYYY)"
                          value={edu.year}
                          onChange={(e) =>
                            handleModalEducationChange(
                              index,
                              "year",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                            isSubmitted && !validateYear(edu.year)
                              ? "border-red-500"
                              : ""
                          }`}
                          maxLength={4}
                        />
                        {isSubmitted && !validateYear(edu.year) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Please enter a valid graduation year
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updatedEducation = selectedCV.education.filter(
                          (_, i) => i !== index
                        );
                        setSelectedCV({
                          ...selectedCV,
                          education: updatedEducation,
                        });
                      }}
                      className="text-base hover:opacity-80 transition-opacity bg-gray-50"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCV({
                      ...selectedCV,
                      education: [
                        ...selectedCV.education,
                        { institution: "", degree: "", year: "" },
                      ],
                    })
                  }
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Add Education
                </button>
              </div>

              {/* Experience Section in modal*/}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Experience
                </h3>
                {selectedCV.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-md space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Title"
                          value={exp.title}
                          onChange={(e) =>
                            handleModalExperienceChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                            isSubmitted && !validateTitle(exp.title)
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {isSubmitted && !validateTitle(exp.title) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Please enter a valid title
                          </div>
                        )}
                      </div>

                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) =>
                            handleModalExperienceChange(
                              index,
                              "company",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                            isSubmitted && !validateCompany(exp.company)
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {isSubmitted && !validateCompany(exp.company) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Please enter a valid company
                          </div>
                        )}
                      </div>

                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Years (YYYY-YYYY)"
                          value={exp.years}
                          onChange={(e) =>
                            handleModalExperienceChange(
                              index,
                              "years",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                            isSubmitted && !validateYears(exp.years)
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {isSubmitted && !validateYears(exp.years) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Please enter a valid year format
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-8">
                      <div className="relative">
                        <textarea
                          placeholder="Job Description"
                          value={exp.description}
                          onChange={(e) =>
                            handleModalExperienceChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 min-h-[100px] ${
                            isSubmitted && !validateDescription(exp.description)
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {isSubmitted &&
                          !validateDescription(exp.description) && (
                            <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                              Maximum 150 words
                            </div>
                          )}
                      </div>

                      <div className="relative mb-4">
                        <textarea
                          placeholder="Related Projects"
                          value={exp.projects}
                          onChange={(e) =>
                            handleModalExperienceChange(
                              index,
                              "projects",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 min-h-[100px] ${
                            isSubmitted && !validateProjects(exp.projects)
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {isSubmitted && !validateProjects(exp.projects) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Maximum 150 words
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updatedExperience = selectedCV.experience.filter(
                          (_, i) => i !== index
                        );
                        setSelectedCV({
                          ...selectedCV,
                          experience: updatedExperience,
                        });
                      }}
                      className="text-base hover:opacity-80 transition-opacity bg-gray-50"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCV({
                      ...selectedCV,
                      experience: [
                        ...selectedCV.experience,
                        {
                          title: "",
                          company: "",
                          years: "",
                          description: "",
                          projects: "",
                        },
                      ],
                    })
                  }
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Add Experience
                </button>
              </div>

              {/* References Section in modal*/}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  References
                </h3>
                {selectedCV.references.map((ref, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 flex-grow">
                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={ref.name}
                          onChange={(e) =>
                            handleModalReferenceChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                            isSubmitted && !validateRefName(ref.name)
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {isSubmitted && !validateRefName(ref.name) && (
                          <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                            Please add a valid name
                          </div>
                        )}
                      </div>

                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="Contact info (Email or phone)"
                          value={ref.contactInfo}
                          onChange={(e) =>
                            handleModalReferenceChange(
                              index,
                              "contactInfo",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                            isSubmitted && !validateContactInfo(ref.contactInfo)
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {isSubmitted &&
                          !validateContactInfo(ref.contactInfo) && (
                            <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                              Please enter a valid email or phone number
                            </div>
                          )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updatedReferences = selectedCV.references.filter(
                          (_, i) => i !== index
                        );
                        setSelectedCV({
                          ...selectedCV,
                          references: updatedReferences,
                        });
                      }}
                      className="text-base hover:opacity-80 transition-opacity bg-gray-50"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCV({
                      ...selectedCV,
                      references: [
                        ...selectedCV.references,
                        { name: "", contactInfo: "" },
                      ],
                    })
                  }
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Add Reference
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
