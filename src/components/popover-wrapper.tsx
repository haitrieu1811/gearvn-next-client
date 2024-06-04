import React from 'react'

export default function PopoverWrapper({ children }: { children: React.ReactNode }) {
  return <div className='bg-background rounded-md shadow py-2'>{children}</div>
}
