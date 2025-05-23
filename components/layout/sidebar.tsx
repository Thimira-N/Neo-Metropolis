"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  AlertCircle, 
  HeartPulse, 
  Shield, 
  BadgeAlert,
  BarChart4
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: number
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: "Citizens",
      href: "/citizens",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Criminals",
      href: "/criminals",
      icon: <BadgeAlert className="h-5 w-5" />,
      badge: 12
    },
    {
      title: "Emergency",
      href: "/emergency",
      icon: <AlertCircle className="h-5 w-5" />,
      badge: 5
    },
    {
      title: "Agents",
      href: "/agents",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart4 className="h-5 w-5" />
    }
  ]

  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r bg-card text-card-foreground transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="flex flex-col gap-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors",
              pathname === item.href && "bg-accent/50 text-foreground font-medium border-r-2 border-primary"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="flex-1">{item.title}</span>
            )}
            
            {!collapsed && item.badge && (
              <Badge className="bg-chart-1 hover:bg-chart-1/90">{item.badge}</Badge>
            )}
            
            {collapsed && item.badge && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-chart-1 hover:bg-chart-1/90">
                {item.badge}
              </Badge>
            )}
          </Link>
        ))}
      </div>
      
      <div className="mt-auto p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {!collapsed ? (
            <>
              <span className="mr-2">◀</span>
              <span>Collapse</span>
            </>
          ) : (
            <span>▶</span>
          )}
        </Button>
      </div>
    </aside>
  )
}