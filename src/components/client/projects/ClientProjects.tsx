"use client";

import React from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useClientProjectColumns } from "./columns/useClientProjectColumns";
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { useClientProjectCreateSheet } from "./modals/ClientProjectCreateSheet";
import { useClientProjectUpdateSheet } from "./modals/ClientProjectUpdateSheet";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/api";
import type { Project } from "@/types/project.types";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/api/client/projects";

interface ClientProjectsProps {
  className?: string;
}

export default function ClientProjects({ className }: ClientProjectsProps) {
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

  // Fetch projects for current client
  const {
    data: projectsResponse,
    isFetching: isProjectsPending,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: [
      "client-projects",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.client.projects.list({
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
    mutationFn: async (data: CreateProjectRequest) => {
      return await api.client.projects.create(data);
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
      api.client.projects.update(id, data),
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

  const handleCreateSubmit = () => {
    const data = projectStore.createDto;
    createProject({
      name: data.name!,
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
      category: data.category || undefined,
      type: data.type || undefined,
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
          category: data.category || undefined,
          type: data.type || undefined,
        },
      });
    }
  };

  const handleOpenEdit = async (project: Project) => {
    try {
      const { project: projectDetail } = await api.client.projects.getById(
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
  } = useClientProjectCreateSheet({
    createProject: handleCreateSubmit,
    isCreatePending: isCreationPending,
    resetProject: () => projectStore.reset(),
  });

  const {
    updateProjectSheet,
    openUpdateProjectSheet,
    closeUpdateProjectSheet,
  } = useClientProjectUpdateSheet({
    updateProject: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetProject: () => projectStore.reset(),
    project: projectStore.response,
  });

  const context: DataTableConfig<Project> = {
    singularName: "projet",
    pluralName: "projets",
    createCallback: openCreateProjectSheet,
    inspectCallback: (project: Project) => {
      router.push(`/client/projects/${project.id}`);
    },
    updateCallback: handleOpenEdit,
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
        const { project: projectDetail } = await api.client.projects.getById(
          project.id
        );
        projectStore.set("response", projectDetail);
        projectStore.initializeUpdateDto(projectDetail);
      } catch (error: any) {
        console.error("Error fetching project details:", error);
      }
    },
  };

  const columns = useClientProjectColumns(context);

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
      {updateProjectSheet}
    </div>
  );
}

