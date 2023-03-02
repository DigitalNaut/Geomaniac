import { ErrorBoundary } from "react-error-boundary";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { GoogleDriveProvider } from "src/controllers/GoogleDriveContext";
import MapVisitor from "src/pages/MapVisitor";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import MapContextProvider from "src/controllers/MapContext";
import ErrorFallback from "src/components/ErrorFallback";
import { UserProvider } from "src/hooks/UserContext";
import DriveAccessTest from "src/components/DriveAccessTest";

export default function App() {
  return (
    <div className="flex h-screen w-full flex-col">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <UserProvider>
          <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
            onScriptLoadError={() => {
              throw new Error("Google OAuth script failed to load.");
            }}
          >
            <GoogleDriveProvider>
              <Header>
                <div className="flex w-full justify-center text-sm">
                  <DriveAccessTest />
                </div>
              </Header>
              <MapContextProvider>
                <MapVisitor />
              </MapContextProvider>
            </GoogleDriveProvider>
          </GoogleOAuthProvider>
        </UserProvider>
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
