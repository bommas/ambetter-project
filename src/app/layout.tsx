import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ambetter Health Plan Search',
  description: 'Search and analyze Ambetter health plans in Texas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-ambetter-blue">
                    Ambetter Health Plans
                  </h1>
                </div>
                <nav className="flex space-x-8">
                  <a href="/" className="text-gray-700 hover:text-ambetter-blue">
                    Search
                  </a>
                  <a href="/analytics" className="text-gray-700 hover:text-ambetter-blue">
                    Analytics
                  </a>
                  <a href="/admin" className="text-gray-700 hover:text-ambetter-blue">
                    Admin
                  </a>
                  <a href="/qa" className="text-gray-700 hover:text-ambetter-blue">
                    QA
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
