import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://insightgraph.vercel.app'),
  title: 'InsightGraph - Interactive Knowledge Graph Explorer',
  description: 'Transform your curiosity into visual knowledge. Create interactive maps of connected concepts with AI-powered insights.',
  keywords: ['knowledge graph', 'concept mapping', 'AI', 'learning', 'education'],
  authors: [{ name: 'InsightGraph Team' }],
  creator: 'InsightGraph',
  openGraph: {
    title: 'InsightGraph - Interactive Knowledge Graph Explorer',
    description: 'Transform your curiosity into visual knowledge. Create interactive maps of connected concepts with AI-powered insights.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InsightGraph - Interactive Knowledge Graph Explorer',
    description: 'Transform your curiosity into visual knowledge. Create interactive maps of connected concepts with AI-powered insights.',
  },
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}