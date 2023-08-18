import { cn } from '@/lib/utils'
import '@/assets/global.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Simple Note App',
  description: 'Megbaszo SzajbaBaszo Note App',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("bg-slate-900 antialiased", inter.className)}>
      <body className='bg-slate-700 min-h-screen pt-12 antialiased'>
        <Navbar />
        <div className='container max-w-7xl mx-auto h-full pt-12'>
          {children}
        </div>
      </body>
      <Toaster />
    </html>
  )
}
