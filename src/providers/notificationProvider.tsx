import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import clear from "../../src/assets/svg/icn-clear.svg";
import "../index.scss";
interface Notification {
  id: string;
  message: string;
  type: "error" | "success";
}

interface NotificationContextType {
  showNotification: (message: string, type: "error" | "success") => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("Something wrong!");
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (message: string, type: "error" | "success") => {
      const id = Date.now().toString() + Math.random().toString(36);
      const newNotification: Notification = { id, message, type };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        hideNotification(id);
      }, 5000);
    },
    []
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);
  const contextValue = useMemo(() => ({ showNotification, hideNotification }), [
    showNotification,
    hideNotification,
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>

      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${notification.type} notification`}
          >
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => hideNotification(notification.id)}
              className="notification-close"
              aria-label="Close notification"
            >
              <img
                crossOrigin="anonymous"
                src={clear}
                alt=""
              />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
