// features/payments/components/VerificationModal.tsx
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/ui/alert-dialog";
import { UserCheck, AlertTriangle } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  missingFields: string[];
};

export default function VerificationModal({
  isOpen,
  onClose,
  missingFields,
}: Props) {
  const navigate = useNavigate();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md rounded-3xl p-6">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 mb-2">
            <AlertTriangle className="size-7" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold">
            Information Verification Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            To proceed with the payment, please update the following missing
            information in your profile:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 rounded-2xl bg-muted/50 p-4 space-y-2">
          {missingFields.map((field) => (
            <div
              key={field}
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <span className="size-2 rounded-full bg-amber-500" />
              {field}
            </div>
          ))}
        </div>

        <AlertDialogFooter className="grid grid-cols-2 gap-3 sm:space-x-0">
          <AlertDialogCancel
            onClick={onClose}
            className="h-12 rounded-2xl mt-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => navigate("/profile")}
            className="h-12 rounded-2xl bg-primary text-primary-foreground font-semibold"
          >
            <UserCheck className="size-4 mr-2" />
            Update Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
