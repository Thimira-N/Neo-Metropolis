"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  AlertCircle,
  HeartPulse,
  Shield,
  BadgeAlert,
  BarChart4,
  Menu,
  X
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
  const [mobileOpen, setMobileOpen] = useState(false)

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
      <>
        <div className="flex flex-col gap-2 py-4">
          {navItems.map((item) => (
              <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors relative",
                      pathname === item.href && "bg-accent/50 text-foreground font-medium border-r-2 border-primary",
                      isMobile && "py-3"
                  )}
                  onClick={() => isMobile && setMobileOpen(false)}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {(!collapsed || isMobile) && (
                    <span className="flex-1">{item.title}</span>
                )}

                {(!collapsed || isMobile) && item.badge && (
                    <Badge className="bg-chart-1 hover:bg-chart-1/90">{item.badge}</Badge>
                )}

                {collapsed && !isMobile && item.badge && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-chart-1 hover:bg-chart-1/90">
                      {item.badge}
                    </Badge>
                )}
              </Link>
          ))}
        </div>

        {!isMobile && (
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
        )}
      </>
  )

  return (
      <>
        {/* Mobile Menu Button */}
        <Button
            variant="ghost"
            size="sm"
            className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border"
            onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Overlay */}
        {mobileOpen && (
            <div
                className="md:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileOpen(false)}
            />
        )}

        {/* Mobile Sidebar */}
        <aside className={cn(
            "md:hidden fixed left-0 top-0 h-full w-[280px] bg-card text-card-foreground border-r z-50 transform transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full pt-16">
            <SidebarContent isMobile={true} />
          </div>
        </aside>

        {/* Desktop Sidebar */}
        <aside className={cn(
            "hidden md:flex flex-col border-r bg-card text-card-foreground transition-all duration-300",
            collapsed ? "w-[70px]" : "w-[240px]"
        )}>
          <SidebarContent />
        </aside>
      </>
  )
}