import type { Branch } from "@repo/schemas";

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestBranch(
  latitude: number,
  longitude: number,
  branches: Branch[],
) {
  return branches.reduce(
    (nearest, branch) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        branch.lat,
        branch.lng,
      );

      if (!nearest) {
        return {
          branch,
          distance,
        };
      }

      return distance < nearest.distance ? { branch, distance } : nearest;
    },
    null as { branch: Branch; distance: number } | null,
  );
}
