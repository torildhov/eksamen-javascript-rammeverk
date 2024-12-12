import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  deleteUser,
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

export function UserManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    void dispatch(fetchUsers());
  }, [dispatch]);

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

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    openModal();
  };

  const handleDelete = async (userId: string) => {
    const result = await dispatch(deleteUser(userId));
    if (result.payload) {
      toast.success("User deleted successfully");
    } else {
      toast.error("Failed to delete user");
    }
  };

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
