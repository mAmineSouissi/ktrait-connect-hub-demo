import { ProjectDetailsCard } from "./ProjectDetailsCard";
import { ProjectBudgetCard } from "./ProjectBudgetCard";
import { ProjectWithDetails } from "@/types/project.types";
import { cn } from "@/lib/utils";

interface BasicProjectDetailsProps {
  className?: string;
  project: ProjectWithDetails;
  spentAmount: number;
  remaining: number;
  budgetProgress: number;
}

export const BasicProjectDetails = ({
  className,
  project,
  spentAmount,
  remaining,
  budgetProgress,
}: BasicProjectDetailsProps) => {
  return (
    <div className={cn("grid lg:grid-cols-3 gap-6", className)}>
      <ProjectDetailsCard project={project} partners={project.partners || []} />
      <ProjectBudgetCard
        project={project}
        spentAmount={spentAmount}
        remaining={remaining}
        budgetProgress={budgetProgress}
      />
    </div>
  );
};
