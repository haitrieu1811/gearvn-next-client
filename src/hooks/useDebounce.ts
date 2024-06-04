import React from 'react'

type UseDebounceProps = {
  value: string
  delay?: number
}

export default function useDebounce({ value, delay = 1500 }: UseDebounceProps) {
  const [debounceValue, setDebounceValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => setDebounceValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debounceValue
}
