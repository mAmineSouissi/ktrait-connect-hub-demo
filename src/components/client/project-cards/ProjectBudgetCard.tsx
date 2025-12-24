import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBudget } from "@/lib/currency.util";
import { Progress } from "@/components/ui/progress";
import { ProjectWithDetails } from "@/types/project.types";
import { cn } from "@/lib/utils";

interface ProjectBudgetCardProps {
  className?: string;
  project: ProjectWithDetails;
  spentAmount: number;
  remaining: number;
  budgetProgress: number;
}

export const ProjectBudgetCard = ({
  className,
  project,
  spentAmount,
  remaining,
  budgetProgress,
}: ProjectBudgetCardProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Budget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">
            {formatBudget(project.estimated_budget)}
          </p>
          <p className="text-sm text-muted-foreground">Budget total</p>
        </div>
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payé</span>
            <span className="font-medium">{formatBudget(spentAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Restant</span>
            <span
              className={`font-medium ${
                remaining >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatBudget(remaining)}
            </span>
          </div>
        </div>
        <Progress value={budgetProgress} className="h-2" />
      </CardContent>
    </Card>
  );
};

