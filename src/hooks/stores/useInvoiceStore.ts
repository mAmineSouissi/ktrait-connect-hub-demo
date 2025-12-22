import { create } from "zustand";
import type {
  Invoice,
  InvoiceWithDetails,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
} from "@/types/invoice.types";

interface InvoiceStore {
  // Response data
  response: InvoiceWithDetails | null;

  // Create DTO
  createDto: CreateInvoiceRequest;
  createDtoErrors: Record<string, string>;

  // Update DTO
  updateDto: UpdateInvoiceRequest;
  updateDtoErrors: Record<string, string>;

  // Actions
  set: <K extends keyof InvoiceStore>(key: K, value: InvoiceStore[K]) => void;
  reset: () => void;
  initializeCreateDto: () => void;
  initializeUpdateDto: (invoice: InvoiceWithDetails) => void;
}

const initialCreateDto: CreateInvoiceRequest = {
  type: "devis",
  client_id: "",
  project_id: null,
  template_id: null,
  issue_date: new Date().toISOString().split("T")[0],
  due_date: null,
  tax_rate: 20.0,
  notes: null,
  terms: null,
  reference: null,
  items: [
    {
      description: "",
      quantity: 1,
      unit_price: 0,
      unit: "unité",
      tax_rate: null,
    },
  ],
};

const initialUpdateDto: UpdateInvoiceRequest = {};

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  // Initial state
  response: null,
  createDto: initialCreateDto,
  createDtoErrors: {},
  updateDto: initialUpdateDto,
  updateDtoErrors: {},

  // Actions
  set: (key, value) => set({ [key]: value }),

  reset: () =>
    set({
      response: null,
      createDto: initialCreateDto,
      createDtoErrors: {},
      updateDto: initialUpdateDto,
      updateDtoErrors: {},
    }),

  initializeCreateDto: () =>
    set({
      createDto: initialCreateDto,
      createDtoErrors: {},
    }),

  initializeUpdateDto: (invoice: InvoiceWithDetails) =>
    set({
      updateDto: {
        client_id: invoice.client_id,
        project_id: invoice.project_id || null,
        template_id: invoice.template_id || null,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date || null,
        status: invoice.status,
        tax_rate: invoice.tax_rate,
        notes: invoice.notes || null,
        terms: invoice.terms || null,
        reference: invoice.reference || null,
        items: invoice.items.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          unit: item.unit || null,
          tax_rate: item.tax_rate || null,
        })),
      },
      updateDtoErrors: {},
    }),
}));
