import { useState, useEffect } from "react";

export function useDelayedLoader(
  isLoading: boolean,
  delay: number = 300,
): boolean {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoader(true);
      }, delay);
    } else {
      setShowLoader(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoading, delay]);

  return showLoader;
}
