import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
} from "../store/slices/userSlice";
import type { User } from "../store/slices/userSlice";
import type { RootState, AppDispatch } from "../store/store";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { UserForm } from "../components/forms/UserForm";
import { UserList } from "../components/lists/UserList";
import { useModal } from "../hooks/useModal";
import toast from "react-hot-toast";
import { cvService } from '../services/cv.service'
import { userService } from '../services/user.service'
import type { CV } from '../store/slices/cvSlice'
import { fetchCVs } from '../store/slices/cvSlice'

// Hovedkomponent for brukeradministrasjon
export function UserManagement() {
  // Hooks for tilstand og dispatch
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Henter brukerliste ved oppstart
  useEffect(() => {
    void dispatch(fetchUsers());
  }, [dispatch]);

  // Håndterer opprettelse av ny bruker
  const handleCreate = async (userData: Omit<User, "_uuid">) => {
    const result = await dispatch(createUser(userData));
    if (result.payload) {
      toast.success("User created successfully");
      void dispatch(fetchUsers());
    } else {
      toast.error("Username already exists");
      void dispatch(fetchUsers());
    }
  };

  // Håndterer oppdatering av eksisterende bruker
  const handleUpdate = async (userData: Partial<User>) => {
    if (selectedUser?._uuid) {
      const result = await dispatch(
        updateUser({
          id: selectedUser._uuid,
          userData,
        })
      );
      if (result.payload) {
        toast.success("User updated successfully");
        closeModal();
      } else {
        toast.error("Failed to update user");
      }
    }
  };

  // Håndterer redigering av bruker
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    openModal();
  };

  // Håndterer sletting av bruker og tilhørende CVer
  const handleDelete = async (id: string) => {
    const userToDelete = users.find(user => user._uuid === id);
    if (!userToDelete) return;
  
    try {
      const cvs = await cvService.getAllCVs();
      const userCVs = cvs.filter((cv: CV) => 
        cv.personalInfo.name === userToDelete.name
      );

      for (const cv of userCVs) {
        if (cv._uuid) {
          await cvService.deleteCV(cv._uuid);
        }
      }

      const result = await userService.deleteUser(id);
      if (result) {
        dispatch(fetchUsers());
        dispatch(fetchCVs());
        toast.success("User and CVs deleted successfully");
      }
    } catch {
      toast.error("Error during deletion process");
    }
  };
  
  // Rendrer brukeradministrasjonsgrensesnittet
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-4xl space-y-8">
        <Card title="Create New User">
          <UserForm onSubmit={handleCreate} />
        </Card>

        <Card title="User List">
          <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
        </Card>

        <Modal isOpen={isOpen} onClose={closeModal} title="Edit User">
          <UserForm
            onSubmit={handleUpdate}
            initialData={selectedUser || undefined}
            submitLabel="Update"
            isModal={true}
            onCancel={closeModal}
          />
        </Modal>
      </div>
    </div>
  );
}

