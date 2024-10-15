import { useEffect, useRef, useCallback } from 'react';

type IntersectionObserverHookProps = {
  callback: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const useIntersectionObserver = <
  TLastElement extends HTMLElement,
  TContainerElement extends HTMLElement
>({
  callback,
  hasNextPage,
  isFetchingNextPage,
}: IntersectionObserverHookProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<TLastElement | null>(null);
  const containerRef = useRef<TContainerElement | null>(null);

  const observe = useCallback(
    (node: TLastElement) => {
      if (isFetchingNextPage || !hasNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            callback();
          }
        },
        {
          root: containerRef.current,
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [callback, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    if (lastElementRef.current) {
      observe(lastElementRef.current);
    }
  }, [observe]);

  return { containerRef, lastElementRef };
};
