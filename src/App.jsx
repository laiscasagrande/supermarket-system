
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import RootLayout from "./Layouts/Root";
import Login from "./Pages/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <RootLayout />,
    children: [{ path: "/", element: <Login /> }],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
