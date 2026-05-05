import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  action: string;
}

export default function AuthCard({
  title,
  description,
  children,
  action,
}: AuthCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
        <CardAction>
          {action === "login" ? (
            <Button variant="link" asChild>
              <Link to="/register">Đăng ký</Link>
            </Button>
          ) : (
            <Button variant="link" asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Home className="w-4 h-4" />
          Quay lại trang chủ
        </Link>
      </CardFooter>
    </Card>
  );
}
