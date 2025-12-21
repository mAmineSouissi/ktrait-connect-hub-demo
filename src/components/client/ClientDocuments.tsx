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
import { Search, FileText, Download, Eye, Folder } from "lucide-react";
import { useState } from "react";

const documentsByProject = {
  "Villa Moderne": [
    {
      id: 1,
      name: "Contrat signé",
      type: "PDF",
      date: "15/01/2024",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Permis de construire",
      type: "PDF",
      date: "10/01/2024",
      size: "5.6 MB",
    },
    {
      id: 3,
      name: "Plans architecturaux v3",
      type: "PDF",
      date: "20/01/2024",
      size: "8.2 MB",
    },
    {
      id: 4,
      name: "Devis global validé",
      type: "PDF",
      date: "22/01/2024",
      size: "1.2 MB",
    },
    {
      id: 5,
      name: "Planning chantier",
      type: "PDF",
      date: "25/01/2024",
      size: "0.8 MB",
    },
    {
      id: 6,
      name: "Rapport d'avancement Mars",
      type: "PDF",
      date: "01/04/2024",
      size: "3.5 MB",
    },
  ],
  "Extension Garage": [
    {
      id: 7,
      name: "Contrat signé",
      type: "PDF",
      date: "01/06/2023",
      size: "1.8 MB",
    },
    {
      id: 8,
      name: "Plans garage",
      type: "PDF",
      date: "05/06/2023",
      size: "4.2 MB",
    },
    {
      id: 9,
      name: "PV réception travaux",
      type: "PDF",
      date: "15/09/2023",
      size: "1.1 MB",
    },
  ],
  "Rénovation Cuisine": [
    {
      id: 10,
      name: "Devis préliminaire",
      type: "PDF",
      date: "15/03/2024",
      size: "0.9 MB",
    },
    {
      id: 11,
      name: "Plans cuisine 3D",
      type: "PDF",
      date: "20/03/2024",
      size: "6.3 MB",
    },
  ],
};

export const ClientDocuments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("Villa Moderne");

  const projects = Object.keys(documentsByProject);
  const documents =
    documentsByProject[selectedProject as keyof typeof documentsByProject] ||
    [];

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
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
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedProject === project ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <CardContent className="pt-6 flex items-center gap-4">
                  <Folder className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-medium">{project}</p>
                    <p className="text-sm text-muted-foreground">
                      {
                        documentsByProject[
                          project as keyof typeof documentsByProject
                        ].length
                      }{" "}
                      documents
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                {selectedProject}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Date</TableHead>
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
                      <TableCell>
                        <Badge variant="secondary">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.date}</TableCell>
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
};
