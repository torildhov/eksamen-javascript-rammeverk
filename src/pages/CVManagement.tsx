import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCVs, createCV, deleteCV, updateCV } from "../store/slices/cvSlice"
import { fetchUsers } from "../store/slices/userSlice"
import type { CV } from "../store/slices/cvSlice"
import type { RootState, AppDispatch } from "../store/store"
import type { User } from "../store/slices/userSlice"
import { Card } from "../components/ui/Card"
import { Modal } from "../components/ui/Modal"
import { CVForm } from "../components/forms/CVForm"
import { CVList } from "../components/lists/CVList"
import { useModal } from "../hooks/useModal"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { validateCVForm, type CVFormErrors } from '../utils/CVFormValidation'

// Hovedkomponent for CV-administrasjon
export function CVManagement() {
  // Hooks for tilstand og navigasjon
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  // Henter data fra Redux store
  const cvs = useSelector((state: RootState) => state.cv.cvs)
  const currentUser = useSelector((state: RootState) => state.auth.user as User | null)
  const users = useSelector((state: RootState) => state.users.users)
  
  // Modal-håndtering
  const { isOpen, openModal, closeModal } = useModal()
  
  // Lokal tilstand
  const [selectedCV, setSelectedCV] = useState<CV | null>(null)
  const [formErrors, setFormErrors] = useState<CVFormErrors>({
    personalInfo: { name: '', email: '', phone: '' },
    skills: [],
    education: [],
    experience: [],
    references: []
  })

  // Henter CVer og brukere ved oppstart
  useEffect(() => {
    void dispatch(fetchCVs())
    if (currentUser?.role === "admin") {
      void dispatch(fetchUsers())
    }
  }, [dispatch, currentUser])

  // Håndterer opprettelse av ny CV
  const handleCreate = async (cvData: Omit<CV, "_uuid">) => {
    const validation = validateCVForm(cvData)
    if (validation.isValid) {
      const result = await dispatch(
        createCV({
          ...cvData,
          userId: currentUser?._uuid || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      )
      if (result.payload) {
        void dispatch(fetchCVs())
      }
    } else {
      setFormErrors(validation.errors)
    }
  }

  // Håndterer oppdatering av eksisterende CV
  const handleUpdate = async (cvData: Partial<CV>) => {
    if (selectedCV?._uuid) {
      const validation = validateCVForm(cvData as Required<Omit<CV, '_uuid'>>)
      
      if (validation.isValid) {
        const result = await dispatch(updateCV({
          id: selectedCV._uuid,
          cvData: {
            ...cvData,
            updatedAt: new Date().toISOString()
          }
        }))
        if (result.payload) {
          toast.success("CV updated successfully")
          closeModal()
        } else {
          toast.error("Failed to update CV")
        }
      } else {
        setFormErrors(validation.errors)
      }
    }
  }

  // Håndterere for redigering, sletting og visning
  const handleEdit = (cv: CV) => {
    setSelectedCV(cv)
    openModal()
  }

  const handleDelete = async (cvId: string) => {
    const result = await dispatch(deleteCV(cvId))
    if (result.payload) {
      toast.success("CV deleted successfully")
    } else {
      toast.error("Failed to delete CV")
    }
  }

  const handleView = (cvId: string) => {
    navigate(`/dashboard/cvs/${cvId}`)
  }

  // Filtrerer CVer basert på brukerrolle
  const filteredCVs = currentUser?.role === "admin" ? cvs : cvs.filter((cv) => 
    cv.userId === currentUser?._uuid || cv.personalInfo.email === currentUser?.email
  )

  // Rendrer hovedinnholdet
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-4xl space-y-8">
        {/* Hero-seksjon */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-6 shadow-xl mb-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-3">CV Management</h2>
          <div className="text-white/90 space-y-2">
            <p>Create and manage your professional CVs with our easy-to-use builder.</p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-semibold">📝 Create CV</p>
                <p className="text-sm">Build your professional CV</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-semibold">📄 Export PDF</p>
                <p className="text-sm">Download as PDF format</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-semibold">✏️ Easy Edit</p>
                <p className="text-sm">Update your CV anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* CV-skjema og liste */}
        <Card title="Create New CV">
          <CVForm
            onSubmit={handleCreate}
            currentUser={currentUser}
            users={users}
            isModal={false}
            formErrors={formErrors}
          />
        </Card>

        <Card title="Your CVs">
          <CVList
            cvs={filteredCVs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </Card>

        {/* Redigeringsmodal */}
        <Modal isOpen={isOpen} onClose={closeModal} title="Edit CV" maxWidth="3xl">
          <CVForm
            onSubmit={handleUpdate}
            initialData={selectedCV || undefined}
            submitLabel="Update"
            currentUser={currentUser}
            users={users}
            isModal={true}
            onCancel={closeModal}
          />
        </Modal>
      </div>
    </div>
  )
}
