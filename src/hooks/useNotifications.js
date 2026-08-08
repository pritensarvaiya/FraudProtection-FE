import { useCallback, useEffect, useState } from "react";

function isSupported() {
  return "Notification" in window && "serviceWorker" in navigator;
}

export function useNotifications() {
  const [permission, setPermission] = useState(
    isSupported() ? Notification.permission : "unsupported"
  );

  useEffect(() => {
    if (!isSupported()) return;
    setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported()) return "unsupported";
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const notify = useCallback(async (title, options) => {
    if (!isSupported() || Notification.permission !== "granted") return false;
    const registration = await navigator.serviceWorker.ready.catch(() => null);
    if (registration) {
      await registration.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
    return true;
  }, []);

  return {
    supported: isSupported(),
    permission,
    requestPermission,
    notify,
  };
}
