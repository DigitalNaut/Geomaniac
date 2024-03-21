import { type CredentialResponse, GoogleLogin, googleLogout } from "@react-oauth/google";
import { type PropsWithChildren, createContext, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

type UserContext = {
  user?: GoogleUserCredential | null;
  LoginButton(): JSX.Element | null;
  LogoutButton(): JSX.Element | null;
  UserCard(props: PropsWithChildren): JSX.Element | null;
  logout(reason?: string): void;
};

const userContext = createContext<UserContext | null>(null);

function Notification({ notification, onClick }: { notification?: string; onClick: () => void }) {
  if (!notification) return null;

  return (
    <div className="fixed left-0 top-0 flex w-full justify-center gap-2 bg-blue-400 p-1 shadow-xl sm:p-2 md:p-4">
      <div className="flex w-full justify-between px-4 sm:max-w-sm sm:px-0 md:max-w-md lg:max-w-lg">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span>{notification}</span>
        </div>
        <button onClick={() => onClick()}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}

export function useUser() {
  const context = useContext(userContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}

function LogoutButton() {
  const { logout, user } = useUser();

  if (!user) return null;

  return (
    <button className="g_id_signout" role="button" onClick={() => logout("Logged out")}>
      <FontAwesomeIcon icon={faDoorOpen} />
    </button>
  );
}

function UserCard({ children }: PropsWithChildren) {
  const { user } = useUser();

  if (!user) return null;

  const { picture, name, email } = user;

  return (
    <div className="group relative w-fit lg:fixed lg:right-2 lg:top-2">
      <img src={picture} alt="User avatar" width={32} height={32} className="size-8 rounded-full" />
      <div
        className="absolute right-0 top-0 z-50 flex  cursor-pointer items-center gap-2
          focus-within:gap-4 focus-within:rounded-md focus-within:bg-white focus-within:p-4 focus-within:text-black
          group-hover:gap-4 group-hover:rounded-md group-hover:bg-white group-hover:p-4 group-hover:text-black"
      >
        <a
          className="flex items-center group-focus-within:gap-2 group-hover:gap-2"
          href="https://drive.google.com/drive/settings"
          target="_blank"
          rel="noreferrer"
          title="Open preferences on Google Drive"
        >
          <img src={picture} alt="User avatar" width={32} height={32} className="size-8 rounded-full" />
          <div>
            <div className="hidden text-sm font-medium group-focus-within:block group-hover:block">{name}</div>
            <div className="hidden text-xs group-focus-within:block group-hover:block">{email}</div>
          </div>
        </a>
        <div className="ml-6 hidden flex-col group-focus-within:flex group-hover:flex">{children}</div>
      </div>
    </div>
  );
}

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<GoogleUserCredential | null>();
  const [notification, setNotification] = useState<string>();

  const onSignInSuccess = (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;

    if (!credential) throw new Error("No credential found");

    const userInfo: GoogleUserCredential = jwtDecode(credential);

    setUser(userInfo);
  };

  const logout = (reason?: string) => {
    googleLogout();
    setUser(null);
    setNotification(reason);

    setTimeout(() => setNotification(undefined), 3000);
  };

  const onSignInError = () => {
    logout("Error starting session");
  };

  function LoginButton() {
    if (user) return null;

    return (
      <GoogleLogin
        onSuccess={onSignInSuccess}
        onError={onSignInError}
        auto_select
        context="signin"
        itp_support
        shape="pill"
        locale="ES"
        size="large"
        theme="filled_blue"
        useOneTap
      />
    );
  }

  return (
    <userContext.Provider
      value={{
        user,
        UserCard,
        LoginButton,
        LogoutButton,
        logout,
      }}
    >
      {children}
      <Notification notification={notification} onClick={() => setNotification(undefined)} />
    </userContext.Provider>
  );
}
