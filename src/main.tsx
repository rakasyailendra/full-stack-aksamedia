import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./pages/auth/login.tsx";
import { Toaster } from "react-hot-toast";
import Loading from "./components/loading.tsx";
import Index from "./pages/dashboard/index.tsx";
import Create from "./pages/dashboard/create.tsx";
import Update from "./pages/dashboard/update.tsx";
import Profile from "./pages/auth/profile.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/create/user",
    element: <Create />,
  },
  {
    path: "/update/user/:id",
    element: <Update />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} fallbackElement={<Loading />} />
  </StrictMode>
);
