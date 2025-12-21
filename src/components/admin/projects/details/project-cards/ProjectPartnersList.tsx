"use client";

import { Badge } from "@/components/ui/badge";
import { HardHat, Star } from "lucide-react";
import type { ProjectPartner } from "@/types/project.types";

interface ProjectPartnersListProps {
  partners: (ProjectPartner & {
    partner?: { name: string; type: string } | null;
  })[];
}

// Partner type mapping for display
const partnerTypeMap: Record<string, string> = {
  architecte: "Architecte",
  bureau_études: "Bureau d'études",
  maître_d_œuvre: "Maître d'œuvre",
  artisan: "Artisan",
  fournisseur: "Fournisseur",
  autre: "Autre",
};

export const ProjectPartnersList = ({ partners }: ProjectPartnersListProps) => {
  if (partners.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Aucun partenaire assigné
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {partners.map((projectPartner) => (
        <div
          key={projectPartner.id}
          className="flex items-center justify-between p-2 rounded-md bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <HardHat className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {projectPartner.partner?.name || "Partenaire inconnu"}
              </p>
              {projectPartner.role && (
                <p className="text-xs text-muted-foreground">
                  {projectPartner.role}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {projectPartner.is_primary && (
              <Badge variant="outline" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Principal
              </Badge>
            )}
            {projectPartner.partner?.type && (
              <Badge variant="outline" className="text-xs">
                {partnerTypeMap[projectPartner.partner.type] ||
                  projectPartner.partner.type}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
