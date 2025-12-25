import { Crumb } from "./object.lib";

export interface PageMetadata {
  breadcrumbs?: Crumb[];
  title: string;
  description?: string;
}

type RoutePattern = string | RegExp;

interface RouteMetadataConfig {
  pattern: RoutePattern;
  metadata: PageMetadata | ((params: Record<string, string>) => PageMetadata);
}

// Page metadata configuration
// Routes are matched in order, first match wins
export const pageMetadataConfig: RouteMetadataConfig[] = [
  // Admin routes
  {
    pattern: /^\/admin\/clients\/[^/]+$/,
    metadata: (params) => ({
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Clients", href: "/admin/clients" },
        { label: "Détail", href: undefined },
      ],
      title: "Détails du client",
      description: "Consultez et gérez les informations détaillées du client",
    }),
  },
  {
    pattern: /^\/admin\/clients$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Clients", href: undefined },
      ],
      title: "Clients",
      description: "Gérez tous vos clients et leurs informations",
    },
  },
  {
    pattern: /^\/admin\/projects\/[^/]+$/,
    metadata: (params) => ({
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Projets", href: "/admin/projects" },
        { label: "Détail", href: undefined },
      ],
      title: "Détails du projet",
      description: "Consultez et gérez les informations détaillées du projet",
    }),
  },
  {
    pattern: /^\/admin\/projects$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Projets", href: undefined },
      ],
      title: "Projets",
      description: "Gérez tous vos projets et leur progression",
    },
  },
  {
    pattern: /^\/admin\/partners\/[^/]+$/,
    metadata: (params) => ({
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Partenaires", href: "/admin/partners" },
        { label: "Détail", href: undefined },
      ],
      title: "Détails du partenaire",
      description:
        "Consultez et gérez les informations détaillées du partenaire",
    }),
  },
  {
    pattern: /^\/admin\/partners$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Partenaires", href: undefined },
      ],
      title: "Partenaires",
      description: "Gérez tous vos partenaires et leurs collaborations",
    },
  },
  {
    pattern: /^\/admin\/chantiers\/[^/]+$/,
    metadata: (params) => ({
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Chantiers", href: "/admin/chantiers" },
        { label: "Détail", href: undefined },
      ],
      title: "Détails du chantier",
      description: "Consultez et gérez les informations détaillées du chantier",
    }),
  },
  {
    pattern: /^\/admin\/chantiers$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Chantiers", href: undefined },
      ],
      title: "Chantiers",
      description: "Gérez tous vos chantiers et leur avancement",
    },
  },
  {
    pattern: /^\/admin\/invoices\/[^/]+$/,
    metadata: (params) => ({
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Devis & Factures", href: "/admin/invoices" },
        { label: "Détail", href: undefined },
      ],
      title: "Détails de la facture",
      description: "Consultez et gérez les détails de la facture",
    }),
  },
  {
    pattern: /^\/admin\/invoices$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Devis & Factures", href: undefined },
      ],
      title: "Devis & Factures",
      description: "Gérez tous vos devis et factures",
    },
  },
  {
    pattern: /^\/admin\/documents$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Documents", href: undefined },
      ],
      title: "Documents",
      description: "Gérez tous vos documents et fichiers",
    },
  },
  {
    pattern: /^\/admin\/settings$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/admin" },
        { label: "Paramètres", href: undefined },
      ],
      title: "Paramètres",
      description: "Configurez les paramètres de l'application",
    },
  },
  {
    pattern: /^\/admin$/,
    metadata: {
      breadcrumbs: [{ label: "Dashboard", href: undefined }],
      title: "Dashboard",
      description: "Vue d'ensemble de votre activité",
    },
  },
  // Client routes
  {
    pattern: /^\/client\/projects\/[^/]+$/,
    metadata: (params) => ({
      breadcrumbs: [
        { label: "Dashboard", href: "/client" },
        { label: "Projets", href: "/client/projects" },
        { label: "Détail", href: undefined },
      ],
      title: "Détails du projet",
      description: "Consultez les détails de votre projet",
    }),
  },
  {
    pattern: /^\/client\/projects$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/client" },
        { label: "Projets", href: undefined },
      ],
      title: "Mes projets",
      description: "Consultez tous vos projets",
    },
  },
  {
    pattern: /^\/client\/invoices\/[^/]+$/,
    metadata: (params) => ({
      breadcrumbs: [
        { label: "Dashboard", href: "/client" },
        { label: "Devis & Factures", href: "/client/invoices" },
        { label: "Détail", href: undefined },
      ],
      title: "Détails de la facture",
      description: "Consultez les détails de votre facture ou devis",
    }),
  },
  {
    pattern: /^\/client\/invoices$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/client" },
        { label: "Devis & Factures", href: undefined },
      ],
      title: "Devis & Factures",
      description: "Consultez tous vos devis et factures",
    },
  },
  {
    pattern: /^\/client\/documents$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/client" },
        { label: "Documents", href: undefined },
      ],
      title: "Mes documents",
      description: "Gérez tous vos documents et fichiers",
    },
  },
  {
    pattern: /^\/client\/settings$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/client" },
        { label: "Paramètres", href: undefined },
      ],
      title: "Paramètres",
      description: "Gérez vos préférences et votre profil",
    },
  },
  {
    pattern: /^\/client$/,
    metadata: {
      breadcrumbs: [{ label: "Dashboard", href: undefined }],
      title: "Dashboard",
      description: "Vue d'ensemble de vos projets",
    },
  },
  // Partner routes
  {
    pattern: /^\/partner\/projects\/[^/]+$/,
    metadata: (params) => ({
      breadcrumbs: [
        { label: "Dashboard", href: "/partner" },
        { label: "Projets", href: "/partner/projects" },
        { label: "Détail", href: undefined },
      ],
      title: "Détails du projet",
      description: "Consultez les détails du projet",
    }),
  },
  {
    pattern: /^\/partner\/projects$/,
    metadata: {
      breadcrumbs: [
        { label: "Dashboard", href: "/partner" },
        { label: "Projets", href: undefined },
      ],
      title: "Projets",
      description: "Consultez tous les projets qui vous sont assignés",
    },
  },
  {
    pattern: /^\/partner$/,
    metadata: {
      breadcrumbs: [{ label: "Dashboard", href: undefined }],
      title: "Dashboard",
      description: "Vue d'ensemble de vos projets",
    },
  },
];

