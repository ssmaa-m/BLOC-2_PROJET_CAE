import { Box, Stack, Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export interface TabOption<T extends string | number> {
  label: string;
  value: T;
}

interface TabsProps<T extends string | number> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
}

export const Tabs = <T extends string | number>({
  options,
  value,
  onChange,
  fullWidth = false,
}: TabsProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const selectedEl = containerRef.current.querySelector(
      `button[data-value="${value}"]`,
    ) as HTMLButtonElement | null;

    if (selectedEl) {
      setIndicatorStyle({
        left: selectedEl.offsetLeft,
        top: selectedEl.offsetTop,
        width: selectedEl.offsetWidth,
        height: selectedEl.offsetHeight,
      });
    }
  }, [value, options]);

  return (
    <Stack
      ref={containerRef}
      position="relative"
      direction="row"
      padding="0.375rem"
      borderRadius="1.125rem"
      bgcolor="background.s2"
      height="fit-content"
      alignItems="center"
      width={fullWidth ? '100%' : 'fit-content'}
    >
      {indicatorStyle.width > 0 && (
        <Box
          sx={{
            position: 'absolute',
            left: indicatorStyle.left,
            top: indicatorStyle.top,
            width: indicatorStyle.width,
            height: indicatorStyle.height,
            borderRadius: '0.75rem',
            bgcolor: 'background.s4',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      )}
      {options.map((option) => (
        <Button
          key={option.value}
          data-value={option.value}
          size="large"
          sx={{
            flex: fullWidth ? 1 : 'none',
            color: value === option.value ? 'text.primary' : 'text.secondary',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: value === option.value ? 'none' : 'auto',
            zIndex: 1,
            '&:hover': {
              opacity: 0.6,
              background: 'none',
            },
          }}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </Stack>
  );
};
