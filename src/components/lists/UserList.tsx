import { Button } from '../ui/Button'
import type { User } from '../../store/slices/userSlice'

// Interface som definerer props for brukerlistens funksjonalitet
interface UserListProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: string) => void
}

// Hovedkomponent for visning av brukerliste
export function UserList({ users, onEdit, onDelete }: UserListProps) {
  return (
    <div className="space-y-4">
      {/* Mapper gjennom alle brukere, filtrerer ut null-verdier */}
      {users?.filter(user => user !== null).map((user, index) => (
        <div 
          key={user._uuid || index} 
          className="flex items-center justify-between p-4 border rounded-md bg-white"
        >
          {/* Brukerinformasjon med fallback til 'N/A' */}
          <div>
            <p className="font-medium text-gray-900">{user?.name || 'N/A'}</p>
            <p className="text-sm text-gray-500">Username: {user?.username || 'N/A'}</p>
            <p className="text-sm text-gray-500">Email: {user?.email || 'N/A'}</p>
            <p className="text-sm text-gray-500">Role: {user?.role || 'N/A'}</p>
          </div>

          {/* Handlingsknapper - vises ikke for admin brukeren i listen */}
          {user?.username !== 'admin' && (
            <div className="flex flex-col md:flex-row gap-2">
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
