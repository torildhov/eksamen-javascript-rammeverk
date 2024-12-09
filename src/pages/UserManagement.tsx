import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
  type User,
} from "../store/slices/userSlice";
import type { RootState } from "../store/store";
import type { AppDispatch } from "../store/store";
import { validateUserForm } from "../utils/userFormValidation";

export function UserManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "user",
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "user" as "admin" | "user",
    _uuid: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    role: "",
  });

  useEffect(() => {
    void dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateUserForm(newUser);

    if (validation.isValid) {
      const result = await dispatch(createUser(newUser));
      if (result.payload === null) {
        setFormErrors((prev) => ({
          ...prev,
          username: "Username already exists",
        }));
      } else {
        setNewUser({
          name: "",
          email: "",
          username: "",
          password: "",
          role: "user",
          _uuid: "",
        });
        setFormErrors({
          username: "",
          password: "",
          email: "",
          name: "",
          role: "",
        });
      }
    } else {
      setFormErrors(validation.errors);
    }
  };

  const handleDelete = async (userId: string) => {
    await dispatch(deleteUser(userId));
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser?._uuid) {
      await dispatch(
        updateUser({
          id: selectedUser._uuid,
          userData: editFormData,
        })
      );
      setIsEditModalOpen(false);
    }
  };

  type FormField = "username" | "password" | "email" | "name" | "role";
  type EditFormField = "name" | "email" | "role";

  const handleInputChange = (field: FormField, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));

    const validation = validateUserForm({
      ...newUser,
      [field]: value,
    });

    setFormErrors((prev) => ({
      ...prev,
      [field]: validation.errors[field],
    }));
  };

  const handleEditInputChange = (field: EditFormField, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));

    const validation = validateUserForm({
      ...editFormData,
      username: selectedUser?.username || "",
      password: "dummyPassword123",
      [field]: value,
    });

    setFormErrors((prev) => ({
      ...prev,
      [field]: validation.errors[field],
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-4xl space-y-8">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-6 shadow-xl mb-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            User Management
          </h2>
          <div className="text-white/90 space-y-2">
            <p>
              Efficiently manage user accounts and permissions from one central
              location.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-semibold">👥 User Control</p>
                <p className="text-sm">Create and manage user accounts</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-semibold">🔐 Role Management</p>
                <p className="text-sm">Assign admin or user roles</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-semibold">✏️ Edit Access</p>
                <p className="text-sm">Update user details and emails</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Create New User
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
                required
                autoComplete="name"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Username
              </label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                  formErrors.username ? "border-red-500" : "border-gray-300"
                }`}
                required
                autoComplete="username"
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
                autoComplete="email"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                  formErrors.password ? "border-red-500" : "border-gray-300"
                }`}
                required
                autoComplete="new-password"
              />
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                  formErrors.role ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {formErrors.role && (
                <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Create User
            </button>
          </form>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            User List
          </h2>
          <div className="space-y-4">
            {users?.map(
              (user: User, index: number) =>
                user && (
                  <div
                    key={user._uuid || index}
                    className="flex items-center justify-between p-4 border rounded-md bg-white"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">
                        Username: {user?.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        Email: {user?.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Role: {user?.role}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {user.username !== "admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              user._uuid && handleDelete(user._uuid)
                            }
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditModalOpen(false);
            }
          }}
        >
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    handleEditInputChange("name", e.target.value)
                  }
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    handleEditInputChange("email", e.target.value)
                  }
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) =>
                    handleEditInputChange("role", e.target.value)
                  }
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900 ${
                    formErrors.role ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {formErrors.role && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                )}
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
