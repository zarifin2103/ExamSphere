import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity, Users, BookOpen, Calendar } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({
  title = "Statistic",
  value = "0",
  icon: Icon = Activity,
  description = "Statistical information",
  trend,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden bg-white", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 mt-2">
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500",
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
