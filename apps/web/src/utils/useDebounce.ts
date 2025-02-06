import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, time = 500) => {
    const [useDebounceValue, setDebounceValue] = useState<T>(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceValue(value)
        }, time)

        return () => clearTimeout(timeout)
    }, [time, value])

    return useDebounceValue
};