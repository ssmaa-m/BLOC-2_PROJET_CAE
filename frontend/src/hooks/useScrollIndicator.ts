import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export const useScrollIndicator = ({
  isGettingUsers,
  open,
}: {
  isGettingUsers: boolean;
  open: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollTop, setCanScrollTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | string>('auto');

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setCanScrollTop(scrollTop > 5);
    setCanScrollBottom(scrollHeight - scrollTop > clientHeight + 5);
  }, []);

  useLayoutEffect(() => {
    if (contentRef.current && open) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height + 2);
    }
  }, [isGettingUsers, open]);

  return {
    scrollRef,
    canScrollTop,
    canScrollBottom,
    handleScroll,
    contentRef,
    contentHeight,
  };
};
