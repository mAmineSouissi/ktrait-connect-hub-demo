import { useState, useEffect } from "react";

export function useDebounce<T>(
  value: T,
  delay: number = 500
): {
  value: T;
  loading: boolean;
} {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setLoading(false);
    }, delay);

    return () => {
      clearTimeout(handler);
      setLoading(false);
    };
  }, [value, delay]);

  return { value: debouncedValue, loading };
}
