"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { usePartnerProjectColumns } from "./columns/usePartnerProjectColumns";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/api";
import type { PartnerProject } from "@/api/partner/projects";

export default function PartnerProjects() {
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

  // Debounce values
  const { value: debouncedPage } = useDebounce(page, 300);
  const { value: debouncedSize } = useDebounce(size, 300);
  const { value: debouncedSearchTerm } = useDebounce(searchTerm, 500);
  const { value: debouncedSortDetails } = useDebounce(sortDetails, 300);

  const offset = (debouncedPage - 1) * debouncedSize;

  // Fetch projects
  const {
    data: projectsResponse,
    isFetching: isProjectsPending,
  } = useQuery({
    queryKey: [
      "partner-projects",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.partner.projects.list({
        search: debouncedSearchTerm || undefined,
        limit: debouncedSize,
        offset,
        sortKey: debouncedSortDetails.sortKey,
        order: debouncedSortDetails.order ? "desc" : "asc",
      }),
  });

  const projects = React.useMemo(() => {
    return projectsResponse?.projects || [];
  }, [projectsResponse]);

  const totalPageCount = React.useMemo(() => {
    if (!projectsResponse) return 0;
    return Math.ceil((projectsResponse.total || 0) / debouncedSize);
  }, [projectsResponse, debouncedSize]);

  // Data table context (read-only for partners)
  const context: DataTableConfig<PartnerProject> = {
    singularName: "projet",
    pluralName: "projets",
    createCallback: undefined, // Partners can't create projects
    updateCallback: undefined, // Partners can't update projects
    deleteCallback: undefined, // Partners can't delete projects
    searchTerm: debouncedSearchTerm,
    setSearchTerm: setSearchTerm,
    page: debouncedPage,
    totalPageCount,
    setPage,
    size: debouncedSize,
    setSize,
    order: debouncedSortDetails.order,
    sortKey: debouncedSortDetails.sortKey,
    setSortDetails: (order, sortKey) => setSortDetails({ order, sortKey }),
    targetEntity: (project) => {
      // Handle project selection if needed
    },
  };

  const columns = usePartnerProjectColumns(context);

  return (
    <div className="space-y-6">
      <DataTable
        data={projects}
        columns={columns}
        context={context}
        isPending={isProjectsPending}
      />
    </div>
  );
}

