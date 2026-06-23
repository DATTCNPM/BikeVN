import type { Branch, VehicleCardData } from "@repo/types";
import CardProduct from "@/components/common/CardProduct";

type Props = {
  branches: Branch[];
  branch?: Branch;
  vehicles: VehicleCardData[];
  onSelectBranch?: (branch: Branch) => void;
};

export default function BranchVehicleList({
  branches,
  branch,
  vehicles,
  onSelectBranch,
}: Props) {
  if (!branch) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-6 text-center">
          Please select a branch to view available vehicles
        </div>

        <p className="text-2xl font-bold">All Branches</p>
        <ul className="mt-4 space-y-2">
          {branches.map((b) => (
            <li key={b.id}>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => onSelectBranch?.(b)}
              >
                {b.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{branch.name}</h2>

        <p className="text-muted-foreground">
          {vehicles.length} vehicles available
        </p>
      </div>

      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="rounded-lg border p-6 text-center">
            No vehicles available
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <CardProduct key={vehicle.id} vehicle={vehicle} />
          ))
        )}
      </div>
    </>
  );
}
