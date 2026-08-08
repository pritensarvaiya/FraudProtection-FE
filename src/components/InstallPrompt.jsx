import { useState } from "react";
import { usePwaInstall } from "../hooks/usePwaInstall";
import { useNotifications } from "../hooks/useNotifications";

const DISMISS_KEY = "scamshield-install-dismissed";

export default function InstallPrompt() {
  const { installed, canPromptInstall, promptInstall, isIosSafariNotInstalled } = usePwaInstall();
  const { supported: notificationsSupported, permission, requestPermission, notify } =
    useNotifications();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === "1");
  const [iosHelpOpen, setIosHelpOpen] = useState(false);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  async function handleInstallClick() {
    if (canPromptInstall) {
      await promptInstall();
      return;
    }
    if (isIosSafariNotInstalled) {
      setIosHelpOpen(true);
    }
  }

  async function handleNotifyClick() {
    const result = await requestPermission();
    if (result === "granted") {
      notify("Notifications enabled", {
        body: "You'll be notified about important fraud alerts here.",
        icon: "/pwa-192x192.png",
      });
    }
  }

  const showInstallRow = !installed && (canPromptInstall || isIosSafariNotInstalled);
  const showNotifyRow = notificationsSupported && permission === "default";

  if (dismissed || (!showInstallRow && !showNotifyRow)) return null;

  return (
    <div className="install-banner card">
      <button type="button" className="install-banner-close" onClick={dismiss} aria-label="Dismiss">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div className="install-banner-body">
        {showInstallRow && (
          <div className="install-banner-row">
            <div className="install-banner-copy">
              <strong>Install ScamShield AI</strong>
              <p>Add it to your home screen for one-tap access on Android and iOS.</p>
            </div>
            <button type="button" className="btn-secondary" onClick={handleInstallClick}>
              Install app
            </button>
          </div>
        )}

        {iosHelpOpen && (
          <ol className="install-banner-steps">
            <li>Tap the Share icon in Safari's toolbar</li>
            <li>Choose "Add to Home Screen"</li>
            <li>Tap "Add" — then reopen ScamShield AI from your home screen</li>
          </ol>
        )}

        {showNotifyRow && (
          <div className="install-banner-row">
            <div className="install-banner-copy">
              <strong>Enable notifications</strong>
              <p>
                Get alerted about important fraud checks.
                {isIosSafariNotInstalled && " On iOS, install the app first for this to work."}
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleNotifyClick}
              disabled={isIosSafariNotInstalled}
            >
              Enable
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
