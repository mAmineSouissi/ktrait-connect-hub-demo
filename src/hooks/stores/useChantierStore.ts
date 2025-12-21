import { create } from "zustand";
import { setDeepValue } from "@/lib/object.lib";
import type {
  CreateChantierRequest,
  UpdateChantierRequest,
} from "@/types/chantier.types";
import type { ChantierWithCounts } from "@/types/chantier.types";

interface ChantierStoreData {
  response?: ChantierWithCounts;
  createDto: CreateChantierRequest;
  updateDto: UpdateChantierRequest;
  createDtoErrors: Record<string, string>;
  updateDtoErrors: Record<string, string>;
}

const initialState: ChantierStoreData = {
  response: undefined,
  createDto: {
    project_id: "",
    name: "",
    location: "",
    description: "",
    status: "planifié",
    progress: 0,
    start_date: undefined,
    end_date: undefined,
  },
  updateDto: {
    project_id: undefined,
    name: undefined,
    location: undefined,
    description: undefined,
    status: undefined,
    progress: undefined,
    start_date: undefined,
    end_date: undefined,
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface ChantierStore extends ChantierStoreData {
  set: <T>(name: keyof ChantierStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
  initializeUpdateDto: (chantier: ChantierWithCounts) => void;
  setCreateField: <K extends keyof CreateChantierRequest>(
    field: K,
    value: CreateChantierRequest[K]
  ) => void;
  setUpdateField: <K extends keyof UpdateChantierRequest>(
    field: K,
    value: UpdateChantierRequest[K]
  ) => void;
}

export const useChantierStore = create<ChantierStore>((set, get) => ({
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
  initializeUpdateDto: (chantier: ChantierWithCounts) => {
    set({
      updateDto: {
        project_id: chantier.project_id,
        name: chantier.name,
        location: chantier.location,
        description: chantier.description || undefined,
        status: chantier.status,
        progress: chantier.progress,
        start_date: chantier.start_date || undefined,
        end_date: chantier.end_date || undefined,
      },
      updateDtoErrors: {},
    });
  },
  reset: () => {
    set(initialState);
  },
}));
