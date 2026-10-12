import { useState, useEffect } from "react";

// A custom hook that works like useState,
// but also saves the value in local storage.
function useLocalStorage(key, initialValue) {
  // useState runs the function below only once (when the page loads)
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // useEffect runs every time "value" changes -> save it
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
