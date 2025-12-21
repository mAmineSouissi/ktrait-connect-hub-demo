import { create } from "zustand";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserDetail,
} from "@/types/user-management.types";
import { setDeepValue } from "@/lib/object.lib";

interface UserStoreData {
  // Response data
  response?: UserDetail;

  // Form DTOs
  createDto: CreateUserRequest;
  updateDto: UpdateUserRequest;

  // Password management
  setManualPassword: boolean;
  confirmPassword?: string;

  // Validation errors
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

const initialState: UserStoreData = {
  response: undefined,
  createDto: {
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "client",
    is_active: true,
    // Client fields
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
    role: "client" as const,
    is_active: true,
    email_verified: false,
    approval_status: "pending" as const,
    rejection_reason: null,
    // Client fields
    city: "",
    address: "",
    postal_code: "",
    company_name: "",
    tax_id: "",
  },
  setManualPassword: false,
  confirmPassword: "",
  createDtoErrors: {},
  updateDtoErrors: {},
};

export interface UserStore extends UserStoreData {
  // Basic setters
  set: <T>(name: keyof UserStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;

  // Initialize update DTO from user data
  initializeUpdateDto: (user: UserDetail) => void;

  // Helper methods
  setCreateField: <K extends keyof CreateUserRequest>(
    field: K,
    value: CreateUserRequest[K]
  ) => void;
  setUpdateField: <K extends keyof UpdateUserRequest>(
    field: K,
    value: UpdateUserRequest[K]
  ) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
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
        { ...(state[rootKey as keyof UserStoreData] as object) },
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

  initializeUpdateDto: (user: UserDetail) => {
    set({
      response: user,
      updateDto: {
        full_name: user.full_name,
        phone: user.phone || "",
        email: user.email,
        role: user.role,
        city: user.city || "",
        address: user.address || "",
        postal_code: user.postal_code || "",
        company_name: user.company_name || "",
        tax_id: user.tax_id || "",
        is_active: user.is_active,
        email_verified: user.email_verified,
        approval_status: (user.approval_status || "pending") as
          | "pending"
          | "approved"
          | "rejected",
        rejection_reason: user.rejection_reason || null,
      },
      updateDtoErrors: {},
    });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
