import { faChartLine, faCog, faMap } from "@fortawesome/free-solid-svg-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import type { PropsWithChildren } from "react";
import { lazy, Suspense } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import { Spinner } from "src/components/common/Spinner";
import Footer from "src/components/layout/Footer";
import Nav from "src/components/layout/Header";
import StandardLayout from "src/components/layout/StandardLayout";
import { ActivityCoordinatorProvider } from "src/context/ActivityCoordinator";
import { MapContextProvider } from "src/context/Map/hook";
import { MapActivityProvider } from "src/context/MapActivity";
import { HeaderControllerProvider } from "src/context/useHeaderController";
import { store } from "src/store";
import { useAppSelector } from "src/store/hooks";

const LazyActivityMap = lazy(() => import("src/pages/ActivityMap"));
const LazySettings = lazy(() => import("src/pages/Settings"));
const LazyDashboard = lazy(() => import("src/pages/Dashboard"));
const LazyPageNotFound = lazy(() => import("src/pages/PageNotFound"));

const queryClient = new QueryClient();

function ErrorLog() {
  const errors = useAppSelector((state) => state.errorLog);

  if (!errors.length) return null;

  return (
    <div className="flex flex-col gap-2 bg-slate-800 p-4">
      <h3 className="text-lg font-bold">Errors {errors.length}</h3>
      <div className="flex max-h-[20vh] flex-col gap-2 overflow-y-scroll">
        {errors.map(({ id, error }) => (
          <div key={id} className="flex max-h-32 min-h-full flex-col gap-2 overflow-y-auto rounded-md bg-slate-700 p-2">
            <h4 className="text-base font-bold">{error.message}</h4>
            <pre className="max-w-full overflow-auto text-ellipsis">{error.stack}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <ReduxProvider store={store}>
          <HeaderControllerProvider>
            <Suspense fallback={<Spinner cover />}>{children}</Suspense>
          </HeaderControllerProvider>
        </ReduxProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}

function Layout() {
  return (
    <StandardLayout>
      <Nav>
        <div className="flex flex-1 gap-2 pl-6">
          <Nav.Link to="/" icon={faMap}>
            Map
          </Nav.Link>
          <Nav.Link to="../dashboard" icon={faChartLine}>
            Dashboard
          </Nav.Link>
          <Nav.Link to="../settings" icon={faCog}>
            Settings
          </Nav.Link>
        </div>

        <Nav.Logo title="Geomaniac" />
      </Nav>

      <Outlet />

      <ErrorLog />
      <Footer />
    </StandardLayout>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/:activity?/:kind?"
            index
            element={
              <MapContextProvider>
                <MapActivityProvider>
                  <ActivityCoordinatorProvider>
                    <LazyActivityMap />
                  </ActivityCoordinatorProvider>
                </MapActivityProvider>
              </MapContextProvider>
            }
          />
          <Route path="/settings" element={<LazySettings />} />
          <Route path="/dashboard" element={<LazyDashboard />} />
          <Route path="/*" element={<LazyPageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Providers>
      <Router />
    </Providers>
  );
}
