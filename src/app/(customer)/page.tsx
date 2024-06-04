import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <>
      <ModeToggle />
      <Button className='bg-main hover:bg-main-foreground'>Click me</Button>
    </>
  )
}
