import { type PropsWithChildren, useState, useEffect } from "react";
import type { NonOAuthError } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

import { useGoogleDrive } from "src/contexts/GoogleDriveContext";
import { Button } from "src/components/common/Button";

import { DriveSettingsHook } from "./DriveSettingsHook";

type NonDriveErrorMessageProps = {
  error: NonOAuthError;
};

function PopupErrorMessage({ error }: NonDriveErrorMessageProps) {
  return (
    <span className="flex items-center gap-2">
      <FontAwesomeIcon className="text-yellow-300" icon={faTriangleExclamation} />
      {error.type === "popup_closed" ? (
        <span>Popup window closed before authorization completed.</span>
      ) : error.type === "popup_failed_to_open" ? (
        <span>Popup window blocked. Please allow popups for this site.</span>
      ) : (
        <span>An unknown error occurred.</span>
      )}
    </span>
  );
}

type ErrorNoticeProps = {
  retry: () => void;
  error: NonOAuthError | Error;
};

function ErrorNotice({ retry, error }: ErrorNoticeProps) {
  return (
    <div className="flex items-center rounded-md bg-red-900">
      <div className="flex items-center gap-2 px-2">
        {error instanceof Error ? <span>Error: {error.message}</span> : <PopupErrorMessage error={error} />}
      </div>
      <Button onClick={retry}>Retry</Button>
    </div>
  );
}

function InfoNotice({ children }: PropsWithChildren) {
  return <div className="flex min-w-fit flex-col items-center gap-1">{children}</div>;
}

export default function DriveAccess() {
  const { requestDriveAccess, disconnectDrive, isDriveLoaded, isDriveAuthorizing, hasDriveAccess, error } =
    useGoogleDrive();

  const { driveSettings, setAutoConnectDrive } = DriveSettingsHook();
  const { autoConnectDrive } = driveSettings;
  const [rememberAutoConnect, setRememberAutoConnect] = useState(autoConnectDrive);

  const handleAccessRequest = () => {
    setAutoConnectDrive(rememberAutoConnect);
    requestDriveAccess();
  };

  const handleDisconnectDrive = () => {
    setAutoConnectDrive(false);
    disconnectDrive();
  };

  useEffect(() => {
    if (!isDriveLoaded || error) return;

    if (autoConnectDrive && !hasDriveAccess) requestDriveAccess();
  }, [requestDriveAccess, hasDriveAccess, autoConnectDrive, isDriveLoaded, error]);

  if (error) return <ErrorNotice retry={handleAccessRequest} error={error} />;

  if (!isDriveLoaded) {
    return (
      <InfoNotice>
        <span className="flex items-center gap-2">
          Loading Drive... <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
        </span>
      </InfoNotice>
    );
  }

  if (isDriveAuthorizing) {
    return (
      <InfoNotice>
        <span className="flex items-center gap-2">
          Authorizing Google Drive
          <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
        </span>
      </InfoNotice>
    );
  }

  if (hasDriveAccess) {
    return (
      <InfoNotice>
        <span className="flex items-center gap-2">
          Connected to Drive
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <Button onClick={handleDisconnectDrive}>Disconnect</Button>
      </InfoNotice>
    );
  } else if (autoConnectDrive) {
    return (
      <InfoNotice>
        <span className="flex gap-2">
          Connecting to Drive
          <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
        </span>
      </InfoNotice>
    );
  }

  return (
    <InfoNotice>
      <label htmlFor="drive-checkbox">
        <input
          id="drive-checkbox"
          type="checkbox"
          checked={rememberAutoConnect}
          onChange={(e) => setRememberAutoConnect(e.target.checked)}
        />
        &nbsp;Remember this choice
      </label>
      <Button onClick={handleAccessRequest}>
        Save to
        <img
          className="mx-1 inline-block h-4 w-4"
          src="https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/web-16dp/logo_drive_2020q4_color_2x_web_16dp.png"
          alt="Google Drive"
        />
        Google Drive
      </Button>
    </InfoNotice>
  );
}
