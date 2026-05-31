export type BranchStatus = "active" | "inactive";

export interface Branch {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: BranchStatus;
  createdAt?: string;
}

export type CreateBranchPayload = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  status?: BranchStatus;
};

export type UpdateBranchPayload = Partial<CreateBranchPayload>;
