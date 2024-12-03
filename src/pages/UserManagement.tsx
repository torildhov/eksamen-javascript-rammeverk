import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, createUser, deleteUser, updateUser, type User } from '../store/slices/userSlice'
import type { RootState } from '../store/store'
import type { AppDispatch } from '../store/store'

export function UserManagement() {
  const dispatch = useDispatch<AppDispatch>()
  const users = useSelector((state: RootState) => state.users.users)
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user'
  })

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    _uuid: ''
  })

  useEffect(() => {
    void dispatch(fetchUsers())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(createUser(newUser))
    setNewUser({
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'user',
      _uuid: ''
    })
  }

  const handleDelete = async (userId: string) => {
    await dispatch(deleteUser(userId))
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role
    })
    setIsEditModalOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedUser?._uuid) {
      await dispatch(updateUser({ 
        id: selectedUser._uuid, 
        userData: editFormData 
      }))
      setIsEditModalOpen(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-4xl space-y-8">
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Create New User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Username</label>
              <input
                type="text"
                value={newUser.username}
                onChange={e => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Role</label>
              <select
                value={newUser.role}
                onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">User List</h2>
          <div className="space-y-4">
            {users?.map((user: User, index: number) => (
              <div key={user._uuid || index} className="flex items-center justify-between p-4 border rounded-md bg-white">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">Username: {user.username}</p>
                  <p className="text-sm text-gray-500">Email: {user.email}</p>
                  <p className="text-sm text-gray-500">Role: {user.role}</p>
                </div>
                <div className="flex gap-2">
                  {user.username !== 'admin' && (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => user._uuid && handleDelete(user._uuid)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={e => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={e => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900">Role</label>
                <select
                  value={editFormData.role}
                  onChange={e => setEditFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                  className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
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
  )
}
