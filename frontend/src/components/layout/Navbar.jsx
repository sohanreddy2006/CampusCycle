import { Link } from 'react-router-dom'
import { Recycle, Search, Bell, Heart, MessageCircle, User, Plus, Menu, X, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import api from '../../utils/api'

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [msgUnread, setMsgUnread] = useState(0)
  const { user, logout } = useAuth()
  const socket = useSocket()

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      fetchWishlistCount()
      fetchMsgUnread()
      const interval = setInterval(() => {
        fetchUnreadCount()
        fetchWishlistCount()
        fetchMsgUnread()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  useEffect(() => {
    if (socket) {
      const refresh = () => fetchMsgUnread()
      socket.on('message:new', refresh)
      socket.on('message:read', refresh)
      return () => {
        socket.off('message:new', refresh)
        socket.off('message:read', refresh)
      }
    }
  }, [socket])

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count')
      setUnreadCount(res.data.count)
    } catch (error) {
      // silent
    }
  }

  const fetchWishlistCount = async () => {
    try {
      const res = await api.get('/users/me/wishlist/count')
      setWishlistCount(res.data.count)
    } catch (error) {
      // silent
    }
  }

  const fetchMsgUnread = async () => {
    try {
      const res = await api.get('/conversations/unread-count')
      setMsgUnread(res.data.count)
    } catch (error) {
      // silent
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-campus-green" />
            <span className="text-xl font-bold text-gray-900">CampusCycle</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/browse" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Browse
            </Link>
            <Link to="/requests" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Requests
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>

            {user ? (
              <>
                <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-gray-900">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile?tab=wishlist" className="relative p-2 text-gray-600 hover:text-gray-900">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>
                <Link to="/messages" className="relative p-2 text-gray-600 hover:text-gray-900">
                  <MessageCircle className="h-5 w-5" />
                  {msgUnread > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {msgUnread > 9 ? '9+' : msgUnread}
                    </span>
                  )}
                </Link>
                <Link
                  to="/create-listing"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Sell
                </Link>
                <Link to="/profile" className="p-2 text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link to="/browse" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              Browse
            </Link>
            <Link to="/requests" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              Requests
            </Link>
            {user ? (
              <>
                <Link to="/create-listing" className="block px-3 py-2 bg-primary-600 text-white rounded-lg text-center">
                  + Sell Item
                </Link>
                <Link to="/messages" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  Messages {msgUnread > 0 && `(${msgUnread})`}
                </Link>
                <Link to="/notifications" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                <Link to="/profile?tab=wishlist" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link to="/profile" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 bg-primary-600 text-white rounded-lg text-center">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
