import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type AlertComponentProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  setAlert: (alert: boolean) => void;
};

export default function AlertComponent({
  title,
  description,
  variant = "destructive",
  setAlert,
}: AlertComponentProps) {
  return (
    <Alert variant={variant}>
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
      <AlertAction>
        {variant === "destructive" ? (
          <Button variant="outline" onClick={() => setAlert(false)}>
            Undo
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setAlert(false)}>
            Dismiss
          </Button>
        )}
      </AlertAction>
    </Alert>
  );
}
