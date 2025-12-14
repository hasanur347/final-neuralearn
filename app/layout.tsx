import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from './components/Navbar'
import Footer from './components/Footer'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NeuraLearn - Personalized Learning Platform',
  description: 'AI-powered personalized learning platform for CSE students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="flex-grow bg-gray-50">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
