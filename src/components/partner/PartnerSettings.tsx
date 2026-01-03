"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Building,
  User,
  Bell,
  Award,
  Plus,
  Star,
  Image as ImageIcon,
  FolderOpen,
  Quote,
  Trash2,
  Edit,
  Calendar,
  MapPin,
  X,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { supabase } from "@/lib/supabase/client";
import type {
  PortfolioProject,
  Testimonial,
  Certification,
  PortfolioGalleryItem,
  PartnerProfile,
} from "@/api/partner/settings";

export default function PartnerSettings() {
  const queryClient = useQueryClient();

  // Dialog states
  const [isAddTestimonialOpen, setIsAddTestimonialOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [isAddCertificationOpen, setIsAddCertificationOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(
    null
  );

  // Form states
  const [testimonialForm, setTestimonialForm] = useState({
    client_name: "",
    project_name: "",
    text: "",
    rating: 5,
  });

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    location: "",
    year: "",
    category: "",
    image_url: "",
  });

  const [certificationForm, setCertificationForm] = useState({
    name: "",
    number: "",
    issuing_organization: "",
    issue_date: "",
    expiry_date: "",
    certificate_url: "",
  });

  // File upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const projectImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  const certificationFileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    user_phone: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    siret: "",
    company_name: "",
    website: "",
    bio: "",
    avatar_url: "",
  });

  // Fetch data
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["partner-profile"],
    queryFn: () => api.partner.settings.getProfile(),
  });

  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["partner-portfolio-projects"],
    queryFn: () => api.partner.settings.getPortfolioProjects(),
  });

  const { data: galleryData, isLoading: isLoadingGallery } = useQuery({
    queryKey: ["partner-gallery"],
    queryFn: () => api.partner.settings.getGallery(),
  });

  const { data: testimonialsData, isLoading: isLoadingTestimonials } = useQuery(
    {
      queryKey: ["partner-testimonials"],
      queryFn: () => api.partner.settings.getTestimonials(),
    }
  );

  const { data: certificationsData, isLoading: isLoadingCertifications } =
    useQuery({
      queryKey: ["partner-certifications"],
      queryFn: () => api.partner.settings.getCertifications(),
    });

  // Initialize profile form when data loads
  useEffect(() => {
    if (profileData?.profile) {
      const p = profileData.profile;
      setProfileForm({
        full_name: p.user?.full_name || "",
        user_phone: p.user?.phone || "",
        name: p.partner?.name || "",
        email: p.partner?.email || "",
        phone: p.partner?.phone || "",
        address: p.partner?.address || "",
        city: p.partner?.city || "",
        postal_code: p.partner?.postal_code || "",
        siret: p.siret || "",
        company_name: p.company_name || "",
        website: p.website || "",
        bio: p.bio || "",
        avatar_url: p.user?.avatar_url || "",
      });
    }
  }, [profileData]);

  // Profile mutations
  const updateProfileMutation = useMutation({
    mutationFn: api.partner.settings.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-profile"] });
      toast.success("Profil enregistré avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    },
  });

  // Portfolio project mutations
  const createProjectMutation = useMutation({
    mutationFn: api.partner.settings.createPortfolioProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partner-portfolio-projects"],
      });
      setIsAddProjectOpen(false);
      setProjectForm({
        name: "",
        description: "",
        location: "",
        year: "",
        category: "",
        image_url: "",
      });
      toast.success("Projet ajouté au portfolio");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'ajout du projet");
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.partner.settings.updatePortfolioProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partner-portfolio-projects"],
      });
      setIsEditProjectOpen(false);
      setEditingProject(null);
      toast.success("Projet modifié avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la modification du projet");
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: api.partner.settings.deletePortfolioProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partner-portfolio-projects"],
      });
      toast.success("Projet supprimé du portfolio");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression du projet");
    },
  });

  // Gallery mutations
  const createGalleryItemMutation = useMutation({
    mutationFn: api.partner.settings.createGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-gallery"] });
      setIsAddPhotoOpen(false);
      toast.success("Photo ajoutée à la galerie");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'ajout de la photo");
    },
  });

  const deleteGalleryItemMutation = useMutation({
    mutationFn: api.partner.settings.deleteGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-gallery"] });
      toast.success("Photo supprimée");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression de la photo");
    },
  });

  // Testimonial mutations
  const createTestimonialMutation = useMutation({
    mutationFn: api.partner.settings.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-testimonials"] });
      setIsAddTestimonialOpen(false);
      setTestimonialForm({
        client_name: "",
        project_name: "",
        text: "",
        rating: 5,
      });
      toast.success("Témoignage ajouté avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'ajout du témoignage");
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: api.partner.settings.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-testimonials"] });
      toast.success("Témoignage supprimé");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression du témoignage"
      );
    },
  });

  // Certification mutations
  const createCertificationMutation = useMutation({
    mutationFn: api.partner.settings.createCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-certifications"] });
      setIsAddCertificationOpen(false);
      setCertificationForm({
        name: "",
        number: "",
        issuing_organization: "",
        issue_date: "",
        expiry_date: "",
        certificate_url: "",
      });
      toast.success("Certification ajoutée");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de l'ajout de la certification"
      );
    },
  });

  const deleteCertificationMutation = useMutation({
    mutationFn: api.partner.settings.deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-certifications"] });
      toast.success("Certification supprimée");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression de la certification"
      );
    },
  });

  // File upload handlers
  const uploadImage = async (
    file: File,
    folder: string = "portfolio"
  ): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(error.message || "Erreur lors de l'upload");
    }
  };

  const handleProjectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImage(file, "portfolio");
      setProjectForm({ ...projectForm, image_url: url });
      toast.success("Image téléchargée avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i], "gallery");
        await createGalleryItemMutation.mutateAsync({
          image_url: url,
          title: files[i].name,
        });
      }
      toast.success(`${files.length} photo(s) ajoutée(s) à la galerie`);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload des photos");
    } finally {
      setUploadingImage(false);
      if (galleryImageInputRef.current) {
        galleryImageInputRef.current.value = "";
      }
    }
  };

  const handleCertificationFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImage(file, "certifications");
      setCertificationForm({ ...certificationForm, certificate_url: url });
      toast.success("Document téléchargé avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload du document");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImage(file, "avatars");
      setProfileForm({ ...profileForm, avatar_url: url });
      await updateProfileMutation.mutateAsync({ avatar_url: url });
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload de l'avatar");
    } finally {
      setUploadingImage(false);
    }
  };

  // Form handlers
  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileForm);
  };

  const handleSaveCompany = () => {
    updateProfileMutation.mutate({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      address: profileForm.address,
      city: profileForm.city,
      postal_code: profileForm.postal_code,
      siret: profileForm.siret,
      company_name: profileForm.company_name,
      website: profileForm.website,
      bio: profileForm.bio,
    });
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate({
      name: projectForm.name,
      description: projectForm.description,
      location: projectForm.location,
      year: projectForm.year,
      category: projectForm.category,
      image_url: projectForm.image_url,
    });
  };

  const handleEditProject = (project: PortfolioProject) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description || "",
      location: project.location || "",
      year: project.year?.toString() || "",
      category: project.category || "",
      image_url: project.image_url || "",
    });
    setIsEditProjectOpen(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    updateProjectMutation.mutate({
      id: editingProject.id,
      data: {
        name: projectForm.name,
        description: projectForm.description,
        location: projectForm.location,
        year: projectForm.year,
        category: projectForm.category,
        image_url: projectForm.image_url,
      },
    });
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    createTestimonialMutation.mutate({
      client_name: testimonialForm.client_name,
      project_name: testimonialForm.project_name,
      text: testimonialForm.text,
      rating: testimonialForm.rating,
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) {
      deleteTestimonialMutation.mutate(id);
    }
  };

  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    createCertificationMutation.mutate({
      name: certificationForm.name,
      number: certificationForm.number,
      issuing_organization: certificationForm.issuing_organization,
      issue_date: certificationForm.issue_date || undefined,
      expiry_date: certificationForm.expiry_date || undefined,
      certificate_url: certificationForm.certificate_url,
    });
  };

  const handleDeleteCertification = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette certification ?")) {
      deleteCertificationMutation.mutate(id);
    }
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) {
      deleteGalleryItemMutation.mutate(id);
    }
  };

  const profile = profileData?.profile;
  const portfolioProjects = projectsData?.projects || [];
  const galleryItems = galleryData?.gallery || [];
  const testimonials = testimonialsData?.testimonials || [];
  const certifications = certificationsData?.certifications || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
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
              <TabsTrigger
                value="portfolio"
                className="flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger
                value="testimonials"
                className="flex items-center gap-2"
              >
                <Quote className="h-4 w-4" />
                <span className="hidden sm:inline">Témoignages</span>
              </TabsTrigger>
              <TabsTrigger
                value="certifications"
                className="flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Certifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
            </TabsList>

            {/* Company Tab */}
            <TabsContent value="company" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations entreprise</CardTitle>
                  <CardDescription>
                    Informations visibles par KTRAIT et les clients
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoadingProfile ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Nom de l'entreprise</Label>
                          <Input
                            value={profileForm.name}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SIRET</Label>
                          <Input
                            value={profileForm.siret}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                siret: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Adresse</Label>
                          <Input
                            value={profileForm.address}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ville</Label>
                          <Input
                            value={profileForm.city}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                city: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Téléphone</Label>
                          <Input
                            value={profileForm.phone}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email professionnel</Label>
                          <Input
                            value={profileForm.email}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Site web</Label>
                          <Input
                            value={profileForm.website}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                website: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type d'activité</Label>
                          <Input
                            value={profile?.partner?.type || ""}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={profileForm.bio}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              bio: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSaveCompany}
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Enregistrer
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact principal</CardTitle>
                  <CardDescription>
                    Personne de contact pour les projets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoadingProfile ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-6">
                        {profile?.user?.avatar_url ? (
                          <img
                            src={profile.user.avatar_url}
                            alt="Avatar"
                            className="h-24 w-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                            {getInitials(profileForm.full_name || "PM")}
                          </div>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" disabled={uploadingImage}>
                              {uploadingImage ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Téléchargement...
                                </>
                              ) : (
                                "Changer la photo"
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Changer la photo de profil
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Glissez-déposez ou cliquez pour sélectionner
                                </p>
                                <Input
                                  ref={avatarInputRef}
                                  type="file"
                                  className="mt-4"
                                  accept="image/*"
                                  onChange={handleAvatarUpload}
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Prénom et Nom</Label>
                          <Input
                            value={profileForm.full_name}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                full_name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={profile?.user?.email || ""}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Téléphone direct</Label>
                          <Input
                            value={profileForm.user_phone}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                user_phone: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Enregistrer
                        </Button>
                      </div>
                    </>
                  )}
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
                    <Button variant="outline">Mettre à jour</Button>
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
                      <CardDescription>
                        Présentez vos réalisations aux clients
                      </CardDescription>
                    </div>
                    <Sheet
                      open={isAddProjectOpen}
                      onOpenChange={setIsAddProjectOpen}
                    >
                      <SheetTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un projet
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="min-w-[50vw] overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Nouveau Projet Portfolio</SheetTitle>
                          <SheetDescription>
                            Ajoutez un nouveau projet à votre portfolio
                          </SheetDescription>
                        </SheetHeader>
                        <form
                          onSubmit={handleAddProject}
                          className="space-y-4 mt-6"
                        >
                          <div className="space-y-2">
                            <Label>Titre du projet *</Label>
                            <Input
                              placeholder="Ex: Villa Contemporaine"
                              value={projectForm.name}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  name: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Décrivez le projet..."
                              value={projectForm.description}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  description: e.target.value,
                                })
                              }
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Localisation</Label>
                              <Input
                                placeholder="Ville"
                                value={projectForm.location}
                                onChange={(e) =>
                                  setProjectForm({
                                    ...projectForm,
                                    location: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Année</Label>
                              <Input
                                placeholder="2024"
                                value={projectForm.year}
                                onChange={(e) =>
                                  setProjectForm({
                                    ...projectForm,
                                    year: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Input
                              placeholder="Ex: Résidentiel, Commercial..."
                              value={projectForm.category}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  category: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Image principale</Label>
                            <Input
                              ref={projectImageInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleProjectImageUpload}
                              disabled={uploadingImage}
                            />
                            {projectForm.image_url && (
                              <img
                                src={projectForm.image_url}
                                alt="Preview"
                                className="mt-2 w-full h-48 object-cover rounded-lg"
                              />
                            )}
                          </div>
                          <SheetFooter className="mt-6">
                            <Button
                              variant="outline"
                              type="button"
                              onClick={() => setIsAddProjectOpen(false)}
                            >
                              Annuler
                            </Button>
                            <Button
                              type="submit"
                              disabled={
                                createProjectMutation.isPending ||
                                uploadingImage
                              }
                            >
                              {createProjectMutation.isPending && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              )}
                              Ajouter
                            </Button>
                          </SheetFooter>
                        </form>
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingProjects ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : portfolioProjects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun projet dans votre portfolio
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {portfolioProjects.map((project) => (
                        <Card key={project.id} className="overflow-hidden">
                          <div className="aspect-video bg-muted relative">
                            {project.image_url ? (
                              <img
                                src={project.image_url}
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <ImageIcon className="h-12 w-12" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                              <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => handleEditProject(project)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteProject(project.id)}
                                disabled={deleteProjectMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  {project.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {project.description}
                                </p>
                              </div>
                              {project.category && (
                                <Badge variant="secondary">
                                  {project.category}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              {project.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />{" "}
                                  {project.location}
                                </span>
                              )}
                              {project.year && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />{" "}
                                  {project.year}
                                </span>
                              )}
                            </div>
                            {project.gallery && project.gallery.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {project.gallery.slice(0, 3).map((item) => (
                                  <img
                                    key={item.id}
                                    src={item.image_url}
                                    alt={item.title || ""}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ))}
                                {project.gallery.length > 3 && (
                                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs">
                                    +{project.gallery.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Edit Project Dialog */}
              <Dialog
                open={isEditProjectOpen}
                onOpenChange={setIsEditProjectOpen}
              >
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Modifier le projet</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateProject} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Titre du projet *</Label>
                      <Input
                        value={projectForm.name}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={projectForm.description}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Localisation</Label>
                        <Input
                          value={projectForm.location}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Année</Label>
                        <Input
                          value={projectForm.year}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              year: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <Input
                        value={projectForm.category}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            category: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image principale</Label>
                      <Input
                        ref={projectImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProjectImageUpload}
                        disabled={uploadingImage}
                      />
                      {projectForm.image_url && (
                        <img
                          src={projectForm.image_url}
                          alt="Preview"
                          className="mt-2 w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setIsEditProjectOpen(false);
                          setEditingProject(null);
                        }}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          updateProjectMutation.isPending || uploadingImage
                        }
                      >
                        {updateProjectMutation.isPending && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Enregistrer
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Photo Gallery */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Galerie Photos</CardTitle>
                      <CardDescription>
                        Photos de votre travail et de votre équipe
                      </CardDescription>
                    </div>
                    <Dialog
                      open={isAddPhotoOpen}
                      onOpenChange={setIsAddPhotoOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Ajouter des photos
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ajouter des photos</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed rounded-lg p-8 text-center">
                            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Glissez-déposez ou cliquez pour sélectionner
                            </p>
                            <Input
                              ref={galleryImageInputRef}
                              type="file"
                              className="mt-4"
                              accept="image/*"
                              multiple
                              onChange={handleGalleryImageUpload}
                              disabled={uploadingImage}
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsAddPhotoOpen(false)}
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={() => setIsAddPhotoOpen(false)}
                              disabled={uploadingImage}
                            >
                              {uploadingImage && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              )}
                              Fermer
                            </Button>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingGallery ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : galleryItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune photo dans la galerie
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {galleryItems.map((item) => (
                        <div
                          key={item.id}
                          className="relative aspect-square bg-muted rounded-lg overflow-hidden group"
                        >
                          <img
                            src={item.image_url}
                            alt={item.title || "Gallery item"}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            disabled={deleteGalleryItemMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
                      <CardDescription>
                        Avis et retours de vos clients
                      </CardDescription>
                    </div>
                    <Dialog
                      open={isAddTestimonialOpen}
                      onOpenChange={setIsAddTestimonialOpen}
                    >
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
                        <form
                          onSubmit={handleAddTestimonial}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nom du client *</Label>
                              <Input
                                placeholder="Jean Dupont"
                                value={testimonialForm.client_name}
                                onChange={(e) =>
                                  setTestimonialForm({
                                    ...testimonialForm,
                                    client_name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Projet *</Label>
                              <Input
                                placeholder="Nom du projet"
                                value={testimonialForm.project_name}
                                onChange={(e) =>
                                  setTestimonialForm({
                                    ...testimonialForm,
                                    project_name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Témoignage *</Label>
                            <Textarea
                              placeholder="Le témoignage du client..."
                              value={testimonialForm.text}
                              onChange={(e) =>
                                setTestimonialForm({
                                  ...testimonialForm,
                                  text: e.target.value,
                                })
                              }
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
                                  onClick={() =>
                                    setTestimonialForm({
                                      ...testimonialForm,
                                      rating: star,
                                    })
                                  }
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      star <= testimonialForm.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                </Button>
                              ))}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              type="button"
                              onClick={() => setIsAddTestimonialOpen(false)}
                            >
                              Annuler
                            </Button>
                            <Button
                              type="submit"
                              disabled={createTestimonialMutation.isPending}
                            >
                              {createTestimonialMutation.isPending && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              )}
                              Ajouter
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingTestimonials ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : testimonials.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun témoignage pour le moment
                    </p>
                  ) : (
                    testimonials.map((testimonial) => (
                      <Card key={testimonial.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold">
                                  {testimonial.client_name}
                                </p>
                                <Badge variant="outline">
                                  {testimonial.project_name}
                                </Badge>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= testimonial.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground italic">
                                "{testimonial.text}"
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(testimonial.date).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    year: "numeric",
                                    month: "long",
                                  }
                                )}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() =>
                                handleDeleteTestimonial(testimonial.id)
                              }
                              disabled={deleteTestimonialMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
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
                      <CardDescription>
                        Vos qualifications professionnelles
                      </CardDescription>
                    </div>
                    <Dialog
                      open={isAddCertificationOpen}
                      onOpenChange={setIsAddCertificationOpen}
                    >
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
                        <form
                          onSubmit={handleAddCertification}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label>Nom de la certification *</Label>
                            <Input
                              placeholder="Ex: Ordre des Architectes"
                              value={certificationForm.name}
                              onChange={(e) =>
                                setCertificationForm({
                                  ...certificationForm,
                                  name: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Numéro</Label>
                              <Input
                                placeholder="N° de certification"
                                value={certificationForm.number}
                                onChange={(e) =>
                                  setCertificationForm({
                                    ...certificationForm,
                                    number: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Organisme émetteur</Label>
                              <Input
                                placeholder="Organisme"
                                value={certificationForm.issuing_organization}
                                onChange={(e) =>
                                  setCertificationForm({
                                    ...certificationForm,
                                    issuing_organization: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Date d'obtention</Label>
                              <Input
                                type="date"
                                value={certificationForm.issue_date}
                                onChange={(e) =>
                                  setCertificationForm({
                                    ...certificationForm,
                                    issue_date: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Date d'expiration</Label>
                              <Input
                                type="date"
                                value={certificationForm.expiry_date}
                                onChange={(e) =>
                                  setCertificationForm({
                                    ...certificationForm,
                                    expiry_date: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Document justificatif</Label>
                            <Input
                              ref={certificationFileInputRef}
                              type="file"
                              accept=".pdf,.jpg,.png"
                              onChange={handleCertificationFileUpload}
                              disabled={uploadingImage}
                            />
                            {certificationForm.certificate_url && (
                              <a
                                href={certificationForm.certificate_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                Voir le document
                              </a>
                            )}
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              type="button"
                              onClick={() => setIsAddCertificationOpen(false)}
                            >
                              Annuler
                            </Button>
                            <Button
                              type="submit"
                              disabled={
                                createCertificationMutation.isPending ||
                                uploadingImage
                              }
                            >
                              {createCertificationMutation.isPending && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              )}
                              Ajouter
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingCertifications ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : certifications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune certification pour le moment
                    </p>
                  ) : (
                    certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <Award className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {cert.number && `N° ${cert.number}`}
                              {cert.number &&
                                cert.issuing_organization &&
                                " - "}
                              {cert.issuing_organization}
                              {cert.issue_date &&
                                ` - Depuis ${new Date(
                                  cert.issue_date
                                ).getFullYear()}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{cert.status}</Badge>
                          {cert.certificate_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={cert.certificate_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Voir
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteCertification(cert.id)}
                            disabled={deleteCertificationMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
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
                      <p className="text-sm text-muted-foreground">
                        Recevoir les alertes par email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nouveaux projets assignés</p>
                      <p className="text-sm text-muted-foreground">
                        Notification lors de l'assignation à un projet
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nouvelles tâches</p>
                      <p className="text-sm text-muted-foreground">
                        Notification lors de l'ajout d'une tâche
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rappels de deadline</p>
                      <p className="text-sm text-muted-foreground">
                        Rappel 3 jours avant une échéance
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Validation documents</p>
                      <p className="text-sm text-muted-foreground">
                        Notification lors de la validation/refus d'un document
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">
                        Notification pour les nouveaux messages
                      </p>
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
  );
}
