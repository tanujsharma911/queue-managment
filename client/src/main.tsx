import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./index.css";
import { initTheme } from "./lib/theme";

import { App } from "./App.tsx";
import { Queues } from "./pages/Queue.tsx";
import { Receptionist } from "./pages/Receptionist.tsx";
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { ViewToken } from "./pages/ViewToken.tsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "queues",
        element: <Queues />,
      },
      {
        path: "client",
        element: <ViewToken />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "receptionist",
        element: <Receptionist />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

// Initialize theme to avoid flash
initTheme();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RouterProvider router={route} />
    </TooltipProvider>
  </QueryClientProvider>,
);
