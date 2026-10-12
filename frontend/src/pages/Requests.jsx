import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Plus, Filter, X, SlidersHorizontal } from 'lucide-react'
import RequestCard from '../components/requests/RequestCard'
import api from '../utils/api'
import { REQUEST_TYPES } from '../utils/constants'
import { useAuth } from '../context/AuthContext'

function Requests() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, total: 0 })

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
  })

  useEffect(() => {
    fetchRequests()
  }, [searchParams])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(searchParams)
      const res = await api.get('/requests', { params })
      setRequests(res.data.requests)
      setPagination({
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage,
        total: res.data.total,
      })
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (filters.search) {
      params.set('search', filters.search)
    } else {
      params.delete('search')
    }
    setSearchParams(params)
  }

  const handleTypeFilter = (type) => {
    const params = new URLSearchParams(searchParams)
    if (type) {
      params.set('type', type)
    } else {
      params.delete('type')
    }
    setSearchParams(params)
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Requests</h1>
          <p className="text-gray-500">Students looking for resources they need</p>
        </div>
        {user && (
          <Link
            to="/create-request"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            <Plus className="h-5 w-5" />
            Create Request
          </Link>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTypeFilter('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !searchParams.get('type')
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {REQUEST_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => handleTypeFilter(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchParams.get('type') === type.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          {pagination.total} {pagination.total === 1 ? 'request' : 'requests'} found
        </p>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : requests.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map(request => (
              <RequestCard key={request._id} request={request} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.set('page', page)
                    setSearchParams(params)
                  }}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === Number(pagination.currentPage)
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500">Be the first to create a request!</p>
        </div>
      )}
    </div>
  )
}

export default Requests
