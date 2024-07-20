import type { Metadata } from 'next'
import { Be_Vietnam_Pro as FontSans } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import AppProvider from '@/providers/app.provider'
import CartProvider from '@/providers/cart.provider'
import TanstackProvider from '@/providers/tanstack.provider'
import { ThemeProvider } from '@/providers/theme.provider'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'Trang chủ - GEARVN',
  description: 'Trang chủ - GEARVN'
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
              <CartProvider>
                <NextTopLoader showSpinner={false} color='yellow' height={2} />
                {children}
                <Toaster richColors position='top-center' />
              </CartProvider>
            </AppProvider>
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
