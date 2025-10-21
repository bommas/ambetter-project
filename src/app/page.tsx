'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white py-2.5 px-8 flex items-center gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-ambetter-magenta flex items-center justify-center">
            <span className="text-white font-bold text-xs lowercase">ambetter</span>
          </div>
        </div>

        {/* Search Bar - takes most of the space */}
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Condition, procedure, doctor..."
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-ambetter-magenta focus:border-ambetter-magenta"
          />
        </form>

        {/* Right side buttons */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <a href="#" className="text-blue-600 font-normal text-sm hover:underline whitespace-nowrap">Help</a>
          <button className="bg-ambetter-magenta text-white px-5 py-1.5 rounded-full text-sm font-normal hover:bg-ambetter-magenta-dark transition whitespace-nowrap">
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-ambetter-magenta">
        <div className="max-w-6xl mx-auto px-6 py-12 flex items-center gap-8">
          {/* Left Content */}
          <div className="flex-1 text-white pr-8">
            <h1 className="text-3xl font-bold mb-3">
              Have Your Health Insurance Needs Changed?
            </h1>
            <p className="text-base mb-5 leading-relaxed opacity-95">
              Life is full of surprises, and big changes can affect your health insurance needs and coverage. If you&apos;ve recently experienced a major life event, you may be eligible for a special enrollment period to help you get the coverage you need.
            </p>
            <button className="bg-white text-ambetter-magenta px-5 py-2.5 rounded text-sm font-medium hover:bg-gray-50 transition">
              See If You Qualify
            </button>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <div className="bg-white rounded overflow-hidden">
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-sm">
                [Family Image]
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Icon Cards Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-6">
            {/* Card 1 - Phone */}
            <a href="#" className="text-center group">
              <div className="w-12 h-12 rounded-full bg-ambetter-magenta flex items-center justify-center mx-auto mb-3 group-hover:bg-ambetter-magenta-dark transition">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed px-2">
                Have enrollment questions? Our licensed agents can help.
              </p>
            </a>

            {/* Card 2 - Plans */}
            <a href="#" className="text-center group">
              <div className="w-16 h-16 rounded-full bg-ambetter-magenta flex items-center justify-center mx-auto mb-3 group-hover:bg-ambetter-magenta-dark transition">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed px-2">
                Explore our range of plans to fit your needs and budget.
              </p>
            </a>

            {/* Card 3 - Doctors */}
            <a href="#" className="text-center group">
              <div className="w-16 h-16 rounded-full bg-ambetter-magenta flex items-center justify-center mx-auto mb-3 group-hover:bg-ambetter-magenta-dark transition">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed px-2">
                Find doctors, specialists and hospitals near you.
              </p>
            </a>

            {/* Card 4 - Premium */}
            <a href="#" className="text-center group">
              <div className="w-16 h-16 rounded-full bg-ambetter-magenta flex items-center justify-center mx-auto mb-3 group-hover:bg-ambetter-magenta-dark transition">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed px-2">
                Pay your monthly premium.
              </p>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Links Section */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-8">
            <a href="/analytics" className="text-gray-700 hover:text-ambetter-magenta font-medium text-sm transition">
              Analytics
            </a>
            <a href="/admin" className="text-gray-700 hover:text-ambetter-magenta font-medium text-sm transition">
              Admin
            </a>
            <a href="/qa" className="text-gray-700 hover:text-ambetter-magenta font-medium text-sm transition">
              QA
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
