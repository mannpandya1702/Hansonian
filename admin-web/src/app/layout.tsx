import './globals.css'
import { Metadata } from 'next'
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { AdminSidebar } from './components/Sidebar'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hansonium — Admin & CEO Command Center',
  description: 'Executive oversight: NDIS financial pulse, DEX compliance, strategic alerts and AI insights.',
  keywords: ['NDIS', 'CEO dashboard', 'DEX compliance', 'Hansonium admin'],
  authors: [{ name: 'Hansonium' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${mono.variable} h-full`}
    >
      <body className="bg-[#faf9f7] text-[#1a1a2e] min-h-screen antialiased overflow-x-hidden">
        <div className="flex h-full min-h-screen">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Spacer for mobile top bar height */}
            <div className="lg:hidden h-14 shrink-0" />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}