"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Agent {
  id: string
  name: string
  badge: string
  status: "available" | "busy" | "off-duty"
  specialization: string[]
  lastActive: string
}

const agents: Agent[] = [
  {
    id: "1",
    name: "Alex Mercer",
    badge: "A-7291",
    status: "available",
    specialization: ["Cyber"],
    lastActive: "2 min ago"
  },
  {
    id: "2",
    name: "Sarah Jensen",
    badge: "A-1652",
    status: "busy",
    specialization: ["Physical", "Tactical"],
    lastActive: "5 min ago"
  },
  {
    id: "3",
    name: "David Chen",
    badge: "A-3984",
    status: "available",
    specialization: ["Surveillance"],
    lastActive: "1 min ago"
  },
  {
    id: "4",
    name: "Mira Khan",
    badge: "A-2475",
    status: "busy",
    specialization: ["Cyber", "Infrastructure"],
    lastActive: "15 min ago"
  },
  {
    id: "5",
    name: "Jake Rodriguez",
    badge: "A-9137",
    status: "off-duty",
    specialization: ["Medical"],
    lastActive: "3 hours ago"
  },
  {
    id: "6",
    name: "Elena Volkov",
    badge: "A-5527",
    status: "available",
    specialization: ["Technical", "Tactical"],
    lastActive: "7 min ago"
  }
]

export function ActiveAgents() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500"
      case "busy": return "bg-amber-500"
      case "off-duty": return "bg-slate-500"
      default: return "bg-gray-500"
    }
  }
  
  const getInitials = (name: string) => {
    return name.split(" ").map(part => part[0]).join("")
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>Active Agents</span>
          <Badge variant="outline" className="ml-2">
            {agents.filter(a => a.status !== "off-duty").length} Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {agents.map(agent => (
              <div key={agent.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                <Avatar>
                  <AvatarFallback className="bg-muted">{getInitials(agent.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{agent.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 rounded-full", getStatusColor(agent.status))} />
                      <span className="text-xs text-muted-foreground">{agent.status}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-mono">{agent.badge}</span>
                    <span className="text-xs text-muted-foreground">{agent.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}