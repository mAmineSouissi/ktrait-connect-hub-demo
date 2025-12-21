import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientStore } from "@/hooks/stores/useClientStore";
import type { UpdateClientRequest } from "@/types/client.types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientUpdateFormProps {
  className?: string;
  updateClient?: (data: { id: string; data: UpdateClientRequest }) => void;
  isUpdatePending?: boolean;
}

export const ClientUpdateForm = ({
  className,
  updateClient,
  isUpdatePending = false,
}: ClientUpdateFormProps) => {
  const { updateDto, setUpdateField, updateDtoErrors, response } =
    useClientStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response?.id) {
      updateClient?.({ id: response.id, data: updateDto });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="updateFullName">
          Nom complet <span className="text-destructive">*</span>
        </Label>
        <Input
          id="updateFullName"
          placeholder="Prénom Nom"
          value={updateDto.full_name || ""}
          onChange={(e) => setUpdateField("full_name", e.target.value)}
          required
          disabled={isUpdatePending}
          className={updateDtoErrors.full_name ? "border-destructive" : ""}
        />
        {updateDtoErrors.full_name && (
          <p className="text-sm text-destructive">
            {updateDtoErrors.full_name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="updateEmail">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="updateEmail"
          type="email"
          placeholder="email@exemple.com"
          value={updateDto.email || ""}
          onChange={(e) => setUpdateField("email", e.target.value)}
          required
          disabled={isUpdatePending}
          className={updateDtoErrors.email ? "border-destructive" : ""}
        />
        {updateDtoErrors.email && (
          <p className="text-sm text-destructive">{updateDtoErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="updatePhone">Téléphone</Label>
        <Input
          id="updatePhone"
          placeholder="06 00 00 00 00"
          value={updateDto.phone || ""}
          onChange={(e) => setUpdateField("phone", e.target.value)}
          disabled={isUpdatePending}
          className={updateDtoErrors.phone ? "border-destructive" : ""}
        />
        {updateDtoErrors.phone && (
          <p className="text-sm text-destructive">{updateDtoErrors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="updateCity">Ville</Label>
        <Input
          id="updateCity"
          placeholder="Ville"
          value={updateDto.city || ""}
          onChange={(e) => setUpdateField("city", e.target.value)}
          disabled={isUpdatePending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="updateAddress">Adresse complète</Label>
        <Input
          id="updateAddress"
          placeholder="Adresse complète"
          value={updateDto.address || ""}
          onChange={(e) => setUpdateField("address", e.target.value)}
          disabled={isUpdatePending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="updatePostalCode">Code postal</Label>
          <Input
            id="updatePostalCode"
            placeholder="Code postal"
            value={updateDto.postal_code || ""}
            onChange={(e) => setUpdateField("postal_code", e.target.value)}
            disabled={isUpdatePending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="updateCompanyName">Nom de l'entreprise</Label>
          <Input
            id="updateCompanyName"
            placeholder="Nom de l'entreprise"
            value={updateDto.company_name || ""}
            onChange={(e) => setUpdateField("company_name", e.target.value)}
            disabled={isUpdatePending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="updateIsActive">Statut</Label>
        <Select
          value={updateDto.is_active ? "Actif" : "Inactif"}
          onValueChange={(value) =>
            setUpdateField("is_active", value === "Actif")
          }
          disabled={isUpdatePending}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Actif">Actif</SelectItem>
            <SelectItem value="Inactif">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isUpdatePending}
          className="min-w-[120px]"
        >
          {isUpdatePending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </div>
    </form>
  );
};
