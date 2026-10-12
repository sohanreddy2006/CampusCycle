import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Calendar, BadgeCheck, Tag, ArrowLeft, Trash2, CircleCheckBig } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatDate, getStatusColor } from '../utils/helpers'

function RequestDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequest()
  }, [id])

  const fetchRequest = async () => {
    try {
      const res = await api.get(`/requests/${id}`)
      setRequest(res.data)
    } catch (error) {
      toast.error('Request not found')
      navigate('/requests')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this request?')) return
    try {
      await api.delete(`/requests/${request._id}`)
      toast.success('Request deleted')
      navigate('/requests')
    } catch (error) {
      toast.error('Failed to delete request')
    }
  }

  const handleFulfill = async () => {
    try {
      const res = await api.put(`/requests/${request._id}/fulfill`, {})
      setRequest(res.data)
      toast.success('Request marked as fulfilled!')
    } catch (error) {
      toast.error('Failed to fulfill request')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!request) return null

  const isOwner = user && request.requester?._id === user._id

  const typeColors = {
    buy: 'bg-blue-100 text-blue-800',
    rent: 'bg-purple-100 text-purple-800',
    borrow: 'bg-green-100 text-green-800',
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-5 w-5" />
        Back to Requests
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 border-b border-primary-200">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${typeColors[request.type]}`}>
              {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
            </span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(request.status)}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
        </div>

        <div className="p-6">
          {request.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{request.description}</p>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              {request.requiredDate
                ? `Needed by ${formatDate(request.requiredDate)}`
                : 'No deadline set'}
            </div>
            {request.duration && (
              <div className="text-sm text-gray-600">
                Duration: <span className="font-medium">{request.duration}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {request.tags?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {request.tags.map((tag, i) => (
                  <Link
                    key={i}
                    to={`/tag/${tag}`}
                    className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm hover:bg-primary-100"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matched Listing */}
          {request.matchedListing && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CircleCheckBig className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-900">Matched with listing</h3>
              </div>
              <Link
                to={`/listing/${request.matchedListing._id}`}
                className="text-green-700 hover:text-green-800 font-medium"
              >
                {request.matchedListing.title}
              </Link>
            </div>
          )}

          {/* Requester Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <Link to={`/user/${request.requester?._id}`} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  {request.requester?.avatar ? (
                    <img src={request.requester.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-lg text-primary-600 font-bold">
                      {request.requester?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    {request.requester?.name}
                    {request.requester?.verified && <BadgeCheck className="h-4 w-4 text-primary-500" />}
                  </p>
                  <p className="text-sm text-gray-500">
                    Posted {formatDate(request.createdAt)}
                  </p>
                </div>
              </Link>

              {!isOwner && user && request.status === 'active' && (
                <Link
                  to={`/messages?user=${request.requester?._id}`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  I can help!
                </Link>
              )}
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && request.status === 'active' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-medium text-blue-900 mb-3">Manage Request</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleFulfill}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  <CircleCheckBig className="h-4 w-4" />
                  Mark as Fulfilled
                </button>
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
        </div>
      </div>
    </div>
  )
}

export default RequestDetail
