// src/layouts/ChatLayout.tsx

import Header from "@/layouts/Header";
import { Outlet } from "react-router-dom";

export default function ChatLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />

      <main className="flex-1 overflow-hidden pt-16">
        <Outlet />
      </main>
    </div>
  );
}
