"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type { ClientProfile, UpdateProfileRequest } from "@/api/client/profile";

interface ClientProfileFormProps {
  className?: string;
}

export const ClientProfileForm: React.FC<ClientProfileFormProps> = ({ className }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    full_name: "",
    phone: "",
    city: "",
    address: "",
    postal_code: "",
    company_name: "",
    tax_id: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch current profile
  const {
    data: profileResponse,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ["client-profile"],
    queryFn: () => api.client.profile.get(),
  });

  const profile = profileResponse?.profile;

  // Initialize form when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        address: profile.address || "",
        postal_code: profile.postal_code || "",
        company_name: profile.company_name || "",
        tax_id: profile.tax_id || "",
      });
    }
  }, [profile]);

  // Update profile mutation
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateProfileRequest) => api.client.profile.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      toast.success("Profil mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    },
  });

  const handleChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value || null }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.full_name?.trim()) {
      setErrors({ full_name: "Le nom complet est requis" });
      return;
    }

    updateProfile(formData);
  };

  // Get initials for avatar
  const getInitials = (name: string): string => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoadingProfile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (profileError) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-destructive text-center">
            Erreur lors du chargement du profil
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>
          Gérez vos informations de contact et votre profil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              getInitials(profile?.full_name || "User")
            )}
          </div>
          <div className="space-y-2">
            <Button variant="outline" type="button" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Changer la photo
            </Button>
            <p className="text-xs text-muted-foreground">
              La fonctionnalité de changement de photo sera disponible prochainement
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Nom complet <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full_name"
                placeholder="Jean Dupont"
                value={formData.full_name || ""}
                onChange={(e) => handleChange("full_name", e.target.value)}
                required
                disabled={isUpdating}
                className={errors.full_name ? "border-destructive" : ""}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                L'email ne peut pas être modifié
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06 12 34 56 78"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Nom de l'entreprise</Label>
              <Input
                id="company_name"
                placeholder="Entreprise SARL"
                value={formData.company_name || ""}
                onChange={(e) => handleChange("company_name", e.target.value)}
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                placeholder="123 Rue de Paris"
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Code postal</Label>
              <Input
                id="postal_code"
                placeholder="75001"
                value={formData.postal_code || ""}
                onChange={(e) => handleChange("postal_code", e.target.value)}
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                placeholder="Paris"
                value={formData.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_id">Numéro SIRET / TVA</Label>
              <Input
                id="tax_id"
                placeholder="12345678901234"
                value={formData.tax_id || ""}
                onChange={(e) => handleChange("tax_id", e.target.value)}
                disabled={isUpdating}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

