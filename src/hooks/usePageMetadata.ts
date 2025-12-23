import { useRouter } from "next/router";
import { useMemo } from "react";
import { getPageMetadata, PageMetadata } from "@/lib/page-metadata";

/**
 * Hook to get page metadata (breadcrumbs, title, description) based on current route
 * @param override - Optional metadata override
 * @returns PageMetadata object
 */
export function usePageMetadata(
  override?: Partial<PageMetadata>
): PageMetadata {
  const router = useRouter();
  // Use asPath to get the actual pathname (not the route pattern)
  // Remove query string and hash if present
  const pathname = router.asPath?.split("?")[0].split("#")[0] || router.pathname;
  const metadata = useMemo(() => {
    const safePathname = pathname ?? "/";

    // Extract route params from router.query
    const routeParams: Record<string, string> = {};
    if (router.query) {
      Object.entries(router.query).forEach(([key, value]) => {
        if (typeof value === "string") {
          routeParams[key] = value;
        } else if (Array.isArray(value) && value[0]) {
          routeParams[key] = value[0];
        }
      });
    }

    // Also try to extract ID from pathname segments as fallback
    const pathSegments = safePathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment && /^(\d+|[a-f0-9-]{8,})$/i.test(lastSegment) && !routeParams.id) {
      routeParams.id = lastSegment;
    }

    const baseMetadata = getPageMetadata(safePathname, routeParams);
    if (!baseMetadata) {
      return {
        breadcrumbs: [{ label: "Accueil", href: undefined }],
        title: "Page",
        description: "",
      };
    }
    if (override) {
      return {
        ...baseMetadata,
        ...override,
        breadcrumbs: override.breadcrumbs ?? baseMetadata.breadcrumbs,
      };
    }
    return baseMetadata;
  }, [pathname, router.query, override]);
  return metadata;
}
