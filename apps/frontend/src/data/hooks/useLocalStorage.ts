"use client";
import { useCallback } from "react";

const useLocalStorage = () => {
  const get = useCallback((key: string) => {
    const valueLocal = window?.localStorage?.getItem(key);
    return valueLocal ? JSON.parse(valueLocal) : null;
  }, []);

  const set = useCallback((key: string, value: any) => {
    window?.localStorage?.setItem(value, JSON.stringify(key));
  }, []);

  return { get, set };
};

export default useLocalStorage;
