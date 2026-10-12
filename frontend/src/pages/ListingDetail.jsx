import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MapPin, BadgeCheck, Eye, Heart, MessageCircle, Calendar, Tag, ChevronLeft, ChevronRight, Edit, Trash2, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatDate, getStatusColor } from '../utils/helpers'
import TagFollowButton from '../components/tags/TagFollowButton'

function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [wishlist, setWishlist] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    fetchListing()
  }, [id])

  const fetchListing = async () => {
    try {
      const res = await api.get(`/listings/${id}`)
      setListing(res.data)
    } catch (error) {
      toast.error('Listing not found')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    try {
      await api.delete(`/listings/${listing._id}`)
      toast.success('Listing deleted')
      navigate('/')
    } catch (error) {
      toast.error('Failed to delete listing')
    }
  }

  const handleStatusChange = async (status) => {
    try {
      const res = await api.put(`/listings/${listing._id}/status`, { status })
      setListing(res.data)
      toast.success(`Listing marked as ${status}`)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleWishlist = async () => {
    try {
      const res = await api.post(`/users/wishlist/${listing._id}`)
      setWishlist(res.data.added)
      toast.success(res.data.added ? 'Added to wishlist' : 'Removed from wishlist')
    } catch (error) {
      toast.error('Please login to use wishlist')
    }
  }

  const handleReserve = async () => {
    if (!user) {
      toast.error('Please login to reserve')
      return
    }
    try {
      await api.post('/reservations', { listingId: listing._id, duration: '3' })
      toast.success('Item reserved! You have 3 days to complete the exchange.')
      fetchListing()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reserve')
    }
  }

  const handleCancelReservation = async () => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return
    setCancelLoading(true)
    try {
      const reservationsRes = await api.get(`/reservations/listing/${listing._id}`)
      const reservation = reservationsRes.data.find(r => r.status === 'active' || r.status === 'pending')
      if (reservation) {
        await api.put(`/reservations/${reservation._id}/cancel`)
        toast.success('Reservation cancelled')
        fetchListing()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel reservation')
    } finally {
      setCancelLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!listing) return null

  const isOwner = user && listing.owner?._id === user._id
  const isReservedByUser = user && listing.reservedBy && (listing.reservedBy._id === user._id || listing.reservedBy === user._id)

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ChevronLeft className="h-5 w-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photos */}
        <div>
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square relative">
            {listing.photos?.length > 0 ? (
              <>
                <img
                  src={listing.photos[currentPhoto]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPhoto(prev => prev > 0 ? prev - 1 : listing.photos.length - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPhoto(prev => prev < listing.photos.length - 1 ? prev + 1 : 0)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {listing.photos?.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {listing.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPhoto(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                    i === currentPhoto ? 'ring-2 ring-primary-600' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  listing.type === 'sell' ? 'bg-blue-100 text-blue-800' :
                  listing.type === 'rent' ? 'bg-purple-100 text-purple-800' :
                  listing.type === 'lend' ? 'bg-green-100 text-green-800' :
                  'bg-pink-100 text-pink-800'
                }`}>
                  {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(listing.status)}`}>
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
            </div>

            <div className="flex gap-2">
              {user && !isOwner && (
                <button
                  onClick={handleWishlist}
                  className={`p-2 rounded-lg border ${wishlist ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Heart className={`h-5 w-5 ${wishlist ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          </div>

          <div className="text-3xl font-bold text-gray-900 mb-6">
            {listing.type === 'donate' ? (
              <span className="text-campus-green">Free</span>
            ) : listing.type === 'rent' ? (
              <span>${listing.rentPrice || listing.price}<span className="text-lg font-normal text-gray-500">/day</span></span>
            ) : listing.type === 'lend' ? (
              <span className="text-campus-blue">Available to Lend</span>
            ) : (
              <span>${listing.price}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6 whitespace-pre-wrap">{listing.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Listed {formatDate(listing.createdAt)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="h-4 w-4" />
              {listing.views} views
            </div>
            {listing.condition && (
              <div className="text-sm text-gray-600">
                Condition: <span className="font-medium capitalize">{listing.condition.replace('_', ' ')}</span>
              </div>
            )}
            {listing.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {listing.location}
              </div>
            )}
          </div>

          {listing.deposit > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Deposit required:</strong> ${listing.deposit}
              </p>
            </div>
          )}

          {/* Owner Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <Link to={`/user/${listing.owner?._id}`} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  {listing.owner?.avatar ? (
                    <img src={listing.owner.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-lg text-primary-600 font-bold">
                      {listing.owner?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    {listing.owner?.name}
                    {listing.owner?.verified && <BadgeCheck className="h-4 w-4 text-primary-500" />}
                  </p>
                  <p className="text-sm text-gray-500">
                    ★ {listing.owner?.reputation?.rating > 0
                      ? (listing.owner.reputation.rating / listing.owner.reputation.totalRatings).toFixed(1)
                      : 'New'}
                  </p>
                </div>
              </Link>

              {!isOwner && user && (
                <Link
                  to={`/messages?user=${listing.owner?._id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Link>
              )}
            </div>
          </div>

          {/* Reserve Button for non-owners */}
          {!isOwner && user && listing.status === 'available' && listing.type !== 'donate' && (
            <div className="mb-6">
              <button
                onClick={handleReserve}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-campus-green text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <Clock className="h-5 w-5" />
                Reserve This Item (3 days)
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Reserve now, meet and complete the exchange within 3 days
              </p>
            </div>
          )}

          {/* Reservation Status */}
          {listing.status === 'reserved' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">This item is currently reserved</span>
              </div>
              {listing.reservedUntil && (
                <p className="text-sm text-yellow-700 mt-1">
                  Until {formatDate(listing.reservedUntil)}
                </p>
              )}
              {listing.reservedBy && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      {listing.reservedBy.avatar ? (
                        <img src={listing.reservedBy.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-sm text-yellow-700 font-bold">
                          {listing.reservedBy.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-yellow-800">Reserved by <strong>{listing.reservedBy.name}</strong></span>
                  </div>
                  {isOwner && (
                    <Link
                      to={`/messages?user=${listing.reservedBy._id}`}
                      className="flex items-center gap-1 px-3 py-1 bg-white border border-yellow-300 rounded-lg text-sm font-medium text-yellow-800 hover:bg-yellow-100"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </Link>
                  )}
                </div>
              )}
              {isReservedByUser && (
                <button
                  onClick={handleCancelReservation}
                  disabled={cancelLoading}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  {cancelLoading ? 'Cancelling...' : 'Cancel Reservation'}
                </button>
              )}
            </div>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-3">Manage Listing</h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/edit-listing/${listing._id}`}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                {listing.status === 'available' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('sold')}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      Mark as Sold
                    </button>
                    <button
                      onClick={() => handleStatusChange('reserved')}
                      className="px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700"
                    >
                      Mark as Reserved
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          {listing.tags?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Link
                      to={`/tag/${tag}`}
                      className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm hover:bg-primary-100"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Link>
                    {user && (
                      <TagFollowButton
                        tag={{ _id: tag, name: tag, slug: tag, count: 0, followers: [] }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListingDetail
