import { useEffect, useState } from "react";

export interface NotificationPayloadTypes {
  message: string;
  type: "error" | "success";
}

export const useNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationPayload, setNotificationPayload] =
    useState<NotificationPayloadTypes>({} as NotificationPayloadTypes);

  const activateNotification = (payload: NotificationPayloadTypes) => {
    setNotificationPayload(payload);
    setShowNotification(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowNotification(false);
    }, 1000);
  }, [showNotification]);

  return {
    showNotification,
    activateNotification,
    notificationPayload,
  };
};
