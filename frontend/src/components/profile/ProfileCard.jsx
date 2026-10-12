import { Mail, Phone, Calendar, BadgeCheck, Edit, Star } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

function ProfileCard({ user, onEdit }) {
  const avgRating = user.reputation?.totalRatings > 0
    ? (user.reputation.rating / user.reputation.totalRatings).toFixed(1)
    : '0.0'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 h-32"></div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="mb-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {user.name}
                {user.verified && (
                  <BadgeCheck className="h-6 w-6 text-primary-500" />
                )}
              </h1>
              <p className="text-gray-500 text-sm capitalize">{user.role}</p>
            </div>
          </div>

          <button
            onClick={onEdit}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </button>
        </div>

        {user.bio && (
          <p className="mt-4 text-gray-600">{user.bio}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            {user.email}
          </span>
          {user.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {user.phone}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Joined {formatDate(user.createdAt)}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
              <Star className="h-5 w-5 fill-current" />
              <span className="text-lg font-bold text-gray-900">{avgRating}</span>
            </div>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 mb-1">{user.reputation?.listings || 0}</div>
            <p className="text-xs text-gray-500">Listings</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 mb-1">{user.reputation?.completedExchanges || 0}</div>
            <p className="text-xs text-gray-500">Exchanges</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 mb-1">{user.reputation?.totalRatings || 0}</div>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
