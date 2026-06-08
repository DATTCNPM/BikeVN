import type { VehicleImage } from "@repo/types";
const filterImagePrimary = (images: VehicleImage[]) => {
  const primaryImage = images.find((img) => img.isPrimary === true);
  return primaryImage ? primaryImage.imageUrl : null;
};

export { filterImagePrimary };
