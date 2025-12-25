// components/auth/AuthenticationForm.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/api";

interface AuthenticationFormProps {
  className?: string;
}

export const AuthenticationForm = ({ className }: AuthenticationFormProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user: authUser, isAuthenticated, setUser } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if already authenticated
    if (isAuthenticated) {
      toast({
        title: "Déjà connecté",
        description: "Vous êtes déjà connecté",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting sign in for:", email);

      const result = await api.auth.signIn({ email, password });

      console.log("Sign in successful:", result.user);

      // Update auth context - this will trigger the auth state change listener
      setUser(result.user);

      toast({
        title: "Succès",
        description: "Connexion réussie",
      });

      // Redirect based on role - use replace to avoid back button issues
      const role = result.user.role;
      const targetPath =
        role === "admin"
          ? "/admin"
          : role === "partner"
          ? "/partner"
          : "/client";

      console.log("Redirecting to:", targetPath);

      // Use replace instead of push and navigate immediately
      await router.replace(targetPath);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Sign in error:", error);

      // Check if it's a pending approval error
      if (error?.message?.includes("PENDING:")) {
        // Redirect to pending approval page
        await router.replace("/pending-approval");
        setIsLoading(false);
        return;
      }

      // Check if it's a rejected account error
      if (error?.message?.includes("REJECTED:")) {
        toast({
          title: "Compte rejeté",
          description: error.message.replace("REJECTED: ", ""),
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      let errorMessage = "Erreur de connexion";

      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && authUser && !isLoading) {
      const role = authUser.role;
      const targetPath =
        role === "admin"
          ? "/admin"
          : role === "partner"
          ? "/partner"
          : "/client";

      const currentPath = router.pathname;

      if (currentPath === "/" || currentPath.includes("/login")) {
        console.log("Already authenticated, redirecting to:", targetPath);
        router.replace(targetPath);
      }
    }
  }, [isAuthenticated, authUser, router, isLoading]);

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-accent/20 to-background p-4",
        className
      )}
    >
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">KTRAIT Platform</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à votre espace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push("/")}
              disabled={isLoading}
            >
              Retour
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
