import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TK Helpdesk',
  description: 'Helpdesk görsel oluşturucu',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
