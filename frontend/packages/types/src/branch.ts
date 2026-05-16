export type BranchStatus = "active" | "inactive";

export interface Branch {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: BranchStatus;
  created_at: string;
}
