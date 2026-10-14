import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/layouts/root-layout";
import { HomePage } from "@/pages/home-page";
import { SettingsPage } from "@/pages/settings-page";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);
