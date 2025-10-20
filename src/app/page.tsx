import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Ambetter Header - Simple and Clean */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[80%] mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold" style={{ color: '#0066CC' }}>
                Ambetter Health
              </span>
            </Link>

            {/* Simple Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/search" className="text-[#333333] hover:text-[#0066CC] font-medium text-base">
                Shop Plans
              </Link>
              <Link href="/search" className="text-[#333333] hover:text-[#0066CC] font-medium text-base">
                For Members
              </Link>
              <Link href="/search" className="text-[#333333] hover:text-[#0066CC] font-medium text-base">
                Programs & Savings
              </Link>
              <Link href="/search" className="text-[#333333] hover:text-[#0066CC] font-medium text-base">
                Find a Doctor
              </Link>
            </nav>

            {/* Search */}
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 border border-gray-300 rounded text-sm w-48"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              />
              <Link
                href="/search"
                className="px-6 py-2 rounded text-white text-sm font-medium"
                style={{ backgroundColor: '#0066CC' }}
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section - Ambetter Style */}
        <div style={{ backgroundColor: '#0066CC' }} className="py-20">
          <div className="max-w-[80%] mx-auto text-center text-white">
            <h1 className="text-[32px] font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Affordable Health Insurance Plans from Ambetter Health
            </h1>
            <p className="text-[18px] mb-8" style={{ color: '#FFFFFF' }}>
              Explore plans today!
            </p>
            <p className="text-[18px] mb-8 opacity-90">
              Keep your family covered with $0 check-ups.
            </p>
            <Link
              href="/search"
              className="inline-block px-8 py-3 bg-white rounded text-base font-medium"
              style={{ color: '#0066CC' }}
            >
              Explore plans today!
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-[80%] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white border border-gray-200 rounded p-8 text-center">
                <h3 className="text-[23px] font-semibold mb-4" style={{ color: '#6E6E6E' }}>
                  Renew your Ambetter Health insurance.
                </h3>
                <p className="text-[18px] mb-6" style={{ color: '#6E6E6E' }}>
                  Keep your coverage current and protect your family.
                </p>
                <Link href="/search" className="text-[18px] font-medium" style={{ color: '#0066CC' }}>
                  Learn More
                </Link>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-gray-200 rounded p-8 text-center">
                <h3 className="text-[23px] font-semibold mb-4" style={{ color: '#6E6E6E' }}>
                  Get covered & protected.
                </h3>
                <p className="text-[18px] mb-6" style={{ color: '#6E6E6E' }}>
                  Find comprehensive health coverage that fits your needs.
                </p>
                <Link href="/search" className="text-[18px] font-medium" style={{ color: '#0066CC' }}>
                  See Plan Coverage
                </Link>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-gray-200 rounded p-8 text-center">
                <h3 className="text-[23px] font-semibold mb-4" style={{ color: '#6E6E6E' }}>
                  Discounts on glasses, contact lenses, and more.
                </h3>
                <p className="text-[18px] mb-6" style={{ color: '#6E6E6E' }}>
                  Save money on vision care and other health services.
                </p>
                <Link href="/search" className="text-[18px] font-medium" style={{ color: '#0066CC' }}>
                  Programs and Perks
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div className="py-16" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="max-w-[80%] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[29px] font-bold mb-4" style={{ color: '#333333' }}>
                Programs and Perks Designed to Support Your Needs
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="text-[20px] font-bold mb-3" style={{ color: '#6E6E6E' }}>
                  Why do I need Health Insurance?
                </h4>
                <p className="text-[18px]" style={{ color: '#6E6E6E' }}>
                  Learn about the importance of health coverage.
                </p>
              </div>
              
              <div className="text-center">
                <h4 className="text-[20px] font-bold mb-3" style={{ color: '#6E6E6E' }}>
                  Low cost plans and options
                </h4>
                <p className="text-[18px]" style={{ color: '#6E6E6E' }}>
                  Find affordable health plans that fit your budget.
                </p>
              </div>
              
              <div className="text-center">
                <h4 className="text-[20px] font-bold mb-3" style={{ color: '#6E6E6E' }}>
                  We've got you covered
                </h4>
                <p className="text-[18px]" style={{ color: '#6E6E6E' }}>
                  Comprehensive coverage for your family's health needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* State Coverage Section */}
        <div className="py-16 bg-white">
          <div className="max-w-[80%] mx-auto text-center">
            <h2 className="text-[29px] font-bold mb-4" style={{ color: '#333333' }}>
              Find Ambetter Health coverage in your state
            </h2>
            <p className="text-[18px] mb-8 max-w-3xl mx-auto" style={{ color: '#6E6E6E' }}>
              Ambetter Health has you covered, with plans available in 29 states nationwide. 
              Select your state below to see plans in your area.
            </p>
            
            <div className="border border-gray-200 rounded p-12 max-w-2xl mx-auto">
              <h3 className="text-[23px] font-semibold mb-4" style={{ color: '#6E6E6E' }}>
                Texas Coverage
              </h3>
              <p className="text-[18px] mb-6" style={{ color: '#6E6E6E' }}>
                Comprehensive health plans available across Texas
              </p>
              <Link
                href="/search"
                className="inline-block px-8 py-3 rounded text-white text-base font-medium"
                style={{ backgroundColor: '#0066CC' }}
              >
                View Texas Plans
              </Link>
            </div>
          </div>
        </div>

        {/* App Section */}
        <div className="py-16" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="max-w-[80%] mx-auto text-center">
            <h2 className="text-[29px] font-bold mb-4" style={{ color: '#333333' }}>
              Get the Ambetter Health App
            </h2>
            <p className="text-[18px] mb-8 max-w-3xl mx-auto" style={{ color: '#6E6E6E' }}>
              The Ambetter Health mobile app is a convenient way to manage your healthcare anytime, anywhere.
            </p>
            <Link
              href="/search"
              className="inline-block px-8 py-3 rounded text-white text-base font-medium"
              style={{ backgroundColor: '#0066CC' }}
            >
              Download
            </Link>
          </div>
        </div>
      </main>

      {/* Ambetter Footer */}
      <footer className="bg-[#333333] text-white py-12">
        <div className="max-w-[80%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-[18px] font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">About Ambetter Health</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Contact Us</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Newsroom</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">About Centene</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[18px] font-bold mb-4">For Members</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Member Login</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Find a Doctor</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Drug Coverage</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Pay Now</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[18px] font-bold mb-4">Programs</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">My Health Pays Rewards®</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Ways to Save</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">24hr Nurse Line</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Virtual 24/7 Care</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[18px] font-bold mb-4">Coverage</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Texas Plans</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Shop and Compare</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">How to Enroll</Link></li>
                <li><Link href="#" className="text-[16px] text-gray-300 hover:text-white">Special Enrollment Period</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-[16px] text-gray-400 mb-3">© Copyright 2025 Centene Corporation. All rights reserved.</p>
            <div className="flex justify-center space-x-4 text-[14px]">
              <Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 hover:text-white">Terms & Conditions</Link>
              <Link href="#" className="text-gray-400 hover:text-white">Non-Discrimination Notice</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
