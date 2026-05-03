import {
  createContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Snackbar, Alert, AlertColor, Slide } from '@mui/material';

type SnackbarConfig = {
  message: string;
  severity?: AlertColor;
  duration?: number;
  position?: {
    vertical: 'bottom' | 'top';
    horizontal: 'left' | 'right' | 'center';
  };
};

type SnackbarContextType = {
  showSnackbar: (config: SnackbarConfig) => void;
};

const SnackbarContext = createContext<SnackbarContextType | null>(null);

const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const [config, setConfig] = useState<SnackbarConfig | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearExistingTimeout = useCallback(() => {
    if (timeoutRef.current === null) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearExistingTimeout();
  }, [clearExistingTimeout]);

  const showSnackbar = useCallback(
    (cfg: SnackbarConfig) => {
      clearExistingTimeout();
      if (openRef.current) {
        setOpen(false);
        openRef.current = false;
        timeoutRef.current = window.setTimeout(() => {
          setConfig(cfg);
          setOpen(true);
          openRef.current = true;
        }, 150);
      } else {
        setConfig(cfg);
        setOpen(true);
        openRef.current = true;
      }
    },
    [clearExistingTimeout],
  );

  const handleClose = (_: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    openRef.current = false;
  };

  /**
   * make sure that the snackbarContextValue is memoized
   * to prevent unnecessary re-renders of components that use it
   */
  const snackbarContextValue = useMemo(
    () => ({ showSnackbar }),
    [showSnackbar],
  );

  return (
    <SnackbarContext.Provider value={snackbarContextValue}>
      {children}

      <Slide direction="up" in={open}>
        <Snackbar
          open={open}
          autoHideDuration={config?.duration ?? 5000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: config?.position?.vertical ?? 'bottom',
            horizontal: config?.position?.horizontal ?? 'left',
          }}
        >
          <Alert
            severity={config?.severity ?? 'info'}
            onClose={handleClose}
            sx={{
              minWidth: '20rem',
            }}
          >
            {config?.message}
          </Alert>
        </Snackbar>
      </Slide>
    </SnackbarContext.Provider>
  );
};

export { SnackbarContext, SnackbarProvider };
