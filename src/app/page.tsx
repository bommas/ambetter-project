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
      <header className="bg-white py-2 px-4 flex items-center gap-4 border-b border-gray-100">
        {/* Logo - Very Small */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-ambetter-magenta flex items-center justify-center">
            <span className="text-white font-bold text-[10px] uppercase tracking-tight">ambetter<br/>health</span>
          </div>
        </div>

        {/* Search Bar - Large, Centered, Minimal */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Condition, procedure, doctor..."
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
        </form>

        {/* Right side buttons - Small */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a href="#" className="text-blue-600 font-normal text-sm hover:underline">Help</a>
          <button className="bg-ambetter-magenta text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-ambetter-magenta-dark transition">
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
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-12">
            {/* Card 1 - Phone */}
            <a href="#" className="text-center group">
              <div className="w-24 h-24 rounded-full bg-ambetter-magenta flex items-center justify-center mx-auto mb-4 group-hover:bg-ambetter-magenta-dark transition shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                Have enrollment questions? Our licensed agents can help.
              </p>
            </a>

            {/* Card 2 - Plans */}
            <a href="#" className="text-center group">
              <div className="w-24 h-24 rounded-full bg-ambetter-magenta flex items-center justify-center mx-auto mb-4 group-hover:bg-ambetter-magenta-dark transition shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                Explore our range of plans to fit your needs and budget.
              </p>
            </a>

            {/* Card 3 - Doctors */}
            <a href="#" className="text-center group">
              <div className="w-24 h-24 rounded-full bg-ambetter-magenta flex items-center justify-center mx-auto mb-4 group-hover:bg-ambetter-magenta-dark transition shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
                </svg>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                Find doctors, specialists and hospitals near you.
              </p>
            </a>

            {/* Card 4 - Premium */}
            <a href="#" className="text-center group">
              <div className="w-24 h-24 rounded-full bg-ambetter-magenta flex items-center justify-center mx-auto mb-4 group-hover:bg-ambetter-magenta-dark transition shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
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
