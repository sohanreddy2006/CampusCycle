import { useState, useEffect } from 'react'
import { Heart, Tag, Clock, Package, ExternalLink } from 'lucide-react'
import api from '../../utils/api'
import { formatDate, getStatusColor } from '../../utils/helpers'
import { Link } from 'react-router-dom'

function ProfileTabs({ userId }) {
  const [activeTab, setActiveTab] = useState('listings')
  const [listings, setListings] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [following, setFollowing] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'following', label: 'Following', icon: Tag },
    { id: 'history', label: 'History', icon: Clock },
  ]

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case 'listings':
          const listingsRes = await api.get('/users/me/listings')
          setListings(listingsRes.data)
          break
        case 'wishlist':
          const wishlistRes = await api.get('/users/me/wishlist')
          setWishlist(wishlistRes.data)
          break
        case 'following':
          const followingRes = await api.get('/users/me/following')
          setFollowing(followingRes.data)
          break
        case 'history':
          const historyRes = await api.get('/users/me/history')
          setHistory(historyRes.data)
          break
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderListings = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((listing) => (
        <Link
          key={listing._id}
          to={`/listing/${listing._id}`}
          className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="h-40 bg-gray-100">
            {listing.photos?.[0] ? (
              <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="h-12 w-12" />
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                listing.type === 'sell' ? 'bg-blue-100 text-blue-800' :
                listing.type === 'rent' ? 'bg-purple-100 text-purple-800' :
                listing.type === 'lend' ? 'bg-green-100 text-green-800' :
                'bg-pink-100 text-pink-800'
              }`}>
                {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {listing.type === 'donate' ? 'Free' : `$${listing.price}`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )

  const renderWishlist = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {wishlist.map((listing) => (
        <Link
          key={listing._id}
          to={`/listing/${listing._id}`}
          className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="h-40 bg-gray-100">
            {listing.photos?.[0] ? (
              <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="h-12 w-12" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
            <p className="text-sm text-gray-500">
              {listing.type === 'donate' ? 'Free' : `$${listing.price}`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )

  const renderFollowing = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {following.map((tag) => (
        <Link
          key={tag._id}
          to={`/tag/${tag.slug}`}
          className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">#{tag.name}</h3>
            <p className="text-sm text-gray-500">{tag.count} listings</p>
          </div>
        </Link>
      ))}
    </div>
  )

  const renderHistory = () => (
    <div className="space-y-3">
      {history.map((listing) => (
        <div key={listing._id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {listing.photos?.[0] ? (
              <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
            <p className="text-sm text-gray-500">
              {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)} • {formatDate(listing.updatedAt)}
            </p>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
          </span>
        </div>
      ))}
    </div>
  )

  const renderEmpty = (message) => (
    <div className="text-center py-12">
      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">{message}</p>
    </div>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'listings':
        return listings.length > 0 ? renderListings(listings) : renderEmpty('No listings yet')
      case 'wishlist':
        return wishlist.length > 0 ? renderWishlist() : renderEmpty('No items in wishlist')
      case 'following':
        return following.length > 0 ? renderFollowing() : renderEmpty('Not following any tags')
      case 'history':
        return history.length > 0 ? renderHistory() : renderEmpty('No transaction history')
      default:
        return null
    }
  }

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {renderContent()}
    </div>
  )
}

export default ProfileTabs
