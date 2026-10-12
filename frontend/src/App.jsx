import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'
import CreateListing from './pages/CreateListing'
import ListingDetail from './pages/ListingDetail'
import BrowseListings from './pages/BrowseListings'
import TagPage from './pages/TagPage'
import Requests from './pages/Requests'
import CreateRequest from './pages/CreateRequest'
import RequestDetail from './pages/RequestDetail'
import Notifications from './pages/Notifications'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/browse" element={<BrowseListings />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/tag/:slug" element={<TagPage />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/create-request" element={<CreateRequest />} />
              <Route path="/request/:id" element={<RequestDetail />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
