import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-lg font-semibold mb-2 text-rose-600">Acesso não autorizado</h2>
        <p className="text-sm text-muted-foreground mb-4">Sua conta não tem permissão para acessar este projeto.</p>
        <div className="flex justify-center gap-2">
          <Button onClick={() => navigate("/login")}>Tentar outro login</Button>
        </div>
      </div>
    </div>
  );
}
