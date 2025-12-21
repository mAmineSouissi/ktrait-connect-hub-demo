"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Building,
  FolderKanban,
  FileText,
  Award,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import type { PartnerWithDetails } from "@/types/partner.types";
import { formatDate } from "@/lib/date.util";

interface AdminPartnerDetailProps {
  id: string;
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

// Project status mapping
const projectStatusMap: Record<string, string> = {
  planifié: "Planifié",
  en_cours: "En cours",
  en_attente: "En attente",
  terminé: "Terminé",
  annulé: "Annulé",
};

export const AdminPartnerDetail = ({ id }: AdminPartnerDetailProps) => {
  const router = useRouter();

  const {
    data: partnerData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["partner", id],
    queryFn: async () => {
      const result = await api.admin.partners.getById(id);
      return result.partner;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/partners")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !partnerData) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/partners")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Partenaire introuvable."}
        </p>
      </div>
    );
  }

  const partner: PartnerWithDetails = partnerData;

  return (
    <div className="w-full space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/admin/partners")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la liste
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Partner Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informations</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                // TODO: Open edit sheet
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Building className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{partner.name}</h3>
              <Badge className="mt-2" variant="outline">
                {partnerTypeMap[partner.type] || partner.type}
              </Badge>
            </div>
            <div className="space-y-3 pt-4 border-t">
              {partner.user?.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.user.email}</span>
                </div>
              )}
              {partner.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.phone}</span>
                </div>
              )}
              {partner.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.address}</span>
                  {partner.city && <span>, {partner.city}</span>}
                </div>
              )}
            </div>
            {partner.contact_person && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Contact principal
                </p>
                <p className="font-medium">{partner.contact_person}</p>
              </div>
            )}
            {partner.since_date && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Partenaire depuis
                </p>
                <p className="font-medium">{formatDate(partner.since_date)}</p>
              </div>
            )}
            <div className="pt-4 border-t">
              <Badge
                variant={partner.status === "Actif" ? "default" : "secondary"}
              >
                {partner.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Card */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="projects" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="projects"
                  className="flex items-center gap-2"
                >
                  <FolderKanban className="h-4 w-4" />
                  Projets ({partner.projects_count || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Documents ({partner.documents_count || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="certifications"
                  className="flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  Certifications ({partner.certifications?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Portfolio ({partner.personal_projects?.length || 0})
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              {/* Projects Tab */}
              <TabsContent value="projects" className="mt-0">
                {partner.projects && partner.projects.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Projet</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partner.projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">
                            {project.name}
                          </TableCell>
                          <TableCell>{project.client_name || "N/A"}</TableCell>
                          <TableCell>
                            {project.role || (
                              <span className="text-muted-foreground">—</span>
                            )}
                            {project.is_primary && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Principal
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.status === "en_cours"
                                  ? "default"
                                  : project.status === "terminé"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {projectStatusMap[project.status] ||
                                project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/projects/${project.id}`)
                              }
                            >
                              Voir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun projet assigné
                  </div>
                )}
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-0">
                <div className="text-center py-8 text-muted-foreground">
                  {partner.documents_count || 0} document
                  {(partner.documents_count || 0) !== 1 ? "s" : ""} associé
                  {(partner.documents_count || 0) !== 1 ? "s" : ""} à ce
                  partenaire
                </div>
              </TabsContent>

              {/* Certifications Tab */}
              <TabsContent value="certifications" className="mt-0">
                {partner.certifications && partner.certifications.length > 0 ? (
                  <div className="space-y-4">
                    {partner.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <div className="text-sm text-muted-foreground space-y-1">
                              {cert.number && <p>N° {cert.number}</p>}
                              {cert.issuing_organization && (
                                <p>Émis par: {cert.issuing_organization}</p>
                              )}
                              {cert.issue_date && (
                                <p>Émis le: {formatDate(cert.issue_date)}</p>
                              )}
                              {cert.expiry_date && (
                                <p>Expire le: {formatDate(cert.expiry_date)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            cert.status === "Valide"
                              ? "default"
                              : cert.status === "Expiré"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {cert.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune certification enregistrée
                  </div>
                )}
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="mt-0">
                {partner.personal_projects &&
                partner.personal_projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {partner.personal_projects.map((project) => (
                      <Card key={project.id} className="overflow-hidden">
                        {project.image_url && (
                          <div className="aspect-video bg-muted relative">
                            <img
                              src={project.image_url}
                              alt={project.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{project.name}</h4>
                              {project.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {project.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                {project.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {project.location}
                                  </div>
                                )}
                                {project.year && <div>{project.year}</div>}
                                {project.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {project.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant={
                                project.status === "publié"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {project.status === "publié"
                                ? "Publié"
                                : "Brouillon"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun projet personnel enregistré
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
