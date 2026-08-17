import { create } from 'zustand';

type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

interface AlertItem {
  id: string;
  severity: AlertSeverity;
  title?: string;
  message: string;
}

interface AlertStore {
  alerts: AlertItem[];
  addAlert: (alert: Omit<AlertItem, 'id'>) => void;
  removeAlert: (id: string) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  addAlert: (alert) => {
    const id = crypto.randomUUID();
    set((state) => ({ alerts: [...state.alerts, { ...alert, id }] }));

    setTimeout(() => {
      set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) }));
    }, 5000);
  },
  removeAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
}));