import { RouterProvider } from "react-router-dom";
import router from "@/routes/router";
import "leaflet/dist/leaflet.css";
import { TooltipProvider } from "@repo/ui/components/ui/tooltip";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { ThemeProvider } from "@/components/common/ThemeProvider";

export default function App() {
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
