import router from "./router/router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { QueryProvider } from "@repo/providers";
import { AuthInitializer } from "./features/auth/AuthInitializer";

function App() {
  return (
    <QueryProvider>
      <AuthInitializer />
      <RouterProvider router={router} />
      <Toaster />
    </QueryProvider>
  );
}

export default App;
