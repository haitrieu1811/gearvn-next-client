import type { Metadata } from 'next'
import { Arimo as FontSans } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import AppProvider from '@/providers/app.provider'
import TanstackProvider from '@/providers/tanstack.provider'
import { ThemeProvider } from '@/providers/theme.provider'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700']
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
            <AppProvider>
              <NextTopLoader showSpinner={false} color='yellow' height={2} />
              {children}
              <Toaster richColors position='top-center' />
            </AppProvider>
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
