import Link from 'next/link'
import { MagnifyingGlassIcon, ChevronDownIcon, HeartIcon, ShieldCheckIcon, EyeIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  Ambetter Health
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Shop Plans
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-3">
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Health Plans</Link>
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Dental and Vision</Link>
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">How to Enroll</Link>
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Shop and Compare Plans</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  For Members
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-3">
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Find a Doctor</Link>
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Drug Coverage</Link>
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Member Login</Link>
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Pay Now</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Programs & Savings
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-3">
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">My Health Pays Rewards®</Link>
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Ways to Save</Link>
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">24hr Nurse Line</Link>
                    <Link href="/search" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Virtual 24/7 Care</Link>
                  </div>
                </div>
              </div>

              <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Find a Doctor
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter Keyword Search"
                  className="block w-64 pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-sm transition-all"
                />
              </div>
              <Link
                href="/search"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl mt-12 p-16">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative text-center text-white">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Affordable Health Insurance Plans from Ambetter Health
            </h1>
            <h2 className="text-3xl font-semibold mb-8 opacity-95">
              Explore plans today!
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto">
              Keep your family covered with $0 check-ups. Find comprehensive health plans that fit your needs and budget.
            </p>
            
            <div className="flex justify-center space-x-6">
              <Link
                href="/search"
                className="inline-flex items-center bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Explore plans today!
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                See Plan Coverage
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HeartIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Renew your Ambetter Health insurance.
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Keep your coverage current and protect your family with comprehensive health insurance.
              </p>
              <Link href="/search" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Learn More
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get covered & protected.
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Find comprehensive health coverage that fits your needs and provides peace of mind.
              </p>
              <Link href="/search" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors">
                See Plan Coverage
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <EyeIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Discounts on glasses, contact lenses, and more.
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Save money on vision care and other health services with our comprehensive benefits.
              </p>
              <Link href="/search" className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                Programs and Perks
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div className="mt-20 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Programs and Perks Designed to Support Your Needs
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the comprehensive benefits and programs that make Ambetter Health the right choice for you and your family.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💡</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Why do I need Health Insurance?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Learn about the importance of health coverage and how it protects you and your family from unexpected medical costs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💻</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Low cost plans and options
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Find affordable health plans that fit your budget and provide the coverage you need for your lifestyle.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🐷</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                We've got you covered
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive coverage for you and your family's health needs with 24/7 support and care management.
              </p>
            </div>
          </div>
        </div>

        {/* State Coverage */}
        <div className="mt-20 text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Find Ambetter Health coverage in your state
          </h3>
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Ambetter Health has you covered, with plans available in 29 states nationwide. 
            Select your state below to see plans in your area.
          </p>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl p-12 max-w-4xl mx-auto">
            <h4 className="text-2xl font-bold mb-6">Texas Coverage</h4>
            <p className="text-xl opacity-90 mb-8">
              Comprehensive health plans available across Texas with local provider networks and personalized care.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View Texas Plans
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* App Section */}
        <div className="mt-20 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Get the Ambetter Health App
            </h3>
            <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto">
              The Ambetter Health mobile app is a convenient way to manage your healthcare anytime, anywhere.
              Access all the features of your Online Member Account right from your smartphone.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Download Now
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h4 className="text-xl font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">About Ambetter Health</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Newsroom</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">About Centene</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6">For Members</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Member Login</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Find a Doctor</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Drug Coverage</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Pay Now</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6">Programs</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">My Health Pays Rewards®</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Ways to Save</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">24hr Nurse Line</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Virtual 24/7 Care</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6">Coverage</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Texas Plans</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Shop and Compare</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">How to Enroll</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Special Enrollment Period</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p className="mb-4">© Copyright 2025 Centene Corporation. All rights reserved.</p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Non-Discrimination Notice</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Market Notice</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Transparency Notice</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
