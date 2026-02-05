import React from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname ?? "/";

  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Acesso restrito</h2>
        <p className="text-sm text-muted-foreground mb-4">Você precisa entrar com sua conta Google para acessar este projeto.</p>
        <Button
          onClick={async () => {
            try {
              await signInWithGoogle();
            } catch (e) {
              // signInWithGoogle já faz fallback e log, toast é exibido de qualquer forma na página principal
              console.error(e);
            }
          }}
          className="gradient-primary"
          disabled={loading}
        >
          Entrar com Google
        </Button>
        <p className="text-xs text-muted-foreground mt-3">Se você não é o proprietário aprovado, não terá acesso.</p>
      </div>
    </div>
  );
}
