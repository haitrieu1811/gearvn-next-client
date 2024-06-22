import { Minus, Plus } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NUMBER_REGEX } from '@/constants/regex'
import { cn } from '@/lib/utils'

type QuantityControllerProps = {
  max?: number
  disabled?: boolean
  value?: number
  onChange?: (value: number) => void
  onDecrease?: (value: number) => void
  onIncrease?: (value: number) => void
  onFocusOut?: (value: number) => void
}

export default function QuantityController({
  max,
  disabled,
  value,
  onChange,
  onDecrease,
  onIncrease,
  onFocusOut
}: QuantityControllerProps) {
  const [localValue, setLocalValue] = React.useState<number>(Number(value || 0))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    let _value = Number(value)
    if (NUMBER_REGEX.test(value)) {
      if (max && _value > max) {
        _value = max
      } else if (_value < 1) {
        _value = 1
      }
      onChange && onChange(_value)
      setLocalValue(_value)
    }
  }

  const handleDecrease = () => {
    let _value = (value || localValue) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }

  const handleIncrease = () => {
    let _value = (value || localValue) + 1

    if (max && _value > max) {
      _value = max
    }
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(e.target.value))
  }

  return (
    <div
      className={cn('flex space-x-1', {
        'pointer-events-none opacity-50': disabled
      })}
    >
      <Button size='icon' variant='secondary' className='active:bg-slate-100' onClick={handleDecrease}>
        <Minus size={16} />
      </Button>
      <Input value={value || localValue} className='w-[50px] text-center' onChange={handleChange} onBlur={handleBlur} />
      <Button size='icon' variant='secondary' className='active:bg-slate-100' onClick={handleIncrease}>
        <Plus size={16} />
      </Button>
    </div>
  )
}
