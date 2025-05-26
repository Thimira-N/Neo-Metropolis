"use client"

import { useState, useEffect } from 'react'
import { MoonStar, Sun, Bell, Shield, } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationsSidebar } from './notificationsSidebar'
// import { cn } from '@/lib/utils'

export function Header() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
      <>
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <div className="flex items-center mr-4">
              <Shield className="h-6 w-6 text-primary mr-2 max-sm:ml-12" />
              <span className="font-mono font-bold text-lg hidden md:inline-block">NeoMetropolis</span>
              <span className="font-mono text-xs text-primary ml-1 hidden lg:inline-block">CSRS</span>
            </div>

            {/*<Button */}
            {/*  variant="ghost" */}
            {/*  size="icon" */}
            {/*  className="md:hidden mr-2" */}
            {/*  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}*/}
            {/*>*/}
            {/*  <Menu className="h-5 w-5" />*/}
            {/*</Button>*/}

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <Button
                  variant="outline"
                  size="icon"
                  className="relative"
                  onClick={() => setNotificationsOpen(true)}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-1 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-chart-1"></span>
            </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    {theme === "dark" ? (
                        <MoonStar className="h-4 w-4" />
                    ) : (
                        <Sun className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Notifications Sidebar */}
        <NotificationsSidebar
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
        />
      </>
  )
}