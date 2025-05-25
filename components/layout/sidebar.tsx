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
  X,
  MessageCircle,
  Code,
  Github,
  Linkedin,
  Mail
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

  const NameTag = ({ collapsed = false }: { collapsed?: boolean }) => {
    if (collapsed) {
      // Collapsed state - just show avatar with tooltip
      return (
          <div className="group relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:scale-110 transition-all duration-300 shadow-md">
              <Code size={14} className="text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>

            {/* Tooltip on hover */}
            <div className="absolute left-full ml-10 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border">
              <div className="text-sm font-medium">Thimira Navodana</div>
              <div className="text-xs text-muted-foreground">Full Stack Developer</div>
            </div>
          </div>
      );
    }

    // Expanded state - full name tag
    return (
        <div className="space-y-3 items-start flex flex-col">
          {/* Developer info */}
          <div className="group cursor-pointer flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md">
              <Code size={14} className="text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300 truncate">
              Thimira Navodana
            </span>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              Full Stack Developer
            </span>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2 justify-center">
            <a
                href="https://wa.me/+94716337787?text=Hello%20Thimira!"
                target="_blank"
                rel="noopener noreferrer"
                className="group/social w-7 h-7 bg-accent hover:bg-accent/80 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp"
            >
              <MessageCircle size={12} className="text-green-500 group-hover/social:text-green-700 transition-colors duration-300" />
            </a>

            <a
                href="https://github.com/Thimira-N"
                className="group/social w-7 h-7 bg-accent hover:bg-accent/80 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
            >
              <Github size={12} className="text-muted-foreground group-hover/social:text-foreground transition-colors duration-300" />
            </a>

            <a
                href="https://www.linkedin.com/in/itz-thimira"
                className="group/social w-7 h-7 bg-accent hover:bg-accent/80 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
            >
              <Linkedin size={12} className="text-blue-600 group-hover/social:text-blue-800 transition-colors duration-300" />
            </a>

            <a
                href="mailto:thimiranavodana2002@gmail.com"
                className="group/social w-7 h-7 bg-accent hover:bg-accent/80 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Email"
            >
              <Mail size={12} className="text-green-600 group-hover/social:text-green-800 transition-colors duration-300" />
            </a>
          </div>
        </div>
    );
  };

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

        {/* Desktop collapse button and name tag */}
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
                      <span className="mr-2 animate-pulse">⫷</span>
                      <span>Collapse</span>
                    </>
                ) : (
                    <span className='animate-pulse'>⫸</span>
                )}
              </Button>
              {/*<div className='text-xs mt-5'> <span>Developed By : Thimira Navodana</span> </div>*/}
              <div className='items-center justify-center mt-4'>
                <NameTag collapsed={collapsed} />
              </div>
            </div>
        )}

        {/* Mobile name tag */}
        {isMobile && (
            <div className="mt-auto p-4 border-t">
              <NameTag collapsed={false} />
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