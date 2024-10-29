import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Home from "../pages/home/Home";
import Disputes from "../pages/Disputes/Disputes";




export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Home />
    },
    {
        path:"/disputes",
        element:<Disputes/>
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}


