import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { ModalConfig } from '../types';
import { ModalControllerContext } from './ModalControllerContext';
import { ModalScrollSx } from '../themes';

interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dynamicSubtitle, setDynamicSubtitle] = useState<string | null>(null);

  const openModal = useCallback((cfg: ModalConfig) => {
    setConfirmDisabled(cfg.confirmDisabled ?? false);
    setLoading(cfg.loading ?? false);
    setError(null);
    setDynamicSubtitle(null);
    setConfig(cfg);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    // small delay so the dialog animates out before clearing config
    setTimeout(() => setConfig(null), 200);
  }, []);

  /**
   * make sure that the modalContextValue is memoized
   * to prevent unnecessary re-renders of components that use it
   */
  const modalContextValue = useMemo(
    () => ({ openModal, closeModal }),
    [openModal, closeModal],
  );

  const modalControllerContextValue = useMemo(
    () => ({
      setConfirmDisabled,
      setLoading,
      setError,
      setSubtitle: setDynamicSubtitle,
    }),
    [setConfirmDisabled, setError, setLoading, setDynamicSubtitle],
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollTop, setCanScrollTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(false);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    setCanScrollTop(scrollTop > 5);
    setCanScrollBottom(scrollHeight - scrollTop > clientHeight + 5);
  }, []);

  useEffect(() => {
    if (open) {
      // Small delay to ensure content is rendered and measurements are accurate
      const timeout = setTimeout(handleScroll, 100);
      return () => clearTimeout(timeout);
    }
  }, [open, config, handleScroll]);

  return (
    <ModalContext.Provider value={modalContextValue}>
      <ModalControllerContext.Provider value={modalControllerContextValue}>
        {children}

        <Dialog open={open} onClose={closeModal} fullWidth>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (config?.onConfirm) {
                config.onConfirm(closeModal);
              } else {
                closeModal();
              }
            }}
            style={{ display: 'contents' }}
          >
            <DialogTitle variant="h2">{config?.title}</DialogTitle>
            {(dynamicSubtitle || config?.subtitle) && (
              <Typography
                textAlign="center"
                padding="0 2rem 1rem"
                color="secondary"
              >
                {dynamicSubtitle || config?.subtitle}
              </Typography>
            )}
            <Stack
              maxHeight="20rem"
              sx={ModalScrollSx}
              data-scrolltop={canScrollTop}
              data-scrollbottom={canScrollBottom}
            >
              {config?.children && (
                <DialogContent
                  ref={scrollRef}
                  onScroll={handleScroll}
                  sx={{
                    maxHeight: '25rem',
                    overflowY: 'auto',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                  }}
                >
                  {config.children}
                </DialogContent>
              )}
            </Stack>
            {error && (
              <Stack padding="0 1rem 1rem">
                <Alert severity="error" size="small">
                  {error}
                </Alert>
              </Stack>
            )}
            <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                type="button"
                data-testid="modal-cancel-button"
                onClick={() => {
                  config?.onCancel?.(closeModal);
                }}
                fullWidth
              >
                {config?.cancelLabel ?? 'Annuler'}
              </Button>
              <Button
                variant="contained"
                color={config?.confirmColor ?? 'primary'}
                type="submit"
                fullWidth
                loading={loading}
                disabled={confirmDisabled}
                data-testid="modal-confirm-button"
              >
                {config?.confirmLabel ?? 'Confirmer'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </ModalControllerContext.Provider>
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalContextProvider };
