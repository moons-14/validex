import { AppHeader, BottomBar, SideBar, SidePanel, TabBar } from '@/components/layout'
import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'

const noto_sans = Noto_Sans({ subsets: ['latin'], weight: ["400"] })

export const metadata: Metadata = {
  title: 'Validex',
  description: 'Easily test, validate, and share CONTRACT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={noto_sans.className}>

        <AppHeader />
        <div className='flex h-[calc(100dvh-5rem)]'>
          <SideBar />
          <SidePanel />
          <div className='flex-1'>
            <TabBar />
            {children}
          </div>
        </div>

        <BottomBar />

      </body>
    </html>
  )
}
