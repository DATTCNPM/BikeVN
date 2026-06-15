import { useState } from "react";

export function useGeolocation() {
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);

    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve(position);
        },
        (error) => {
          setLoading(false);
          reject(error);
        },
      );
    });
  };

  return {
    loading,
    getCurrentLocation,
  };
}
