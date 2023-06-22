
import React, { lazy, Suspense } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { LoadingSpin } from './components/UI/LoadingSpin';
import { PrivateRoute } from "./components/routes/privateRoute";
import { UseRouteChange } from "./components/routes/useRouteChange";
import { ExpTitle } from "./constants/constants";
//////////////////////////////////////////////////////////////////////
const HomePage = lazy(() => import("./pages/Home"));
const QuizPage = lazy(() => import("./pages/Quiz"));
const AboutPage = lazy(() => import("./pages/About"));
const ErrorPage = lazy(() => import('./pages/errorPage'));
const QuizResultPage = lazy(() => import("./pages/QuizResult"));
//////////////////////////////////////////////////////////////////////
const Workspace1 = lazy(() => import("./components/ExpNo1/workspace1"));
const Workspace2 = lazy(() => import("./components/ExpNo2/workspace2"));
const Workspace3 = lazy(() => import("./components/ExpNo3/workspace3"));
const Workspace4 = lazy(() => import("./components/ExpNo4/workspace4"));
const Workspace5 = lazy(() => import("./components/ExpNo5/workspace5"));
const Workspace6 = lazy(() => import("./components/ExpNo6/workspace6"));
//////////////////////////////////////////////////////////////////////

function App() {
  let [searchParams] = useSearchParams();
  UseRouteChange();
  return (
    <Routes>

      {/* ABOUT */}
      <Route
        path=""
        element={
          <Suspense fallback={<LoadingSpin />}>
            <AboutPage />
          </Suspense>
        }
      />

      {/* WORKSPACES */}
      <Route
        path="exp1"
        element={
          <Suspense fallback={<LoadingSpin />}>
            <Workspace1 title={ExpTitle[0]} />
          </Suspense>
        }
      />

      <Route
        path="exp2"
        element={
          <Suspense fallback={<LoadingSpin />}>
            <Workspace2 title={ExpTitle[1]} />
          </Suspense>
        }
      />

      <Route
        path="exp3"
        element={
          <Suspense fallback={<LoadingSpin />}>
            <Workspace3 title={ExpTitle[2]} />
          </Suspense>
        }
      />

      <Route
        path="exp4"
        element={
          <Suspense fallback={<LoadingSpin />}>
            <Workspace4 title={ExpTitle[3]} />
          </Suspense>
        }
      />

      <Route
        path="exp5"
        element={
          <Suspense fallback={<LoadingSpin />}>
            <Workspace5 title={ExpTitle[4]} />
          </Suspense>
        }
      />

      <Route
        path="exp6"
        element={
          <Suspense fallback={<LoadingSpin />}>
            <Workspace6 title={ExpTitle[5]} />
          </Suspense>
        }
      />

      <Route element={<PrivateRoute />}>

        {/* HOME */}
        <Route
          path="home"
          element={
            <Suspense fallback={<LoadingSpin />}>
              <HomePage />
            </Suspense>
          }
        />

        {/* Quiz PAGES */}

        {
          searchParams.get('exp') &&
          parseInt(searchParams.get('exp')) >= 0 &&
          parseInt(searchParams.get('exp')) <= 5 &&
          <Route
            path="quiz"
            element={
              <Suspense fallback={<LoadingSpin />}>
                <QuizPage />
              </Suspense>
            }
          />
        }

        {
          sessionStorage.getItem('answers') &&
          <Route
            path="result"
            element={
              <Suspense fallback={<LoadingSpin />}>
                <QuizResultPage />
              </Suspense>
            }
          />
        }

      </Route>

      {/* ERROR PAGE */}
      <Route
        path="*"
        element={
          <Suspense fallback={<LoadingSpin />}>
            <ErrorPage />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;

