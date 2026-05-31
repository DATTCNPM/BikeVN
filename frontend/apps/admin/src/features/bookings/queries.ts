import { useQuery } from "@tanstack/react-query";

import { bookingAdminApi } from "@repo/api";
import { bookingsKeys } from "@repo/hooks";

export function useBookings() {
  return useQuery({
    queryKey: bookingsKeys.all,
    queryFn: bookingAdminApi.getBookings,
  });
}
