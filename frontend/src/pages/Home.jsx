import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Recycle, Search, ArrowRight, BookOpen, Cpu, Home as HomeIcon, Dumbbell, Package } from 'lucide-react'

const domains = [
  { name: 'Academics', icon: BookOpen, color: 'bg-blue-500', description: 'Books, calculators, lab equipment' },
  { name: 'Projects & Electronics', icon: Cpu, color: 'bg-purple-500', description: 'Arduino, Raspberry Pi, sensors' },
  { name: 'Hostel & Campus Life', icon: HomeIcon, color: 'bg-green-500', description: 'Furniture, room essentials' },
  { name: 'Sports & Fitness', icon: Dumbbell, color: 'bg-orange-500', description: 'Cycles, sports equipment' },
  { name: 'Other Resources', icon: Package, color: 'bg-pink-500', description: 'Stationery, notes, misc' },
]

function Home() {
  const { user } = useAuth()

  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Campus<span className="text-campus-green">Cycle</span>
        </h1>
        <p className="text-xl text-gray-600 mb-2">Reuse • Share • Save • Sustain</p>
        <p className="text-gray-500 max-w-2xl mx-auto mb-8">
          Your university-exclusive resource sharing platform. Buy, sell, rent, lend, and donate
          academic and campus resources with fellow students.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/browse"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <Search className="h-5 w-5" />
            Browse Resources
          </Link>
          {!user && (
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 border border-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Join CampusCycle
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Domains Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Browse by Domain</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {domains.map((domain) => (
            <Link
              key={domain.name}
              to={`/domain/${domain.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className={`w-12 h-12 ${domain.color} rounded-lg flex items-center justify-center mb-4`}>
                <domain.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{domain.name}</h3>
              <p className="text-sm text-gray-500">{domain.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-campus-green rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">List Your Item</h3>
            <p className="text-sm text-gray-500">Sell, rent, lend, or donate resources you no longer need</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-campus-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Find What You Need</h3>
            <p className="text-sm text-gray-500">Search, browse, or request resources from fellow students</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-campus-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Connect & Exchange</h3>
            <p className="text-sm text-gray-500">Chat, negotiate, and meet at campus pickup locations</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">4</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Rate & Review</h3>
            <p className="text-sm text-gray-500">Build trust through ratings and transaction history</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 bg-campus-green rounded-2xl p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">500+</div>
            <div className="text-green-100">Students</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">1,200+</div>
            <div className="text-green-100">Resources Listed</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">800+</div>
            <div className="text-green-100">Exchanges</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">50K+</div>
            <div className="text-green-100">Saved by Students</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
