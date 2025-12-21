import { DisplayClient } from "@/components/shared/Displays.types";
import { getUserStatus, UserListItem } from "@/types/user-management.types";

type Crumb = { label: string; href?: string };

export const createSearchFilterExpression = (
  structure: Object,
  operator: string,
  value: string,
  seperator: string
): string => {
  return `(${Object.values(structure)
    .map((svalue) => `${svalue}${operator}${value}`)
    .join(seperator)}})`;
};

export const parseBooleanField = (
  field: string | string[] | boolean | undefined
): boolean => {
  if (typeof field === "string") {
    return field === "true";
  }
  if (Array.isArray(field)) {
    return field[0] === "true";
  }
  return false;
};

export const parseIntField = (
  field: string | string[] | number | undefined
): number => {
  if (typeof field === "string") {
    return parseInt(field, 10);
  }
  if (Array.isArray(field)) {
    return parseInt(field[0], 10);
  }
  return 0;
};

export const parseStringField = (
  field: string | string[] | number | undefined
): string => {
  if (typeof field === "string") {
    return field;
  }
  if (Array.isArray(field)) {
    return field[0];
  }
  return "";
};

export const setDeepValue = <T>(obj: any, path: string, value: T): any => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const nested = keys.reduce((acc, key) => {
    if (typeof acc[key] !== "object" || acc[key] === null) {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  if (lastKey) nested[lastKey] = value;
  return obj;
};

export const safeStringify = (obj: any) => {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);
      }
      return value;
    },
    2
  );
};

export const stableStringify = (value: any): string => {
  const seen = new WeakSet();
  const sortKeys = (obj: any): any => {
    if (obj && typeof obj === "object") {
      if (seen.has(obj)) return;
      seen.add(obj);
      if (Array.isArray(obj)) {
        return obj.map(sortKeys);
      }
      const sorted: Record<string, any> = {};
      Object.keys(obj)
        .sort()
        .forEach((k) => {
          sorted[k] = sortKeys(obj[k]);
        });
      return sorted;
    }
    return obj;
  };
  return JSON.stringify(sortKeys(value));
};

export const deepEqual = (a: any, b: any) => {
  return stableStringify(a) === stableStringify(b);
};

export function buildBreadcrumbs(pathname?: string | null): Crumb[] {
  if (!pathname) return [];
  const labelMap: Record<string, string> = {
    admin: "Dashboard",
    clients: "Clients",
    projects: "Projets",
    partners: "Partenaires",
    chantiers: "Chantiers",
    invoices: "Devis & Factures",
    documents: "Documents",
    settings: "Paramètres",
    billing: "Facturation",
    support: "Support",
    tasks: "Tâches",
    messages: "Messages",
  };

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];
  let href = "";

  segments.forEach((segment, index) => {
    href += `/${segment}`;
    const isLast = index === segments.length - 1;
    const isId = /^(\d+|[a-f0-9-]{8,})$/i.test(segment);
    const label =
      labelMap[segment] ??
      (isId ? "Détail" : segment.charAt(0).toUpperCase() + segment.slice(1));
    crumbs.push({ label, href: isLast ? undefined : href });
  });
  return crumbs;
}

export function transformUserToClient(user: UserListItem): DisplayClient {
  const nameParts = user.full_name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    id: user.id,
    name: user.full_name,
    firstName,
    lastName,
    email: user.email,
    phone: user.phone || "",
    projects: user.projects_count || 0,
    status: getUserStatus(user),
    city: user.city || "",
    address: user.address || "",
    role: user.role,
  };
}
