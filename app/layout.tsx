import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crown Cards — Video Director',
  description: 'Generate Crown Cards hype reel clips via Veo 3.1 Fast',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
