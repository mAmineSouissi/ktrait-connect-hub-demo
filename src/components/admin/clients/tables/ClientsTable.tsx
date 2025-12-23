import { DisplayClient } from "@/components/shared/Displays.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Loader2, Mail, MapPin, Phone, Trash2 } from "lucide-react";
import { useRouter } from "next/router";

interface ClientsTableProps {
  filteredClients: DisplayClient[];
  isLoading: boolean;
  handleOpenEdit: (client: DisplayClient) => void;
  setSelectedClient: (client: DisplayClient) => void;
}

export const ClientsTable = ({
  filteredClients,
  isLoading,
  handleOpenEdit,
  setSelectedClient,
}: ClientsTableProps) => {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Liste des Clients ({isLoading ? "..." : filteredClients.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Projets</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {client.email}
                        </span>
                        {client.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {client.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.city ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {client.city}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{client.projects} projet(s)</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          client.status === "Actif"
                            ? "default"
                            : client.status === "En attente"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/admin/clients/${client.id}`)
                          }
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(client)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setSelectedClient(client)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
