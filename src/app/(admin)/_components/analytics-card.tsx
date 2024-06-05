import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AnalyticsCardProps = {
  strongText: string
  slimText: string
  mainNumber: number
  icon: React.ReactNode
}

export default function AnalyticsCard({ strongText, slimText, mainNumber, icon }: AnalyticsCardProps) {
  return (
    <Card>
      <CardHeader className='flex-row justify-between items-center space-y-0'>
        <CardTitle>{strongText}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{mainNumber}</div>
        <p className='text-sm text-muted-foreground'>{slimText}</p>
      </CardContent>
    </Card>
  )
}
