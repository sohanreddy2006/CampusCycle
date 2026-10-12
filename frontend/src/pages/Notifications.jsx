import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Check, CheckCheck, Trash2, MessageCircle, Tag, Clock, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatDateTime } from '../utils/helpers'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.notifications)
      setUnreadCount(res.data.unread)
      if (res.data.unread > 0) {
        await api.put('/notifications/read-all')
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      toast.error('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n._id !== id))
      toast.success('Notification deleted')
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case 'reservation':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'tag_match':
        return <Tag className="h-5 w-5 text-purple-500" />
      case 'transaction':
        return <Package className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg font-medium"
          >
            <CheckCheck className="h-5 w-5" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification._id}
              className={`bg-white border rounded-xl p-4 flex items-start gap-4 transition-colors ${
                notification.read
                  ? 'border-gray-100'
                  : 'border-primary-200 bg-primary-50'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-primary-900'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2"></span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400">
                    {formatDateTime(notification.createdAt)}
                  </span>
                  {notification.link && (
                    <Link
                      to={notification.link}
                      onClick={() => markAsRead(notification._id)}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View
                    </Link>
                  )}
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteNotification(notification._id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

export default Notifications
