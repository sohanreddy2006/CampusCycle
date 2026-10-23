import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { MessageCircle, Send, ArrowLeft, LoaderCircle, Package } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const byRecent = (a, b) =>
  new Date(b.lastMessageAt || b.updatedAt || 0) - new Date(a.lastMessageAt || a.updatedAt || 0)

function timeLabel(value) {
  const date = new Date(value)
  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return isToday ? time : `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${time}`
}

function Messages() {
  const { user, loading } = useAuth()
  const socket = useSocket()
  const [searchParams, setSearchParams] = useSearchParams()

  const [conversations, setConversations] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState(null)

  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [msgsLoading, setMsgsLoading] = useState(false)
  const [msgsError, setMsgsError] = useState(null)

  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)

  const messagesEndRef = useRef(null)
  const activeIdRef = useRef(null)

  useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])

  const loadConversations = useCallback(async () => {
    try {
      setListError(null)
      const res = await api.get('/conversations')
      setConversations([...res.data.conversations].sort(byRecent))
    } catch (error) {
      setListError('Could not load conversations')
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    loadConversations()
  }, [user, loadConversations])

  // Deep link from Message buttons: /messages?user=<id>&listing=<id>
  useEffect(() => {
    if (!user) return
    const userId = searchParams.get('user')
    const listingId = searchParams.get('listing')
    if (!userId) return

    let cancelled = false
    ;(async () => {
      try {
        const res = await api.post('/conversations', {
          userId,
          ...(listingId ? { listingId } : {}),
        })
        if (cancelled) return
        const conv = res.data
        setConversations((prev) => {
          const rest = prev.filter((c) => c._id !== conv._id)
          return [conv, ...rest].sort(byRecent)
        })
        setActiveId(conv._id)
        setMobileThreadOpen(true)
        setSearchParams({}, { replace: true })
      } catch (error) {
        setListError('Could not start conversation')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user, searchParams, setSearchParams])

  const loadMessages = useCallback(async (id) => {
    setMsgsLoading(true)
    setMsgsError(null)
    try {
      const res = await api.get(`/conversations/${id}/messages`)
      setMessages([...res.data.messages].reverse())
      await api.put(`/conversations/${id}/read`)
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, unreadCount: 0 } : c))
      )
    } catch (error) {
      setMsgsError('Could not load messages')
    } finally {
      setMsgsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeId) loadMessages(activeId)
  }, [activeId, loadMessages])

  // Realtime: incoming messages
  useEffect(() => {
    if (!socket) return

    const onMessage = (payload) => {
      const { conversationId, message } = payload
      if (activeIdRef.current === conversationId) {
        setMessages((prev) =>
          prev.some((m) => m._id === message._id) ? prev : [...prev, message]
        )
        api.put(`/conversations/${conversationId}/read`).catch(() => {})
        setConversations((prev) =>
          prev.map((c) =>
            c._id === conversationId
              ? {
                  ...c,
                  lastMessage: message.content,
                  lastMessageAt: message.createdAt,
                  unreadCount: 0,
                }
              : c
          )
        )
      } else {
        setConversations((prev) => {
          const exists = prev.some((c) => c._id === conversationId)
          if (!exists) {
            loadConversations()
            return prev
          }
          return prev.map((c) =>
            c._id === conversationId
              ? {
                  ...c,
                  lastMessage: message.content,
                  lastMessageAt: message.createdAt,
                  unreadCount: (c.unreadCount || 0) + 1,
                }
              : c
          )
        })
      }
    }

    socket.on('message:new', onMessage)
    return () => {
      socket.off('message:new', onMessage)
    }
  }, [socket, loadConversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openConversation = (id) => {
    setActiveId(id)
    setMobileThreadOpen(true)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    const content = input.trim()
    if (!content || !activeId || sending) return
    setSending(true)
    try {
      const res = await api.post(`/conversations/${activeId}/messages`, { content })
      setMessages((prev) => [...prev, res.data])
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeId
            ? { ...c, lastMessage: content, lastMessageAt: res.data.createdAt }
            : c
        ).sort(byRecent)
      )
      setInput('')
    } catch (error) {
      toast.error('Could not send message')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoaderCircle className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Logged In</h2>
          <p className="text-gray-500">Please log in to view your messages</p>
        </div>
      </div>
    )
  }

  const active = conversations.find((c) => c._id === activeId)
  const other = active
    ? active.participants.find((p) => String(p._id) !== String(user._id))
    : null

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: '70vh' }}>
        {/* Conversation list */}
        <div
          className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${
            mobileThreadOpen ? 'hidden md:block' : 'block'
          }`}
        >
          {listLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : listError ? (
            <div className="p-6 text-center">
              <p className="text-sm text-red-600">{listError}</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-10 text-center">
              <MessageCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                No conversations yet — open a listing and hit <strong>Message</strong> to
                start one.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
              {conversations.map((c) => {
                const peer =
                  c.participants.find((p) => String(p._id) !== String(user._id)) ||
                  c.participants[0]
                const unread = c.unreadCount || 0
                return (
                  <li key={c._id}>
                    <button
                      onClick={() => openConversation(c._id)}
                      className={`w-full text-left flex items-start gap-3 p-4 hover:bg-gray-50 ${
                        c._id === activeId ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        {peer?.avatar ? (
                          <img
                            src={peer.avatar}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary-600 font-bold">
                            {peer?.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-gray-900 truncate">{peer?.name}</p>
                          {c.lastMessageAt && (
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {formatDistanceToNow(new Date(c.lastMessageAt), {
                                addSuffix: true,
                              })}
                            </span>
                          )}
                        </div>
                        {c.listing && (
                          <p className="text-xs text-primary-600 truncate flex items-center gap-1">
                            <Package className="h-3 w-3" /> {c.listing.title}
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm text-gray-500 truncate">
                            {c.lastMessage || 'No messages yet'}
                          </p>
                          {unread > 0 && (
                            <span className="h-4 min-w-4 px-1 bg-red-500 rounded-full text-xs text-white flex items-center justify-center flex-shrink-0">
                              {unread > 9 ? '9+' : unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Thread */}
        <div
          className={`bg-white rounded-xl border border-gray-200 flex flex-col ${
            mobileThreadOpen ? 'block' : 'hidden md:flex'
          }`}
          style={{ minHeight: '70vh' }}
        >
          {!activeId ? (
            <div className="flex-1 flex items-center justify-center p-10 text-center">
              <div>
                <MessageCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Select a conversation to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <button
                  onClick={() => setMobileThreadOpen(false)}
                  className="md:hidden p-1 text-gray-500 hover:text-gray-800"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                  {other?.avatar ? (
                    <img
                      src={other.avatar}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-600 font-bold text-sm">
                      {other?.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{other?.name}</p>
                  {active.listing && (
                    <Link
                      to={`/listing/${active.listing._id}`}
                      className="text-xs text-primary-600 hover:underline truncate flex items-center gap-1"
                    >
                      <Package className="h-3 w-3" /> {active.listing.title}
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-10 bg-gray-100 rounded-xl animate-pulse w-1/2 ${
                          i % 2 === 0 ? 'ml-auto' : ''
                        }`}
                      />
                    ))}
                  </div>
                ) : msgsError ? (
                  <p className="text-sm text-red-600 text-center">{msgsError}</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No messages yet — say hello!
                  </p>
                ) : (
                  <>
                    {messages.map((m) => {
                      const mine = String(m.sender?._id) === String(user._id)
                      return (
                        <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                              mine
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words text-sm">{m.content}</p>
                            <p
                              className={`text-[10px] mt-1 ${
                                mine ? 'text-green-100' : 'text-gray-400'
                              }`}
                            >
                              {timeLabel(m.createdAt)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <form onSubmit={handleSend} className="p-3 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  maxLength={2000}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
