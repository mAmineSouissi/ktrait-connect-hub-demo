import { create } from "zustand";
import { setDeepValue } from "@/lib/object.lib";
import type {
  CreatePartnerRequest,
  UpdatePartnerRequest,
} from "@/api/admin/partners";
import type { PartnerWithDetails } from "@/types/partner.types";

interface PartnerStoreData {
  // Response data
  response?: PartnerWithDetails;

  // Form DTOs
  createDto: CreatePartnerRequest;
  updateDto: UpdatePartnerRequest;

  // Validation errors
  createDtoErrors: Record<string, string>;
  updateDtoErrors: Record<string, string>;
}

const initialState: PartnerStoreData = {
  response: undefined,
  createDto: {
    email: "",
    password: "",
    full_name: "",
    name: "",
    type: "architecte",
    contact_person: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    status: "Actif",
    since_date: "",
    notes: "",
  },
  updateDto: {
    name: "",
    type: undefined,
    contact_person: null,
    email: null,
    phone: null,
    address: null,
    city: null,
    postal_code: null,
    status: "Actif",
    since_date: null,
    notes: null,
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface PartnerStore extends PartnerStoreData {
  // Basic setters
  set: <T>(name: keyof PartnerStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;

  // Initialize update DTO from partner data
  initializeUpdateDto: (partner: PartnerWithDetails) => void;

  // Helper methods
  setCreateField: <K extends keyof CreatePartnerRequest>(
    field: K,
    value: CreatePartnerRequest[K]
  ) => void;
  setUpdateField: <K extends keyof UpdatePartnerRequest>(
    field: K,
    value: UpdatePartnerRequest[K]
  ) => void;
}

export const usePartnerStore = create<PartnerStore>((set, get) => ({
  ...initialState,

  set: (name, value) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },

  setNested: (path, value) => {
    const [rootKey, ...restPath] = path.split(".");
    const nestedPath = restPath.join(".");
    set((state) => {
      const updatedRoot = setDeepValue(
        { ...(state[rootKey as keyof PartnerStoreData] as object) },
        nestedPath,
        value
      );
      return {
        ...state,
        [rootKey]: updatedRoot,
      };
    });
  },

  setCreateField: (field, value) => {
    set((state) => ({
      ...state,
      createDto: {
        ...state.createDto,
        [field]: value,
      },
    }));
  },

  setUpdateField: (field, value) => {
    set((state) => ({
      ...state,
      updateDto: {
        ...state.updateDto,
        [field]: value,
      },
    }));
  },

  initializeUpdateDto: (partner: PartnerWithDetails) => {
    set({
      response: partner,
      updateDto: {
        name: partner.name,
        type: partner.type,
        contact_person: partner.contact_person || null,
        email: partner.email || null,
        phone: partner.phone || null,
        address: partner.address || null,
        city: partner.city || null,
        postal_code: partner.postal_code || null,
        status: partner.status,
        since_date: partner.since_date || null,
        notes: partner.notes || null,
      },
      updateDtoErrors: {},
    });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
