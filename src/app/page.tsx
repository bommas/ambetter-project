import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header matching Ambetter's design */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo area */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Ambetter Health
                </h1>
              </div>
            </div>

            {/* Navigation matching Ambetter's style */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium">
                Shop Plans
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium">
                Find a Doctor
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium">
                Member Login
              </Link>
            </nav>

            {/* Search bar matching Ambetter's top search */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter Keyword Search"
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <Link
                href="/search"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section matching Ambetter's style */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mt-8 p-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Affordable Health Insurance Plans from Ambetter Health
            </h2>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Keep your family covered with comprehensive health plans. Find the perfect coverage for your needs.
            </p>
            
            {/* CTA Button matching Ambetter's style */}
            <div className="flex justify-center space-x-4">
              <Link
                href="/search"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                Explore Plans Today!
              </Link>
              <Link
                href="/search"
                className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                See Plan Coverage
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section matching Ambetter's layout */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              $0 Check-ups
            </h3>
            <p className="text-gray-600 text-sm">
              Keep your family covered with preventive care at no cost.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Find Doctors
            </h3>
            <p className="text-gray-600 text-sm">
              Find doctors, specialists and hospitals near you.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Programs & Perks
            </h3>
            <p className="text-gray-600 text-sm">
              Discounts on glasses, contact lenses, and more.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI-Powered Search
            </h3>
            <p className="text-gray-600 text-sm">
              Advanced search with intelligent recommendations.
            </p>
          </div>
        </div>

        {/* Stats Section matching Ambetter's style */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Texas Health Plan Coverage
            </h3>
            <p className="text-gray-600">
              Comprehensive health plans available across Texas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">160</div>
              <div className="text-sm text-gray-600">Documents Indexed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Plan Types (TX014, TX016, TX017)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-600">Document Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Find Your Perfect Health Plan?
          </h3>
          <p className="text-gray-600 mb-6">
            Use our advanced search to find the right coverage for you and your family.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <MagnifyingGlassIcon className="h-6 w-6 mr-3" />
            Start Searching Now
          </Link>
        </div>
      </main>

      {/* Footer matching Ambetter's style */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-blue-400">About Ambetter Health</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Newsroom</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Members</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-blue-400">Member Login</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Find a Doctor</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Drug Coverage</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-blue-400">My Health Pays Rewards®</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Ways to Save</Link></li>
                <li><Link href="#" className="hover:text-blue-400">24hr Nurse Line</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Coverage</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-blue-400">Texas Plans</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Shop and Compare</Link></li>
                <li><Link href="#" className="hover:text-blue-400">How to Enroll</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© Copyright 2025 Centene Corporation. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link href="#" className="hover:text-blue-400">Privacy Policy</Link>
              <Link href="#" className="hover:text-blue-400">Terms & Conditions</Link>
              <Link href="#" className="hover:text-blue-400">Non-Discrimination Notice</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
