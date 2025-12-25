import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Mail, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PendingApprovalPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    // If user is approved or is admin, redirect to their dashboard
    if (!loading && user) {
      const approvalStatus = user.approval_status || "pending";
      if (user.role === "admin" || approvalStatus === "approved") {
        const targetPath =
          user.role === "admin"
            ? "/admin"
            : user.role === "partner"
            ? "/partner"
            : "/client";
        router.replace(targetPath);
        return;
      }

      if (approvalStatus === "rejected") {
        router.replace("/");
        return;
      }
    }

    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-2xl">
            Compte en attente d'approbation
          </CardTitle>
          <CardDescription>
            Votre compte nécessite l'approbation d'un administrateur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>En attente d'approbation</AlertTitle>
            <AlertDescription>
              Votre compte a été créé avec succès, mais il nécessite
              l'approbation d'un administrateur avant de pouvoir accéder à
              l'application.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Prochaines étapes</p>
                <p className="text-sm text-muted-foreground">
                  Un administrateur examinera votre demande et vous approuvera
                  sous peu. Vous recevrez une notification une fois votre compte
                  approuvé.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Besoin d'aide ?</p>
                <p className="text-sm text-muted-foreground">
                  Si vous avez des questions ou souhaitez accélérer le
                  processus, veuillez contacter l'administrateur directement.
                </p>
              </div>
            </div>
          </div>

          {user && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium mb-1">Informations du compte</p>
              <p className="text-xs text-muted-foreground">
                Email: <span className="font-mono">{user.email}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Nom: <span className="font-mono">{user.full_name}</span>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={() => router.reload()}
              variant="default"
              className="w-full"
            >
              Actualiser la page
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
