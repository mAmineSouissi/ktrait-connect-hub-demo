import { create } from "zustand";
import { setDeepValue } from "@/lib/object.lib";
import type {
  CreateClientRequest,
  UpdateClientRequest,
  ClientDetail,
} from "@/types/client.types";

interface ClientStoreData {
  // Response data
  response?: ClientDetail;

  // Form DTOs
  createDto: CreateClientRequest;
  updateDto: UpdateClientRequest;

  // Validation errors
  createDtoErrors: Record<string, string>;
  updateDtoErrors: Record<string, string>;
}

const initialState: ClientStoreData = {
  response: undefined,
  createDto: {
    email: "",
    password: "",
    full_name: "",
    phone: "",
    is_active: true,
    city: "",
    address: "",
    postal_code: "",
    company_name: "",
    tax_id: "",
  },
  updateDto: {
    full_name: "",
    phone: "",
    email: "",
    is_active: true,
    email_verified: false,
    city: "",
    address: "",
    postal_code: "",
    company_name: "",
    tax_id: "",
  },
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface ClientStore extends ClientStoreData {
  // Basic setters
  set: <T>(name: keyof ClientStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;

  // Initialize update DTO from client data
  initializeUpdateDto: (client: ClientDetail) => void;

  // Helper methods
  setCreateField: <K extends keyof CreateClientRequest>(
    field: K,
    value: CreateClientRequest[K]
  ) => void;
  setUpdateField: <K extends keyof UpdateClientRequest>(
    field: K,
    value: UpdateClientRequest[K]
  ) => void;
}

export const useClientStore = create<ClientStore>((set, get) => ({
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
        { ...(state[rootKey as keyof ClientStoreData] as object) },
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

  initializeUpdateDto: (client: ClientDetail) => {
    set({
      response: client,
      updateDto: {
        full_name: client.full_name,
        phone: client.phone || "",
        email: client.email,
        is_active: client.is_active,
        email_verified: client.email_verified,
        city: client.city || "",
        address: client.address || "",
        postal_code: client.postal_code || "",
        company_name: client.company_name || "",
        tax_id: client.tax_id || "",
      },
      updateDtoErrors: {},
    });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
