import { RouterProvider } from "react-router-dom";
import router from "@/routes/router";
import "leaflet/dist/leaflet.css";

export default function App() {
  return <RouterProvider router={router} />;
}
