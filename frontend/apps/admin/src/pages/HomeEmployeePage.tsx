import { useNavigate } from "react-router-dom";
import { Car, MessageSquare, Compass } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

export default function HomeEmployeePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background p-4 animate-fade-in">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 1. HOAT ẢNH VUI VẺ TRUNG TÂM */}
        <div className="relative flex items-center justify-center h-40">
          {/* Vòng tròn lan tỏa hiệu ứng sóng ngầm */}
          <div className="absolute size-32 rounded-full bg-primary/5 animate-ping duration-1000" />
          <div className="absolute size-24 rounded-full bg-primary/10 animate-pulse" />

          {/* Icon la bàn trung tâm xoay nhẹ */}
          <div className="relative size-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 animate-bounce">
            <Compass className="size-8 animate-[spin_8s_linear_infinite]" />
          </div>
        </div>

        {/* 2. THÔNG ĐIỆP ĐỊNH HƯỚNG */}
        <div className="space-y-2">
          <h1 className="text-xl font-black tracking-tight text-foreground">
            Employee Workspace
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            This account does not require a data dashboard. Please select one of
            your primary workspaces below to start handling daily operations.
          </p>
        </div>

        {/* 3. HAI NÚT ĐIỀU HƯỚNG LỚN */}
        <div className="grid gap-3.5 pt-4">
          <Button
            size="lg"
            variant="default"
            onClick={() => void navigate("/employee/vehicles")}
            className="h-14 rounded-2xl text-sm font-bold gap-3 shadow-md shadow-primary/10 transition-all active:scale-[0.98]"
          >
            <Car className="size-5 shrink-0" />
            Manage Vehicle Fleet
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => void navigate("/employee/chats")}
            className="h-14 rounded-2xl text-sm font-bold gap-3 border-border/80 hover:bg-muted/50 transition-all active:scale-[0.98]"
          >
            <MessageSquare className="size-5 shrink-0 text-muted-foreground" />
            Open Support Chat
          </Button>
        </div>
      </div>
    </main>
  );
}
