import { SidebarProvider } from "@/components/ui/sidebar";
import { PartnerSidebar } from "@/components/layout/PartnerSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Building, User, Bell, Award, Plus, Star, Image, FolderOpen, Quote, Trash2, Edit, Calendar, MapPin, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Testimonial {
  id: number;
  clientName: string;
  projectName: string;
  text: string;
  rating: number;
  date: string;
}

interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  location: string;
  year: string;
  images: string[];
  category: string;
}

interface Certification {
  id: number;
  name: string;
  number: string;
  year: string;
  status: string;
}

export default function PartnerSettings() {
  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: 1, clientName: "Jean Dupont", projectName: "Villa Moderne", text: "Excellent travail, très professionnel. Je recommande vivement.", rating: 5, date: "2024-03" },
    { id: 2, clientName: "Marie Martin", projectName: "Rénovation Appartement", text: "Très satisfait du résultat final, respect des délais.", rating: 4, date: "2024-01" },
  ]);
  const [isAddTestimonialOpen, setIsAddTestimonialOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ clientName: "", projectName: "", text: "", rating: 5 });

  // Portfolio projects state
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([
    { id: 1, title: "Villa Contemporaine", description: "Construction d'une villa de 200m² avec piscine", location: "Nice", year: "2024", images: ["/placeholder.svg"], category: "Résidentiel" },
    { id: 2, title: "Bureaux Tech", description: "Aménagement de bureaux pour une startup", location: "Paris", year: "2023", images: ["/placeholder.svg", "/placeholder.svg"], category: "Commercial" },
  ]);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: "", description: "", location: "", year: "", category: "" });

  // Certifications state
  const [certifications, setCertifications] = useState<Certification[]>([
    { id: 1, name: "Ordre des Architectes", number: "12345", year: "2015", status: "Valide" },
    { id: 2, name: "HQE - Haute Qualité Environnementale", number: "HQE-2020-456", year: "2020", status: "Valide" },
    { id: 3, name: "BIM Manager Certifié", number: "BIM-2022-789", year: "2022", status: "Valide" },
  ]);
  const [isAddCertificationOpen, setIsAddCertificationOpen] = useState(false);
  const [certificationForm, setCertificationForm] = useState({ name: "", number: "", year: "" });

  // Photo gallery state
  const [photos, setPhotos] = useState<string[]>(["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);

  // Handlers for Testimonials
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestimonial: Testimonial = {
      id: Math.max(...testimonials.map(t => t.id), 0) + 1,
      ...testimonialForm,
      date: new Date().toISOString().slice(0, 7)
    };
    setTestimonials([...testimonials, newTestimonial]);
    setIsAddTestimonialOpen(false);
    setTestimonialForm({ clientName: "", projectName: "", text: "", rating: 5 });
    toast.success("Témoignage ajouté avec succès");
  };

  const handleDeleteTestimonial = (id: number) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
    toast.success("Témoignage supprimé");
  };

  // Handlers for Portfolio Projects
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: PortfolioProject = {
      id: Math.max(...portfolioProjects.map(p => p.id), 0) + 1,
      ...projectForm,
      images: ["/placeholder.svg"]
    };
    setPortfolioProjects([...portfolioProjects, newProject]);
    setIsAddProjectOpen(false);
    setProjectForm({ title: "", description: "", location: "", year: "", category: "" });
    toast.success("Projet ajouté au portfolio");
  };

  const handleDeleteProject = (id: number) => {
    setPortfolioProjects(portfolioProjects.filter(p => p.id !== id));
    toast.success("Projet supprimé du portfolio");
  };

  // Handlers for Certifications
  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: Certification = {
      id: Math.max(...certifications.map(c => c.id), 0) + 1,
      ...certificationForm,
      status: "Valide"
    };
    setCertifications([...certifications, newCert]);
    setIsAddCertificationOpen(false);
    setCertificationForm({ name: "", number: "", year: "" });
    toast.success("Certification ajoutée");
  };

  const handleDeleteCertification = (id: number) => {
    setCertifications(certifications.filter(c => c.id !== id));
    toast.success("Certification supprimée");
  };

  // Handlers for Photos
  const handleAddPhoto = () => {
    setPhotos([...photos, "/placeholder.svg"]);
    setIsAddPhotoOpen(false);
    toast.success("Photo ajoutée à la galerie");
  };

  const handleDeletePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    toast.success("Photo supprimée");
  };

  const handleSaveProfile = () => {
    toast.success("Profil enregistré avec succès");
  };

  const handleSaveCompany = () => {
    toast.success("Informations entreprise enregistrées");
  };

  const handleUpdatePassword = () => {
    toast.success("Mot de passe mis à jour");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PartnerSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader title="Paramètres" userName="Cabinet Martin" />
          
          <div className="flex-1 p-6 space-y-6">
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid w-full grid-cols-6 max-w-4xl">
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Entreprise</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profil</span>
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Portfolio</span>
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="flex items-center gap-2">
                  <Quote className="h-4 w-4" />
                  <span className="hidden sm:inline">Témoignages</span>
                </TabsTrigger>
                <TabsTrigger value="certifications" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Certifications</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
              </TabsList>

              {/* Company Tab */}
              <TabsContent value="company" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations entreprise</CardTitle>
                    <CardDescription>Informations visibles par KTRAIT et les clients</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Nom de l'entreprise</Label>
                        <Input defaultValue="Cabinet Martin Architecture" />
                      </div>
                      <div className="space-y-2">
                        <Label>SIRET</Label>
                        <Input defaultValue="987 654 321 00012" />
                      </div>
                      <div className="space-y-2">
                        <Label>Adresse</Label>
                        <Input defaultValue="45 Avenue des Architectes" />
                      </div>
                      <div className="space-y-2">
                        <Label>Ville</Label>
                        <Input defaultValue="75008 Paris" />
                      </div>
                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input defaultValue="01 23 45 67 89" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email professionnel</Label>
                        <Input defaultValue="contact@cabinet-martin.fr" />
                      </div>
                      <div className="space-y-2">
                        <Label>Site web</Label>
                        <Input defaultValue="www.cabinet-martin.fr" />
                      </div>
                      <div className="space-y-2">
                        <Label>Type d'activité</Label>
                        <Input defaultValue="Architecture" disabled />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        defaultValue="Cabinet d'architecture spécialisé dans les constructions résidentielles modernes et écologiques. Plus de 15 ans d'expérience." 
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveCompany}>Enregistrer</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact principal</CardTitle>
                    <CardDescription>Personne de contact pour les projets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                        PM
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Changer la photo</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Changer la photo de profil</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                              <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Glissez-déposez ou cliquez pour sélectionner</p>
                              <Input type="file" className="mt-4" accept="image/*" />
                            </div>
                            <DialogFooter>
                              <Button>Télécharger</Button>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Prénom</Label>
                        <Input defaultValue="Pierre" />
                      </div>
                      <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input defaultValue="Martin" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" defaultValue="p.martin@cabinet-martin.fr" />
                      </div>
                      <div className="space-y-2">
                        <Label>Téléphone direct</Label>
                        <Input defaultValue="06 12 34 56 78" />
                      </div>
                      <div className="space-y-2">
                        <Label>Fonction</Label>
                        <Input defaultValue="Architecte principal / Gérant" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile}>Enregistrer</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Mot de passe actuel</Label>
                      <Input type="password" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Nouveau mot de passe</Label>
                        <Input type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirmer</Label>
                        <Input type="password" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleUpdatePassword}>Mettre à jour</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Projets Réalisés</CardTitle>
                        <CardDescription>Présentez vos réalisations aux clients</CardDescription>
                      </div>
                      <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un projet
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Nouveau Projet Portfolio</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAddProject} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Titre du projet *</Label>
                              <Input 
                                placeholder="Ex: Villa Contemporaine"
                                value={projectForm.title}
                                onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea 
                                placeholder="Décrivez le projet..."
                                value={projectForm.description}
                                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Localisation</Label>
                                <Input 
                                  placeholder="Ville"
                                  value={projectForm.location}
                                  onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Année</Label>
                                <Input 
                                  placeholder="2024"
                                  value={projectForm.year}
                                  onChange={(e) => setProjectForm({...projectForm, year: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Catégorie</Label>
                              <Input 
                                placeholder="Ex: Résidentiel, Commercial..."
                                value={projectForm.category}
                                onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Photos du projet</Label>
                              <Input type="file" multiple accept="image/*" />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" type="button" onClick={() => setIsAddProjectOpen(false)}>Annuler</Button>
                              <Button type="submit">Ajouter</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {portfolioProjects.map((project) => (
                        <Card key={project.id} className="overflow-hidden">
                          <div className="aspect-video bg-muted relative">
                            <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-2 right-2"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{project.title}</h4>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                              </div>
                              <Badge variant="secondary">{project.category}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {project.location}</span>
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {project.year}</span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {project.images.map((_, idx) => (
                                <div key={idx} className="w-12 h-12 bg-muted rounded" />
                              ))}
                              <Button variant="outline" size="sm" className="h-12">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Photo Gallery */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Galerie Photos</CardTitle>
                        <CardDescription>Photos de votre travail et de votre équipe</CardDescription>
                      </div>
                      <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Image className="h-4 w-4 mr-2" />
                            Ajouter des photos
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ajouter des photos</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                              <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Glissez-déposez ou cliquez pour sélectionner</p>
                              <Input type="file" className="mt-4" accept="image/*" multiple />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsAddPhotoOpen(false)}>Annuler</Button>
                              <Button onClick={handleAddPhoto}>Télécharger</Button>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
                          <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeletePhoto(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Testimonials Tab */}
              <TabsContent value="testimonials" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Témoignages Clients</CardTitle>
                        <CardDescription>Avis et retours de vos clients</CardDescription>
                      </div>
                      <Dialog open={isAddTestimonialOpen} onOpenChange={setIsAddTestimonialOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un témoignage
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Nouveau Témoignage</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAddTestimonial} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Nom du client *</Label>
                                <Input 
                                  placeholder="Jean Dupont"
                                  value={testimonialForm.clientName}
                                  onChange={(e) => setTestimonialForm({...testimonialForm, clientName: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Projet *</Label>
                                <Input 
                                  placeholder="Nom du projet"
                                  value={testimonialForm.projectName}
                                  onChange={(e) => setTestimonialForm({...testimonialForm, projectName: e.target.value})}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Témoignage *</Label>
                              <Textarea 
                                placeholder="Le témoignage du client..."
                                value={testimonialForm.text}
                                onChange={(e) => setTestimonialForm({...testimonialForm, text: e.target.value})}
                                rows={4}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Note</Label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Button
                                    key={star}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setTestimonialForm({...testimonialForm, rating: star})}
                                  >
                                    <Star className={`h-6 w-6 ${star <= testimonialForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" type="button" onClick={() => setIsAddTestimonialOpen(false)}>Annuler</Button>
                              <Button type="submit">Ajouter</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <Card key={testimonial.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold">{testimonial.clientName}</p>
                                <Badge variant="outline">{testimonial.projectName}</Badge>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className={`h-4 w-4 ${star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                              <p className="text-xs text-muted-foreground mt-2">{testimonial.date}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Certifications Tab */}
              <TabsContent value="certifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Certifications & Agréments</CardTitle>
                        <CardDescription>Vos qualifications professionnelles</CardDescription>
                      </div>
                      <Dialog open={isAddCertificationOpen} onOpenChange={setIsAddCertificationOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Nouvelle Certification</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAddCertification} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Nom de la certification *</Label>
                              <Input 
                                placeholder="Ex: Ordre des Architectes"
                                value={certificationForm.name}
                                onChange={(e) => setCertificationForm({...certificationForm, name: e.target.value})}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Numéro</Label>
                                <Input 
                                  placeholder="N° de certification"
                                  value={certificationForm.number}
                                  onChange={(e) => setCertificationForm({...certificationForm, number: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Année d'obtention</Label>
                                <Input 
                                  placeholder="2024"
                                  value={certificationForm.year}
                                  onChange={(e) => setCertificationForm({...certificationForm, year: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Document justificatif</Label>
                              <Input type="file" accept=".pdf,.jpg,.png" />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" type="button" onClick={() => setIsAddCertificationOpen(false)}>Annuler</Button>
                              <Button type="submit">Ajouter</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Award className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-muted-foreground">N° {cert.number} - Depuis {cert.year}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{cert.status}</Badge>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCertification(cert.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de notification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications par email</p>
                        <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Nouveaux projets assignés</p>
                        <p className="text-sm text-muted-foreground">Notification lors de l'assignation à un projet</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Nouvelles tâches</p>
                        <p className="text-sm text-muted-foreground">Notification lors de l'ajout d'une tâche</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rappels de deadline</p>
                        <p className="text-sm text-muted-foreground">Rappel 3 jours avant une échéance</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Validation documents</p>
                        <p className="text-sm text-muted-foreground">Notification lors de la validation/refus d'un document</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Messages</p>
                        <p className="text-sm text-muted-foreground">Notification pour les nouveaux messages</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}