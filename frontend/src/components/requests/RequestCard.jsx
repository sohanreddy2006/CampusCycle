import { Link } from 'react-router-dom'
import { Calendar, Tag, MapPin, BadgeCheck } from 'lucide-react'
import { formatDate, getStatusColor } from '../../utils/helpers'

function RequestCard({ request }) {
  const typeColors = {
    buy: 'bg-blue-100 text-blue-800',
    rent: 'bg-purple-100 text-purple-800',
    borrow: 'bg-green-100 text-green-800',
  }

  return (
    <Link
      to={`/request/${request._id}`}
      className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-200 block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${typeColors[request.type]}`}>
            {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
          </span>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{request.title}</h3>

      {request.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{request.description}</p>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
        {request.requiredDate && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Needed by {formatDate(request.requiredDate)}
          </span>
        )}
        {request.duration && (
          <span>Duration: {request.duration}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {request.tags?.slice(0, 4).map((tag, i) => (
          <span key={i} className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
            {request.requester?.avatar ? (
              <img src={request.requester.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-xs text-primary-600 font-medium">
                {request.requester?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-600 flex items-center gap-1">
            {request.requester?.name}
            {request.requester?.verified && <BadgeCheck className="h-3 w-3 text-primary-500" />}
          </span>
        </div>

        <span className="text-xs text-gray-400">
          {formatDate(request.createdAt)}
        </span>
      </div>
    </Link>
  )
}

export default RequestCard
