import { createBrowserRouter, type RouteObject } from "react-router";
import { lazy } from "react";

const SetupPage = lazy(() => import("../pages/SetupPage"));
const InterviewPage = lazy(() => import("../pages/InterviewPage"));

const routesConfig: RouteObject[] = [
  {
    path: "/",
    Component: SetupPage,
  },
  {
    path: "/interview",
    Component: InterviewPage,
  },
];

export const browserRouter = createBrowserRouter(routesConfig);
