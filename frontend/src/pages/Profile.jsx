import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ProfileCard from '../components/profile/ProfileCard'
import ProfileEdit from '../components/profile/ProfileEdit'
import ProfileTabs from '../components/profile/ProfileTabs'
import { LoaderCircle } from 'lucide-react'

function Profile() {
  const { user, loading, updateUser } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoaderCircle className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Logged In</h2>
          <p className="text-gray-500">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ProfileCard user={user} onEdit={() => setShowEditModal(true)} />

      <div className="mt-8">
        <ProfileTabs userId={user._id} />
      </div>

      {showEditModal && (
        <ProfileEdit
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedUser) => updateUser(updatedUser)}
        />
      )}
    </div>
  )
}

export default Profile
