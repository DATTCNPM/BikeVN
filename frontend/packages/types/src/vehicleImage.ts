export interface VehicleImage {
  id: string;
  vehicleId: string;

  imageUrl: string;

  altText?: string;

  displayOrder: number;

  isPrimary: boolean;

  createdAt: string;
}

export interface VehicleImageCreatePayload {
  file: File;

  altText?: string;

  displayOrder?: number;

  isPrimary?: boolean;
}

export interface VehicleImageUpdatePayload {
  file?: File;

  altText?: string;

  displayOrder?: number;

  isPrimary?: boolean;
}
