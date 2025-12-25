"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import type { ChangePasswordRequest } from "@/api/client/profile";

interface ClientSecurityFormProps {
  className?: string;
}

export const ClientSecurityForm: React.FC<ClientSecurityFormProps> = ({ className }) => {
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    current_password: "",
    new_password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Change password mutation
  const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: (data: ChangePasswordRequest) => api.client.profile.changePassword(data),
    onSuccess: () => {
      toast.success("Mot de passe mis à jour avec succès");
      // Reset form
      setFormData({
        current_password: "",
        new_password: "",
      });
      setConfirmPassword("");
      setErrors({});
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour du mot de passe");
    },
  });

  const handleChange = (field: keyof ChangePasswordRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.current_password.trim()) {
      newErrors.current_password = "Le mot de passe actuel est requis";
    }

    if (!formData.new_password.trim()) {
      newErrors.new_password = "Le nouveau mot de passe est requis";
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirm_password = "La confirmation du mot de passe est requise";
    } else if (formData.new_password !== confirmPassword) {
      newErrors.confirm_password = "Les mots de passe ne correspondent pas";
    }

    if (formData.current_password === formData.new_password) {
      newErrors.new_password = "Le nouveau mot de passe doit être différent de l'actuel";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    changePassword(formData);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Changer le mot de passe</CardTitle>
        <CardDescription>
          Assurez-vous d'utiliser un mot de passe fort et sécurisé
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current_password">
              Mot de passe actuel <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Entrez votre mot de passe actuel"
                value={formData.current_password}
                onChange={(e) => handleChange("current_password", e.target.value)}
                required
                disabled={isChangingPassword}
                className={errors.current_password ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isChangingPassword}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-sm text-destructive">{errors.current_password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">
              Nouveau mot de passe <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Entrez votre nouveau mot de passe"
                value={formData.new_password}
                onChange={(e) => handleChange("new_password", e.target.value)}
                required
                disabled={isChangingPassword}
                className={errors.new_password ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isChangingPassword}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-sm text-destructive">{errors.new_password}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Le mot de passe doit contenir au moins 8 caractères
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">
              Confirmer le nouveau mot de passe <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmez votre nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirm_password) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.confirm_password;
                      return newErrors;
                    });
                  }
                }}
                required
                disabled={isChangingPassword}
                className={errors.confirm_password ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isChangingPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-sm text-destructive">{errors.confirm_password}</p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mettre à jour le mot de passe
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

