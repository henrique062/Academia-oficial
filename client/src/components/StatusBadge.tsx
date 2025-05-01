import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  children: React.ReactNode;
  color?: "green" | "yellow" | "red" | "gray" | "blue" | "purple";
  className?: string;
}

export default function StatusBadge({ children, color = "gray", className }: StatusBadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  const colorClasses = {
    green: "badge-success",
    yellow: "badge-warning",
    red: "badge-error",
    gray: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800"
  };

  return (
    <span className={cn(baseClasses, colorClasses[color], className)}>
      {children}
    </span>
  );
}
