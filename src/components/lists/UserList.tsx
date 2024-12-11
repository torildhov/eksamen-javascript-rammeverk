import { Button } from '../ui/Button'
import type { User } from '../../store/slices/userSlice'

interface UserListProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: string) => void
}

export function UserList({ users, onEdit, onDelete }: UserListProps) {
  return (
    <div className="space-y-4">
      {users?.map((user, index) => (
        <div 
          key={user._uuid || index} 
          className="flex items-center justify-between p-4 border rounded-md bg-white"
        >
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">Username: {user.username}</p>
            <p className="text-sm text-gray-500">Email: {user.email}</p>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
          </div>
          {user.username !== 'admin' && (
            <div className="flex gap-2">
              <Button onClick={() => onEdit(user)}>Edit</Button>
              <Button 
                variant="danger" 
                onClick={() => user._uuid && onDelete(user._uuid)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
