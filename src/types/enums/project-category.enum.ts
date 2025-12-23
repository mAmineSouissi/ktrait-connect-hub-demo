/**
 * Project Category Enum
 * Categories for projects: Industrial, Institutional, Commercial
 */
export enum ProjectCategory {
  INDUSTRIEL = "industriel",
  INSTITUTIONNEL = "institutionnel",
  COMMERCIAL = "commercial",
}

export type ProjectCategoryType =
  | ProjectCategory.INDUSTRIEL
  | ProjectCategory.INSTITUTIONNEL
  | ProjectCategory.COMMERCIAL;

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategoryType, string> = {
  [ProjectCategory.INDUSTRIEL]: "Industriel",
  [ProjectCategory.INSTITUTIONNEL]: "Institutionnel",
  [ProjectCategory.COMMERCIAL]: "Commercial",
};

