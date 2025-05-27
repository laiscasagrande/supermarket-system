import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import RootLayout from "./layouts/RootLayout";
import Login from "./Page/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{ path: "/", element: <Login /> }],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
