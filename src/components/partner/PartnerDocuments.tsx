import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  FileText,
  Download,
  Eye,
  Upload,
  Folder,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const documents = [
  {
    id: 1,
    name: "Plans RDC v3",
    project: "Villa Moderne",
    type: "DWG",
    date: "20/03/2024",
    status: "Validé",
    size: "8.2 MB",
  },
  {
    id: 2,
    name: "Plans Étage v2",
    project: "Villa Moderne",
    type: "DWG",
    date: "25/03/2024",
    status: "En révision",
    size: "7.5 MB",
  },
  {
    id: 3,
    name: "Détails menuiseries",
    project: "Villa Moderne",
    type: "PDF",
    date: "22/03/2024",
    status: "Validé",
    size: "2.1 MB",
  },
  {
    id: 4,
    name: "Plans façade préliminaires",
    project: "Immeuble Lyon",
    type: "DWG",
    date: "28/03/2024",
    status: "En attente",
    size: "12.4 MB",
  },
  {
    id: 5,
    name: "Étude thermique",
    project: "Immeuble Lyon",
    type: "PDF",
    date: "15/03/2024",
    status: "Refusé",
    size: "5.6 MB",
  },
  {
    id: 6,
    name: "Rapport technique final",
    project: "Rénovation Bureau",
    type: "PDF",
    date: "10/01/2024",
    status: "Validé",
    size: "3.2 MB",
  },
];

export default function PartnerDocuments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Validé":
        return <CheckCircle className="h-4 w-4 text-kpi-success" />;
      case "En attente":
      case "En révision":
        return <Clock className="h-4 w-4 text-kpi-warning" />;
      case "Refusé":
        return <XCircle className="h-4 w-4 text-kpi-danger" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Validé":
        return "default";
      case "En attente":
      case "En révision":
        return "secondary";
      case "Refusé":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
      <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">

        <div className="flex-1 p-6 space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Folder className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{documents.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Total documents
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-kpi-success/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-kpi-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-kpi-success">3</p>
                    <p className="text-sm text-muted-foreground">Validés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-kpi-warning/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-kpi-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-kpi-warning">2</p>
                    <p className="text-sm text-muted-foreground">En attente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-kpi-danger/10 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-kpi-danger" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-kpi-danger">1</p>
                    <p className="text-sm text-muted-foreground">Refusés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un document..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Déposer un document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Déposer un document</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label>Projet</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un projet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Villa Moderne Dupont</SelectItem>
                        <SelectItem value="2">Immeuble Lyon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type de document</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plans">Plans</SelectItem>
                        <SelectItem value="rapport">Rapport</SelectItem>
                        <SelectItem value="etude">Étude technique</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fichier</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Cliquez ou glissez un fichier
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DWG, DXF jusqu'à 50MB
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsUploadOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">Téléverser</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mes Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{doc.project}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(doc.status)}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getStatusIcon(doc.status)}
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>  
  );
}