/**
 * Get page metadata for a given route
 * @param pathname - The current pathname
 * @param routeParams - Optional route parameters (e.g., { id: "123" })
 * @returns PageMetadata or null if no match found
 */
export function getPageMetadata(
  pathname: string,
  routeParams?: Record<string, string>
): PageMetadata | null {
  // Normalize pathname (remove query params and hash)
  const normalizedPath = pathname.split("?")[0].split("#")[0];

  // Try to find matching route
  for (const config of pageMetadataConfig) {
    let matches = false;
    let params: Record<string, string> = {};

    if (typeof config.pattern === "string") {
      // Exact string match
      matches = config.pattern === normalizedPath;
    } else {
      // Regex match
      const match = normalizedPath.match(config.pattern);
      if (match) {
        matches = true;
        // Extract named groups or use provided params
        if (routeParams) {
          params = routeParams;
        } else if (match.groups) {
          params = match.groups;
        }
      }
    }

    if (matches) {
      // Get metadata (function or object)
      if (typeof config.metadata === "function") {
        return config.metadata(params);
      }
      return config.metadata;
    }
  }

  // Fallback: build breadcrumbs from pathname
  const segments = normalizedPath.split("/").filter(Boolean);
  if (segments.length === 0) {
    return {
      breadcrumbs: [{ label: "Accueil", href: undefined }],
      title: "Accueil",
      description: "Page d'accueil",
    };
  }

  // Build default breadcrumbs
  const breadcrumbs: Crumb[] = [];
  let href = "";
  const labelMap: Record<string, string> = {
    admin: "Dashboard",
    clients: "Clients",
    projects: "Projets",
    partners: "Partenaires",
    chantiers: "Chantiers",
    invoices: "Devis & Factures",
    documents: "Documents",
    settings: "Paramètres",
    client: "Dashboard",
    partner: "Dashboard",
  };

  segments.forEach((segment, index) => {
    href += `/${segment}`;
    const isLast = index === segments.length - 1;
    const isId = /^(\d+|[a-f0-9-]{8,})$/i.test(segment);
    const label =
      labelMap[segment] ??
      (isId ? "Détail" : segment.charAt(0).toUpperCase() + segment.slice(1));
    breadcrumbs.push({ label, href: isLast ? undefined : href });
  });

  const lastSegment = segments[segments.length - 1];
  const title =
    labelMap[lastSegment] ||
    lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  return {
    breadcrumbs,
    title,
    description: `Page ${title}`,
  };
}
