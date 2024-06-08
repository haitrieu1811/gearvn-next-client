import { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AnalyticsCardProps = {
  strongText: string
  slimText: string
  mainNumber: number
  Icon: LucideIcon
}

export default function AnalyticsCard({ strongText, slimText, mainNumber, Icon }: AnalyticsCardProps) {
  return (
    <Card>
      <CardHeader className='flex-row justify-between items-center space-y-0'>
        <CardTitle>{strongText}</CardTitle>
        <Icon strokeWidth={1.5} size={18} />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{mainNumber}</div>
        <p className='text-sm text-muted-foreground'>{slimText}</p>
      </CardContent>
    </Card>
  )
}
