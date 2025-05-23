"use client"

import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

interface StatusCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  status: "operational" | "degraded" | "offline" | "critical" | "normal"
  trend?: "up" | "down" | "stable"
  trendValue?: string
  className?: string
}

const statusVariants = cva("absolute top-0 right-0 h-2 w-2 rounded-full transition-colors animate-pulse", {
  variants: {
    status: {
      operational: "bg-green-500",
      normal: "bg-green-500",
      degraded: "bg-amber-500",
      offline: "bg-red-500",
      critical: "bg-red-500",
    }
  },
  defaultVariants: {
    status: "normal"
  }
})

export function StatusCard({
  title,
  value,
  icon,
  status,
  trend,
  trendValue,
  className
}: StatusCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <span className={statusVariants({ status })} />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono">{value}</div>
      </CardContent>
      {trend && (
        <CardFooter className="pt-0 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {trend === "up" && <span className="text-green-500">↑</span>}
            {trend === "down" && <span className="text-red-500">↓</span>}
            {trend === "stable" && <span className="text-muted-foreground">→</span>}
            <span>{trendValue}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}