import Link from 'next/link'
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header matching Ambetter's exact design */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo area */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-blue-600">
                  Ambetter Health
                </div>
              </Link>
            </div>

            {/* Navigation matching Ambetter's exact menu structure */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  Shop Plans
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Health Plans</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dental and Vision</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">How to Enroll</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Shop and Compare Plans</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  For Members
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Find a Doctor</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Drug Coverage</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Member Login</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pay Now</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  Programs & Savings
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Health Pays Rewards®</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Ways to Save</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">24hr Nurse Line</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Virtual 24/7 Care</Link>
                  </div>
                </div>
              </div>

              <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium">
                Find a Doctor
              </Link>
            </nav>

            {/* Search bar matching Ambetter's exact design */}
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

      {/* Hero Section matching Ambetter's exact design */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg mt-8 p-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Affordable Health Insurance Plans from Ambetter Health
            </h1>
            <h2 className="text-2xl font-semibold mb-8">
              Explore plans today!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Keep your family covered with $0 check-ups.
            </p>
            
            {/* CTA Button matching Ambetter's style */}
            <Link
              href="/search"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Explore plans today!
            </Link>
          </div>
        </div>

        {/* Feature Cards matching Ambetter's layout */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-50 rounded-lg p-8 mb-4">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Renew your Ambetter Health insurance.
              </h3>
              <p className="text-gray-600 mb-4">
                Keep your coverage current and protect your family.
              </p>
              <Link href="/search" className="text-blue-600 font-medium hover:text-blue-700">
                Learn More
              </Link>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-green-50 rounded-lg p-8 mb-4">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get covered & protected.
              </h3>
              <p className="text-gray-600 mb-4">
                Find comprehensive health coverage that fits your needs.
              </p>
              <Link href="/search" className="text-blue-600 font-medium hover:text-blue-700">
                See Plan Coverage
              </Link>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-purple-50 rounded-lg p-8 mb-4">
              <div className="text-4xl mb-4">👓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Discounts on glasses, contact lenses, and more.
              </h3>
              <p className="text-gray-600 mb-4">
                Save money on vision care and other health services.
              </p>
              <Link href="/search" className="text-blue-600 font-medium hover:text-blue-700">
                Programs and Perks
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Programs and Perks Designed to Support Your Needs
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Why do I need Health Insurance?
              </h4>
              <p className="text-gray-600">
                Learn about the importance of health coverage and how it protects you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">💻</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Low cost plans and options
              </h4>
              <p className="text-gray-600">
                Find affordable health plans that fit your budget and needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🐷</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                We've got you covered
              </h4>
              <p className="text-gray-600">
                Comprehensive coverage for you and your family's health needs.
              </p>
            </div>
          </div>
        </div>

        {/* State Coverage Section */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Find Ambetter Health coverage in your state
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Ambetter Health has you covered, with plans available in 29 states nationwide. 
            Select your state below to see plans in your area.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Texas Coverage</h4>
            <p className="text-gray-600 mb-6">
              Comprehensive health plans available across Texas
            </p>
            <Link
              href="/search"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              View Texas Plans
            </Link>
          </div>
        </div>

        {/* App Download Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Get the Ambetter Health App
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              The Ambetter Health mobile app is a convenient way to manage your healthcare anytime, anywhere.
              Access all the features of your Online Member Account right from your smartphone.
            </p>
            <Link
              href="/search"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Download
            </Link>
          </div>
        </div>
      </main>

      {/* Footer matching Ambetter's exact structure */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-blue-400">About Ambetter Health</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Newsroom</Link></li>
                <li><Link href="#" className="hover:text-blue-400">About Centene</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Members</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-blue-400">Member Login</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Find a Doctor</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Drug Coverage</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Pay Now</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-blue-400">My Health Pays Rewards®</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Ways to Save</Link></li>
                <li><Link href="#" className="hover:text-blue-400">24hr Nurse Line</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Virtual 24/7 Care</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Coverage</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-blue-400">Texas Plans</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Shop and Compare</Link></li>
                <li><Link href="#" className="hover:text-blue-400">How to Enroll</Link></li>
                <li><Link href="#" className="hover:text-blue-400">Special Enrollment Period</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© Copyright 2025 Centene Corporation. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link href="#" className="hover:text-blue-400">Privacy Policy</Link>
              <Link href="#" className="hover:text-blue-400">Terms & Conditions</Link>
              <Link href="#" className="hover:text-blue-400">Non-Discrimination Notice</Link>
              <Link href="#" className="hover:text-blue-400">Market Notice</Link>
              <Link href="#" className="hover:text-blue-400">Transparency Notice</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
