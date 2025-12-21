"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useProjectColumns } from "./columns/useProjectColumns";
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { useProjectCreateSheet } from "./modals/ProjectCreateSheet";
import { useProjectUpdateSheet } from "./modals/ProjectUpdateSheet";
import { useProjectDeleteDialog } from "./modals/useProjectDeleteDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/api";
import type { Project } from "@/types/project.types";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/api/admin/projects";

interface AdminProjectsProps {
  className?: string;
}

export default function AdminProjects({ className }: AdminProjectsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectStore = useProjectStore();

  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortDetails, setSortDetails] = React.useState<{
    order: boolean;
    sortKey: string;
  }>({
    order: true, // true = desc, false = asc
    sortKey: "created_at",
  });

  // Debounce search and pagination
  const { value: debouncedSearchTerm, loading: searching } = useDebounce(
    searchTerm,
    500
  );
  const { value: debouncedPage, loading: paging } = useDebounce(page, 300);
  const { value: debouncedSize, loading: resizing } = useDebounce(size, 300);
  const { value: debouncedSortDetails, loading: sorting } = useDebounce(
    sortDetails,
    300
  );

  const offset = (debouncedPage - 1) * debouncedSize;

  // Fetch clients for dropdown
  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: () => api.admin.clients.list({ limit: 100 }),
  });

  const clients = clientsData?.clients || [];

  // Fetch projects
  const {
    data: projectsResponse,
    isFetching: isProjectsPending,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: [
      "projects",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.projects.list({
        search: debouncedSearchTerm || undefined,
        limit: debouncedSize,
        offset,
        sortKey: debouncedSortDetails.sortKey,
        order: debouncedSortDetails.order ? "desc" : "asc",
      }),
  });

  const projects = React.useMemo(() => {
    if (!projectsResponse) return [];
    return projectsResponse.projects;
  }, [projectsResponse]);

  const totalPageCount = React.useMemo(() => {
    if (!projectsResponse) return 0;
    return Math.ceil((projectsResponse.total || 0) / debouncedSize);
  }, [projectsResponse, debouncedSize]);

  // Create project mutation
  const { mutate: createProject, isPending: isCreationPending } = useMutation({
    mutationFn: async (
      data: CreateProjectRequest & { selectedPartnerIds?: string[] }
    ) => {
      const { selectedPartnerIds, ...projectData } = data;
      const result = await api.admin.projects.create(projectData);

      // Assign partners after project creation
      if (
        selectedPartnerIds &&
        selectedPartnerIds.length > 0 &&
        result.project?.id
      ) {
        try {
          await Promise.all(
            selectedPartnerIds.map((partnerId, index) =>
              api.admin.projectPartners.add(result.project.id, {
                partner_id: partnerId,
                is_primary: index === 0,
              })
            )
          );
        } catch (partnerError) {
          console.error("Error assigning partners:", partnerError);
          toast.warning(
            "Projet créé mais erreur lors de l'assignation des partenaires"
          );
        }
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Projet créé avec succès");
      refetchProjects();
      projectStore.reset();
      closeCreateProjectSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du projet");
    },
  });

  // Update project mutation
  const { mutate: updateProject, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      api.admin.projects.update(id, data),
    onSuccess: () => {
      toast.success("Projet modifié avec succès");
      refetchProjects();
      projectStore.reset();
      closeUpdateProjectSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la modification du projet");
    },
  });

  // Delete project mutation
  const { mutate: deleteProject, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: string) => api.admin.projects.delete(id),
    onSuccess: () => {
      toast.success("Projet supprimé avec succès");
      refetchProjects();
      projectStore.reset();
      closeDeleteProjectDialog();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression du projet");
    },
  });

  const handleCreateSubmit = () => {
    const data = projectStore.createDto;
    createProject({
      client_id: data.client_id,
      name: data.name,
      description: data.description || undefined,
      status: data.status as any,
      estimated_budget: data.estimated_budget
        ? parseFloat(
            data.estimated_budget.toString().replace(/\s/g, "").replace("€", "")
          )
        : undefined,
      start_date: data.start_date || undefined,
      end_date: data.end_date || undefined,
      address: data.address || undefined,
    });
  };

  const handleUpdateSubmit = () => {
    const data = projectStore.updateDto;
    const id = projectStore.response?.id;
    if (id) {
      updateProject({
        id,
        data: {
          name: data.name,
          description: data.description || undefined,
          status: data.status as any,
          estimated_budget: data.estimated_budget
            ? parseFloat(
                data.estimated_budget
                  .toString()
                  .replace(/\s/g, "")
                  .replace("€", "")
              )
            : undefined,
          start_date: data.start_date || undefined,
          end_date: data.end_date || undefined,
          address: data.address || undefined,
          progress: data.progress,
        },
      });
    }
  };

  const handleOpenEdit = async (project: Project) => {
    try {
      const { project: projectDetail } = await api.admin.projects.getById(
        project.id
      );
      projectStore.set("response", projectDetail);
      projectStore.initializeUpdateDto(projectDetail);
      openUpdateProjectSheet();
    } catch (error: any) {
      console.error("Error fetching project details:", error);
      toast.error("Erreur lors du chargement des détails du projet");
    }
  };

  const {
    createProjectSheet,
    openCreateProjectSheet,
    closeCreateProjectSheet,
  } = useProjectCreateSheet({
    createProject: handleCreateSubmit,
    isCreatePending: isCreationPending,
    resetProject: () => projectStore.reset(),
    clients,
  });

  const {
    updateProjectSheet,
    openUpdateProjectSheet,
    closeUpdateProjectSheet,
  } = useProjectUpdateSheet({
    updateProject: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetProject: () => projectStore.reset(),
    project: projectStore.response,
  });

  const {
    deleteProjectDialog,
    openDeleteProjectDialog,
    closeDeleteProjectDialog,
  } = useProjectDeleteDialog({
    projectName: projectStore.response?.name || "",
    deleteProject: () => {
      const id = projectStore.response?.id;
      if (id) {
        deleteProject(id);
      }
    },
    isDeleting: isDeletionPending,
  });

  const context: DataTableConfig<Project> = {
    singularName: "projet",
    pluralName: "projets",
    createCallback: openCreateProjectSheet,
    inspectCallback: (project: Project) => {
      router.push(`/admin/projects/${project.id}`);
    },
    updateCallback: handleOpenEdit,
    deleteCallback: async (project: Project) => {
      try {
        const { project: projectDetail } = await api.admin.projects.getById(
          project.id
        );
        projectStore.set("response", projectDetail);
        openDeleteProjectDialog();
      } catch (error: any) {
        console.error("Error fetching project details:", error);
        toast.error("Erreur lors du chargement des détails du projet");
      }
    },
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    targetEntity: async (project: Project) => {
      try {
        const { project: projectDetail } = await api.admin.projects.getById(
          project.id
        );
        projectStore.set("response", projectDetail);
        projectStore.initializeUpdateDto(projectDetail);
      } catch (error: any) {
        console.error("Error fetching project details:", error);
      }
    },
  };

  const columns = useProjectColumns(context);

  const isPending =
    isProjectsPending || paging || resizing || searching || sorting;

  return (
    <div className={cn("flex flex-col overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden px-2"
        containerClassName="overflow-auto"
        columns={columns}
        data={projects}
        context={context}
        isPending={isPending}
        footerPagination={false}
      />
      {createProjectSheet}
      {deleteProjectDialog}
      {updateProjectSheet}
    </div>
  );
}
