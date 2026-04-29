import { useEffect, useState, RefObject } from 'react';

export function useInView(ref: RefObject<HTMLElement | null>, options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Only trigger once by default
        observer.unobserve(currentRef);
      }
    }, options || { threshold: 0.1 });

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [ref, options]);

  return isInView;
}
