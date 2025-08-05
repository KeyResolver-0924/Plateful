import { useCallback, useRef } from 'react';

export class PerformanceUtils {
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }
  
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }
  
  static memoize<T extends (...args: any[]) => any>(
    func: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map<string, ReturnType<T>>();
    
    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key)!;
      }
      
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }
}

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay]
  );
};

export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef(0);
  
  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
};

export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T => {
  return useCallback(callback, dependencies);
};

export class MemoryManager {
  private static cache = new Map<string, any>();
  private static maxSize = 100;
  
  static set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }
  
  static get(key: string): any | undefined {
    return this.cache.get(key);
  }
  
  static clear(): void {
    this.cache.clear();
  }
  
  static has(key: string): boolean {
    return this.cache.has(key);
  }
}

export const useImagePreloader = () => {
  const preloadedImages = useRef<Set<string>>(new Set());
  
  const preloadImage = useCallback((uri: string): Promise<void> => {
    if (preloadedImages.current.has(uri)) {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        preloadedImages.current.add(uri);
        resolve();
      };
      img.onerror = reject;
      img.src = uri;
    });
  }, []);
  
  const preloadImages = useCallback((uris: string[]): Promise<void[]> => {
    return Promise.all(uris.map(preloadImage));
  }, [preloadImage]);
  
  return { preloadImage, preloadImages };
}; 