import { cn } from "@/lib/utils";

type BadgeColors = "red" | "green" | "yellow" | "gray" | "blue" | "purple";

interface StatusBadgeProps {
  color: BadgeColors;
  children: React.ReactNode;
}

export default function StatusBadge({ color, children }: StatusBadgeProps) {
  const colorClasses = {
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-amber-100 text-amber-800",
    gray: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorClasses[color]
      )}
    >
      {children}
    </span>
  );
}
