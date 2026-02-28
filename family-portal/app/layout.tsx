import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Hansonium Family Portal | NDIS Care Management',
  description: 'Access your NDIS care services, track visits, manage budgets, and stay connected with your care team through the Hansonium Family Portal.',
  keywords: ['NDIS', 'disability support', 'family portal', 'care management', 'Hansonium'],
  authors: [{ name: 'Hansonium' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#1a1a2e',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=JetBrains+Mono:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
