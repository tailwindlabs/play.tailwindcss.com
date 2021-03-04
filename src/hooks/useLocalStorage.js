import { useState } from 'react'

export default function useLocalStorage(key, initialValue) {
  const [localValue, setLocalValue] = useState(() => {
    try {
      const storedItem = window.localStorage.getItem(key)
      return storedItem ? JSON.parse(storedItem) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const storeValue = (value) => {
    try {
      setLocalValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log(error)
    }
  }

  return [localValue, storeValue]
}
