import { create } from "zustand";
import { setDeepValue } from "@/lib/object.lib";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/api/admin/projects";
import type { Project } from "@/types/project.types";
import type { ProjectCategoryType } from "@/types/enums/project-category.enum";
import type { ProjectTypeType } from "@/types/enums/project-type.enum";

interface ProjectStoreData {
  response?: Project;
  createDto: CreateProjectRequest;
  updateDto: UpdateProjectRequest;
  createDtoErrors: Record<string, string>;
  updateDtoErrors: Record<string, string>;
}

const initialState: ProjectStoreData = {
  response: undefined,
  createDto: {
    client_id: "",
    name: "",
    description: "",
    status: "planifié",
    estimated_budget: undefined,
    start_date: undefined,
    end_date: undefined,
    address: undefined,
    category: undefined,
    type: undefined,
  },
  updateDto: {
    name: undefined,
    description: undefined,
    status: undefined,
    estimated_budget: undefined,
    start_date: undefined,
    end_date: undefined,
    address: undefined,
    progress: undefined,
    category: undefined,
    type: undefined,
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface ProjectStore extends ProjectStoreData {
  set: <T>(name: keyof ProjectStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
  initializeUpdateDto: (project: Project) => void;
  setCreateField: <K extends keyof CreateProjectRequest>(
    field: K,
    value: CreateProjectRequest[K]
  ) => void;
  setUpdateField: <K extends keyof UpdateProjectRequest>(
    field: K,
    value: UpdateProjectRequest[K]
  ) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  ...initialState,
  set: (name, value) => {
    set({ [name]: value });
  },
  setNested: (path, value) => {
    const current = get();
    const updated = { ...current };
    setDeepValue(updated, path, value);
    set(updated);
  },
  setCreateField: (field, value) => {
    set((state) => ({
      createDto: { ...state.createDto, [field]: value },
      createDtoErrors: { ...state.createDtoErrors, [field]: "" },
    }));
  },
  setUpdateField: (field, value) => {
    set((state) => ({
      updateDto: { ...state.updateDto, [field]: value },
      updateDtoErrors: { ...state.updateDtoErrors, [field]: "" },
    }));
  },
  initializeUpdateDto: (project: Project) => {
    set({
      updateDto: {
        name: project.name,
        description: project.description || undefined,
        status: project.status,
        estimated_budget: project.estimated_budget || undefined,
        start_date: project.start_date || undefined,
        end_date: project.end_date || undefined,
        address: project.address || undefined,
        progress: project.progress,
        category: (project as any).category || undefined,
        type: (project as any).type || undefined,
      },
      updateDtoErrors: {},
    });
  },
  reset: () => {
    set(initialState);
  },
}));
