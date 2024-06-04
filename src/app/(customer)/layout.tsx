import React from 'react'

export default function CustomerLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      CustomerLayout
      {children}
    </div>
  )
}
