import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Top Bar with Utility Links */}
      <div className="bg-white border-b border-gray-200 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center space-x-6 text-sm">
            <Link href="/search" className="text-gray-600 hover:text-[#C61C71]">Español</Link>
            <Link href="/search" className="text-gray-600 hover:text-[#C61C71]">Member Login</Link>
            <Link href="/search" className="text-gray-600 hover:text-[#C61C71]">Find a Doctor</Link>
          </div>
        </div>
      </div>

      {/* Main Header with Logo and Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-3xl font-bold" style={{ color: '#C61C71' }}>
                Ambetter<span className="text-gray-600">℠</span>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/search" className="text-gray-700 hover:text-[#C61C71] font-medium">
                Shop Plans
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-[#C61C71] font-medium">
                For Members
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-[#C61C71] font-medium">
                Programs & Savings
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-[#C61C71] font-medium">
                Knowledge Center
              </Link>
            </nav>

            {/* Search Icon */}
            <button className="p-2">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-600 hover:text-[#C61C71]" />
            </button>
          </div>
        </div>
      </header>

      {/* Large Hero Banner with Image Background */}
      <div 
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(198, 28, 113, 0.85), rgba(198, 28, 113, 0.85)), url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920")',
          minHeight: '500px'
        }}
      >
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Quality, affordable health insurance
            </h1>
            <p className="text-2xl text-white mb-8">
              Get covered with plans starting as low as $0/month
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/search"
                className="inline-block px-8 py-4 bg-white text-center rounded-lg font-bold text-lg hover:bg-gray-100 transition"
                style={{ color: '#C61C71' }}
              >
                Shop and Compare Plans
              </Link>
              <Link
                href="/search"
                className="inline-block px-8 py-4 border-2 border-white text-white text-center rounded-lg font-bold text-lg hover:bg-white/10 transition"
              >
                Renew Your Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-cover bg-center" style={{
                backgroundImage: 'linear-gradient(rgba(198, 28, 113, 0.7), rgba(198, 28, 113, 0.7)), url("https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600")'
              }}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Renew your plan
                </h3>
                <p className="text-gray-600 mb-4">
                  Keep your coverage current and protect your family.
                </p>
                <Link href="/search" className="font-bold hover:underline" style={{ color: '#C61C71' }}>
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-cover bg-center" style={{
                backgroundImage: 'linear-gradient(rgba(198, 28, 113, 0.7), rgba(198, 28, 113, 0.7)), url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600")'
              }}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Get covered & protected
                </h3>
                <p className="text-gray-600 mb-4">
                  Find comprehensive health coverage that fits your needs.
                </p>
                <Link href="/search" className="font-bold hover:underline" style={{ color: '#C61C71' }}>
                  See Plan Coverage →
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-cover bg-center" style={{
                backgroundImage: 'linear-gradient(rgba(198, 28, 113, 0.7), rgba(198, 28, 113, 0.7)), url("https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600")'
              }}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Programs and perks
                </h3>
                <p className="text-gray-600 mb-4">
                  Save money on vision care and other health services.
                </p>
                <Link href="/search" className="font-bold hover:underline" style={{ color: '#C61C71' }}>
                  Explore Benefits →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Ambetter Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Why Choose Ambetter?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide quality healthcare coverage with benefits designed to keep you healthy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Affordable Plans
              </h3>
              <p className="text-gray-600">
                Plans starting at $0/month
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">🏥</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Quality Care
              </h3>
              <p className="text-gray-600">
                Access to top doctors & hospitals
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">💊</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Prescription Coverage
              </h3>
              <p className="text-gray-600">
                Save on medications you need
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Member Rewards
              </h3>
              <p className="text-gray-600">
                Earn rewards for healthy habits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* State Coverage CTA */}
      <div className="py-16" style={{ backgroundColor: '#C61C71' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Find Coverage in Your State
          </h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Ambetter has you covered with plans available in 29 states nationwide
          </p>
          <Link
            href="/search"
            className="inline-block px-10 py-4 bg-white rounded-lg text-xl font-bold hover:bg-gray-100 transition"
            style={{ color: '#C61C71' }}
          >
            View Texas Plans
          </Link>
        </div>
      </div>

      {/* Mobile App Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Manage your health on the go
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Download the Ambetter app to access your ID card, find doctors, view benefits, and more—all from your phone.
              </p>
              <div className="flex gap-4">
                <Link href="/search" className="inline-block">
                  <div className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                    App Store
                  </div>
                </Link>
                <Link href="/search" className="inline-block">
                  <div className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                    Google Play
                  </div>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xl">📱 Mobile App Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold mb-4 text-lg">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition">About Ambetter</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Contact Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Newsroom</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">For Members</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Member Login</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Find a Doctor</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Drug Coverage</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Pay Now</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition">My Health Pays®</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">24hr Nurse Line</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Virtual Care</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Health Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Terms of Use</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Non-Discrimination</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Transparency</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">
              © 2025 Centene Corporation. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Ambetter is the brand name used for the regional health plans by Celtic Insurance Company and Ambetter Health Company.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
