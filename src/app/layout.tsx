import type { Metadata } from 'next'
import { Inter_Tight as FontSans } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

import { cn } from '@/lib/utils'
import TanstackProvider from '@/providers/tanstack.provider'
import { ThemeProvider } from '@/providers/theme.provider'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'Gearvn - Trang chủ',
  description: 'Gearvn - Trang chủ'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <TanstackProvider>
            <NextTopLoader showSpinner={false} color='red' height={2} />
            {children}
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
