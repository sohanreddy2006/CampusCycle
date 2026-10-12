import { Link } from 'react-router-dom'
import { MapPin, BadgeCheck, Eye } from 'lucide-react'
import { getStatusColor } from '../../utils/helpers'

function ListingCard({ listing }) {
  const typeColors = {
    sell: 'bg-blue-100 text-blue-800',
    rent: 'bg-purple-100 text-purple-800',
    lend: 'bg-green-100 text-green-800',
    donate: 'bg-pink-100 text-pink-800',
  }

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 group"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {listing.photos?.[0] ? (
          <img
            src={listing.photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeColors[listing.type]}`}>
            {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
          </span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.status)}`}>
            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
          </span>
        </div>

        {listing.views > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            <Eye className="h-3 w-3" />
            {listing.views}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
          {listing.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{listing.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {listing.type === 'donate' ? (
              <span className="text-campus-green">Free</span>
            ) : listing.type === 'rent' ? (
              <span>${listing.rentPrice || listing.price}<span className="text-sm font-normal text-gray-500">/day</span></span>
            ) : listing.type === 'lend' ? (
              <span className="text-campus-blue">Lend</span>
            ) : (
              <span>${listing.price}</span>
            )}
          </div>

          {listing.condition && (
            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
              {listing.condition.replace('_', ' ')}
            </span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
              {listing.owner?.avatar ? (
                <img src={listing.owner.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xs text-primary-600 font-medium">
                  {listing.owner?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-600 flex items-center gap-1">
              {listing.owner?.name}
              {listing.owner?.verified && <BadgeCheck className="h-3 w-3 text-primary-500" />}
            </span>
          </div>

          {listing.location && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </span>
          )}
        </div>

        {listing.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {listing.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
            {listing.tags.length > 3 && (
              <span className="text-xs text-gray-400">+{listing.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default ListingCard
