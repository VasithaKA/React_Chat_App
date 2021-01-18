import { useEffect, useState } from 'react';

const PREFIX = 'chat-app-'

export default function useLocalStorage(key, initialValue) {
    const preFixedKey = PREFIX + key
    const [value, setvalue] = useState(() => {
        const jsonValue = localStorage.getItem(preFixedKey)
        if (jsonValue !== null && jsonValue !== '') return JSON.parse(jsonValue)
        if (typeof initialValue === 'function') {
            return initialValue()
        } else {
            return initialValue
        }
    })

    useEffect(() => {
        localStorage.setItem(preFixedKey, JSON.stringify(value))
    }, [preFixedKey, value])

    return [value, setvalue]
}
