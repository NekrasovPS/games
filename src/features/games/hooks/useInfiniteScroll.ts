import { RefObject, useCallback, useEffect, useRef } from 'react';

interface InfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = (options: InfiniteScrollOptions): RefObject<HTMLDivElement> => {
  const loaderRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && options.hasMore && !options.isLoading) {
        options.onLoadMore();
      }
    },
    [options],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: options.threshold || 0.1,
    });

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [handleObserver, options.threshold]);

  return loaderRef as RefObject<HTMLDivElement>;
};
