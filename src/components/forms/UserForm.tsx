import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validateUserForm } from "../../utils/userFormValidation";
import type { User } from "../../store/slices/userSlice";

interface FormErrors {
  username: string;
  password: string;
  email: string;
  name: string;
  role: string;
}

interface UserFormProps {
  onSubmit: (userData: Omit<User, "_uuid">) => Promise<void>
  initialData?: Partial<User>
  submitLabel?: string
  isModal?: boolean
  onCancel?: () => void
}

export function UserForm({
  onSubmit,
  initialData = {},
  submitLabel = "Create User",
  isModal = false,
  onCancel
}: UserFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    username: initialData.username || "",
    password: "",
    role: initialData.role || "user",
  });

  const [localFormErrors, setLocalFormErrors] = useState<FormErrors>({
    username: "",
    password: "",
    email: "",
    name: "",
    role: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateUserForm(formData);

    if (validation.isValid) {
      await onSubmit(formData);
      setFormData({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'user'
      })
      setLocalFormErrors({
        username: '',
        password: '',
        email: '',
        name: '',
        role: ''
      })
    } else {
      setLocalFormErrors(validation.errors);
    }
  };

  const handleInputChange = (field: keyof FormErrors, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setLocalFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        error={localFormErrors.name}
        required
      />

      <Input
        label="Username"
        value={formData.username}
        onChange={(e) => handleInputChange("username", e.target.value)}
        error={localFormErrors.username}
        required
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        error={localFormErrors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        error={localFormErrors.password}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-900">Role</label>
        <select
          value={formData.role}
          onChange={(e) => handleInputChange("role", e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 bg-white text-gray-900 ${
            localFormErrors.role ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {localFormErrors.role && (
          <p className="text-red-500 text-sm mt-1">{localFormErrors.role}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
  <Button type="submit">{submitLabel}</Button>
  {isModal && (
    <Button variant="danger" onClick={onCancel} type="button">
      Cancel
    </Button>
  )}
</div>

    </form>
  );
}
