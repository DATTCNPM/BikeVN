import router from "./router/router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { QueryProvider } from "@repo/providers";

function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster />
    </QueryProvider>
  );
}

export default App;
