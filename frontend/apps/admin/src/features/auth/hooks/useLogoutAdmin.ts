import { useQueryClient } from "@tanstack/react-query";

import { usePortalAuth } from "./usePortalAuth";

import { useNavigate } from "react-router-dom"; // <-- Thêm import useNavigate

export function useLogoutAdmin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // <-- Thêm useNavigate

  const logoutPortal = usePortalAuth((state) => state.logoutPortal);

  return () => {
    logoutPortal();
    // authStorageService.clearPortalTokens(); // (Dòng này có thể bỏ vì logoutPortal đã làm ở trên)

    queryClient.clear();

    void navigate("/login"); // <-- Thêm dòng này để đá user về trang login admin
  };
}
