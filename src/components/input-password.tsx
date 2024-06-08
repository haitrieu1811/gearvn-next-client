import { Eye, EyeOff } from 'lucide-react'
import React from 'react'

import { Input } from '@/components/ui/input'

type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement> & {}

export default function InputPassword(props: InputPasswordProps) {
  const [type, setType] = React.useState<'text' | 'password'>('password')

  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleToggleType = () => {
    inputRef.current?.type === 'password' ? setType('text') : setType('password')
  }

  return (
    <div className='relative'>
      <Input ref={inputRef} type={type} {...props} />
      <button
        type='button'
        className='absolute top-0 right-0 h-full flex justify-center items-center w-10'
        onClick={handleToggleType}
      >
        {type === 'password' ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
      </button>
    </div>
  )
}
