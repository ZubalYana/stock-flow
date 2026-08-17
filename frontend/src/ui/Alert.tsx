import { Alert as MuiAlert, AlertTitle } from '@mui/material';
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

interface AlertProps {
  severity: AlertSeverity;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}

const icons: Record<AlertSeverity, ReactNode> = {
  success: <CheckCircle2 size={20} />,
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />,
  error: <XCircle size={20} />,
};

export function Alert({ severity, title, children, onClose }: AlertProps) {
  return (
    <MuiAlert severity={severity} icon={icons[severity]} onClose={onClose}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
}