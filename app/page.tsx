import { 
  LayoutDashboard,
  ServerCrash,
  Shield,
  UserCheck,
  AlertCircle,
  Users
} from "lucide-react"

import { StatusCard } from "@/components/dashboard/status-card"
import { StatusUpdates } from "@/components/dashboard/status-updates"
import { ThreatLevelChart } from "@/components/dashboard/threat-level-chart"
import { EmergencyStats } from "@/components/dashboard/emergency-stats"
import { ActiveAgents } from "@/components/dashboard/active-agents"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Security Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated: </span>
          <span className="text-sm font-medium">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="System Status"
          value="87%"
          icon={<LayoutDashboard className="h-4 w-4" />}
          status="degraded"
          trend="up"
          trendValue="2% from yesterday"
        />
        <StatusCard
          title="Infrastructure"
          value="5 Offline"
          icon={<ServerCrash className="h-4 w-4" />}
          status="critical"
          trend="down"
          trendValue="3 more than normal"
        />
        <StatusCard
          title="Active Agents"
          value="28/42"
          icon={<Shield className="h-4 w-4" />}
          status="operational"
          trend="stable"
          trendValue="Normal capacity"
        />
        <StatusCard
          title="Processed Citizens"
          value="10,482"
          icon={<UserCheck className="h-4 w-4" />}
          status="operational"
          trend="up"
          trendValue="1,240 in last 24h"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatusUpdates />
        <ThreatLevelChart />
        <ActiveAgents />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <EmergencyStats />
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-2">Critical Zones</h3>
            <div className="relative rounded-md overflow-hidden h-[300px] bg-slate-950/50">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/8051988/pexels-photo-8051988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-30"></div>
              
              <div className="absolute top-10 left-28 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-chart-1/30 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-chart-1 animate-ping"></div>
                </div>
              </div>
              
              <div className="absolute top-40 right-32 animate-pulse delay-300">
                <div className="w-10 h-10 rounded-full bg-destructive/30 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-destructive animate-ping"></div>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-20 animate-pulse delay-700">
                <div className="w-8 h-8 rounded-full bg-chart-5/30 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-chart-5 animate-ping"></div>
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="font-mono text-xs opacity-80">INTERACTIVE MAP LOADING...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}