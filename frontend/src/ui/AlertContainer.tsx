import { useAlertStore } from "../store/alertStore";
import { Alert } from "./Alert";

export function AlertContainer() {
  const { alerts, removeAlert } = useAlertStore();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 w-full max-w-sm">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          severity={alert.severity}
          title={alert.title}
          onClose={() => removeAlert(alert.id)}
        >
          {alert.message}
        </Alert>
      ))}
    </div>
  );
}