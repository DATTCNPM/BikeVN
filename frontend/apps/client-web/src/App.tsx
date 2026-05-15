import { RouterProvider } from "react-router-dom";
import router from "@/routes/router";
import "leaflet/dist/leaflet.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/common/ThemeProvider";

import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export default function App() {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
