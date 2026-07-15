import { RouterProvider } from "react-router";
import { browserRouter } from "./routeConfig";

export default function RoutesProvider() {
  return <RouterProvider router={browserRouter}></RouterProvider>;
}
