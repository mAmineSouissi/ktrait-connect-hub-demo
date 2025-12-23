/**
 * Project Type Enum
 * Types of projects: Construction, Renovation, Design, Development, Conception
 */
export enum ProjectType {
  CONSTRUCTION = "construction",
  RENOVATION = "renovation",
  DESIGN = "design",
  AMENAGEMENT = "amenagement",
  CONCEPTION = "conception",
}

export type ProjectTypeType =
  | ProjectType.CONSTRUCTION
  | ProjectType.RENOVATION
  | ProjectType.DESIGN
  | ProjectType.AMENAGEMENT
  | ProjectType.CONCEPTION;

export const PROJECT_TYPE_LABELS: Record<ProjectTypeType, string> = {
  [ProjectType.CONSTRUCTION]: "Construction",
  [ProjectType.RENOVATION]: "Rénovation",
  [ProjectType.DESIGN]: "Design",
  [ProjectType.AMENAGEMENT]: "Aménagement",
  [ProjectType.CONCEPTION]: "Conception",
};

