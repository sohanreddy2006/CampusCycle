import { useState } from 'react'
import { Tag, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

function TagFollowButton({ tag, onToggle }) {
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(
    tag.followers?.includes(user?._id) || false
  )
  const [followersCount, setFollowersCount] = useState(tag.count || 0)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Please login to follow tags')
      return
    }

    setLoading(true)
    try {
      const res = await api.post(`/tags/${tag._id}/follow`)
      setIsFollowing(res.data.followed)
      setFollowersCount(res.data.followersCount)
      toast.success(res.data.followed ? 'Tag followed!' : 'Tag unfollowed')
      if (onToggle) onToggle(tag._id, res.data.followed)
    } catch (error) {
      toast.error('Failed to follow tag')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        isFollowing
          ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isFollowing ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Following
        </>
      ) : (
        <>
          <Tag className="h-3.5 w-3.5" />
          Follow
        </>
      )}
    </button>
  )
}

export default TagFollowButton
