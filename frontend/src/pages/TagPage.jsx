import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Tag, ArrowLeft } from 'lucide-react'
import api from '../utils/api'
import ListingCard from '../components/listings/ListingCard'

function TagPage() {
  const { slug } = useParams()
  const [tag, setTag] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTag()
  }, [slug])

  const fetchTag = async () => {
    try {
      const res = await api.get(`/tags/${slug}`)
      setTag(res.data.tag)
      setListings(res.data.listings)
    } catch (error) {
      console.error('Error fetching tag:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!tag) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 text-center">
        <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Tag not found</h2>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <Link to="/browse" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-5 w-5" />
        Back to Browse
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">#{tag.name}</h1>
            <p className="text-gray-500">{listings.length} listings available</p>
          </div>
        </div>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-500 mb-4">Be the first to list something with this tag!</p>
          <Link
            to="/create-listing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Create Listing
          </Link>
        </div>
      )}
    </div>
  )
}

export default TagPage
