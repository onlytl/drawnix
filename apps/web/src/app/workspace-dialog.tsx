import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import styles from './app.module.scss';

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  wide?: boolean;
  closeOnBackdrop?: boolean;
  onClose?: () => void;
  children: ReactNode;
};

export function WorkspaceDialog({
  open,
  title,
  description,
  wide = false,
  closeOnBackdrop = true,
  onClose,
  children,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) {
      return;
    }

    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => !node.hasAttribute('data-dialog-ignore-focus'),
      );

    const preferred =
      panel.querySelector<HTMLElement>('[data-dialog-initial-focus]') ??
      panel.querySelector<HTMLElement>('input, textarea, select') ??
      focusables()[0];
    preferred?.focus();
    if (
      preferred instanceof HTMLInputElement ||
      preferred instanceof HTMLTextAreaElement
    ) {
      preferred.select();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!onCloseRef.current) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      previouslyFocused?.focus?.();
    };
  }, [open, title]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.modalBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && closeOnBackdrop) {
          onClose?.();
        }
      }}
    >
      <div
        ref={panelRef}
        className={`${styles.modal} ${wide ? styles.cryptoModal : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h3 id={titleId}>{title}</h3>
        {description ? (
          <p id={descriptionId} className={styles.modalLead}>
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export function WorkspacePasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
  name,
  showLabel,
  hideLabel,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  name?: string;
  showLabel: string;
  hideLabel: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.passwordField}>
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
      />
      <button
        type="button"
        className={styles.passwordToggle}
        aria-label={visible ? hideLabel : showLabel}
        title={visible ? hideLabel : showLabel}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
            <path d="M7.1 7.4C5 8.7 3.6 10.5 3 12c1.5 3.5 5.2 7 9 7 1.5 0 3-.4 4.3-1.1" />
            <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c3.8 0 7.5 3.5 9 7-.4.9-1 1.8-1.7 2.6" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M2.5 12S6.2 6 12 6s9.5 6 9.5 6-3.7 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        )}
      </button>
    </div>
  );
}
