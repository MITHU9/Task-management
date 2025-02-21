import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TaskContextProvider } from "./context/Context.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./router/routes.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TaskContextProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </TaskContextProvider>
  </StrictMode>
);
