import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import {
  LoginFormData,
  loginSchema,
} from "@/types/validations/auth.validation";

const PartnerLogin = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { signIn, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (!isAuthenticated || !user) return;

    const role = user.role;
    const currentPath = router.pathname;

    // If user is authenticated and on login page, redirect to their dashboard
    if (currentPath === "/login" || currentPath.includes("/login")) {
      if (role === "partner") {
        router.push("/partner");
      } else {
        // User is authenticated but not partner - redirect to their role dashboard
        const rolePath =
          role === "admin" ? "/admin" : role === "client" ? "/client" : "/";
        router.push(rolePath);
        toast({
          title: "Non autorisé",
          description: "Vous n'avez pas accès à l'espace partenaire",
          variant: "destructive",
        });
      }
    }
  }, [isAuthenticated, user, router, toast]);

  // Clear local loading when global auth state changes
  React.useEffect(() => {
    if (isAuthenticated) setIsLoading(false);
  }, [isAuthenticated]);

  const onSubmit = async (data: LoginFormData) => {
    // Prevent submission if already authenticated
    if (isAuthenticated) {
      console.log("PartnerLogin: Already authenticated, skipping submission");
      return;
    }

    console.log("PartnerLogin: onSubmit start", { email: data.email });
    setIsLoading(true);

    try {
      await signIn({ email: data.email, password: data.password });
      console.log("PartnerLogin: signIn resolved");
      // Don't reload - let onAuthStateChange handle redirect
    } catch (error: any) {
      console.error("PartnerLogin: signIn error", error);
      toast({
        title: "Erreur",
        description: error?.message || "Erreur de connexion",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-kpi-success flex items-center justify-center">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Espace Partenaire</CardTitle>
          <CardDescription>Architectes, Ingénieurs & Fournisseurs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-12 flex items-center justify-center">
              Connexion en cours...
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="partenaire@example.com"
                    {...form.register("email")}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...form.register("password")}
                    disabled={isLoading}
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
                >
                  Retour
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerLogin;
