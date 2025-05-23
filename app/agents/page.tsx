"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  UserPlus,
  MapPin,
  Shield
} from "lucide-react"
import { Agent, AgentStatus, EmergencyRequest } from "@/types"
import { formatDistanceToNow } from "date-fns"

// Sample agents data
const sampleAgents: Agent[] = [
  {
    id: "a1",
    name: "Alex Mercer",
    badge: "A-7291",
    status: "available",
    specialization: ["Cyber"],
    assignedRequestIds: [],
    lastActive: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    location: {
      address: "Central Command, Downtown",
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    }
  },
  {
    id: "a2",
    name: "Sarah Jensen",
    badge: "A-1652",
    status: "busy",
    specialization: ["Physical", "Tactical"],
    assignedRequestIds: ["e4"],
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    location: {
      address: "North Sector Patrol",
      coordinates: {
        lat: 40.7282,
        lng: -73.9842
      }
    }
  },
  {
    id: "a3",
    name: "David Chen",
    badge: "A-3984",
    status: "busy",
    specialization: ["Cyber", "Infrastructure"],
    assignedRequestIds: ["e1"],
    lastActive: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    location: {
      address: "Traffic Control Center",
      coordinates: {
        lat: 40.7359,
        lng: -73.9911
      }
    }
  },
  {
    id: "a4",
    name: "Mira Khan",
    badge: "A-2475",
    status: "available",
    specialization: ["Cyber", "Surveillance"],
    assignedRequestIds: [],
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    location: {
      address: "Command Center",
      coordinates: {
        lat: 40.7127,
        lng: -74.0059
      }
    }
  },
  {
    id: "a5",
    name: "Jake Rodriguez",
    badge: "A-9137",
    status: "off-duty",
    specialization: ["Physical", "Medical"],
    assignedRequestIds: [],
    lastActive: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: "a6",
    name: "Elena Volkov",
    badge: "A-5527",
    status: "available",
    specialization: ["Cyber", "Technical"],
    assignedRequestIds: [],
    lastActive: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    location: {
      address: "East Sector HQ",
      coordinates: {
        lat: 40.7234,
        lng: -73.9876
      }
    }
  }
];

// Sample emergency requests for assignments
const assignableRequests: EmergencyRequest[] = [
  {
    id: "e3",
    title: "Hospital System Breach",
    description: "Central Hospital reporting unauthorized access to patient records",
    location: {
      address: "Central Hospital, Medical District",
      coordinates: {
        lat: 40.7359,
        lng: -73.9911
      }
    },
    type: "cyber",
    priority: 1,
    status: "pending",
    reportedTime: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: "e2",
    title: "Power Grid Fluctuations",
    description: "Eastern district reporting power surges and outages",
    location: {
      address: "Eastern Power Substation, East District",
      coordinates: {
        lat: 40.7282,
        lng: -73.9842
      }
    },
    type: "infrastructure",
    priority: 2,
    status: "pending",
    reportedTime: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  }
];

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [agents, setAgents] = useState(sampleAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setAgents(sampleAgents)
      return
    }
    
    const results = sampleAgents.filter(agent => 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.badge.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setAgents(results)
  }
  
  const handleFilterChange = (value: string) => {
    setActiveFilter(value)
    
    if (value === "all") {
      setAgents(sampleAgents)
    } else if (value === "available") {
      setAgents(sampleAgents.filter(agent => agent.status === "available"))
    } else if (value === "busy") {
      setAgents(sampleAgents.filter(agent => agent.status === "busy"))
    } else if (value === "off-duty") {
      setAgents(sampleAgents.filter(agent => agent.status === "off-duty"))
    }
  }
  
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "available": return "bg-green-500/20 text-green-500 border-green-500/50"
      case "busy": return "bg-amber-500/20 text-amber-500 border-amber-500/50"
      case "off-duty": return "bg-slate-500/20 text-slate-500 border-slate-500/50"
      default: return "bg-slate-500/20 text-slate-500 border-slate-500/50"
    }
  }
  
  const getInitials = (name: string) => {
    return name.split(" ").map(part => part[0]).join("")
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Agent Management</h1>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Agent
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agents by name or badge..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button variant="outline" onClick={handleSearch}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={handleFilterChange}>
        <TabsList>
          <TabsTrigger value="all">All Agents ({sampleAgents.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({sampleAgents.filter(a => a.status === "available").length})</TabsTrigger>
          <TabsTrigger value="busy">On Duty ({sampleAgents.filter(a => a.status === "busy").length})</TabsTrigger>
          <TabsTrigger value="off-duty">Off Duty ({sampleAgents.filter(a => a.status === "off-duty").length})</TabsTrigger>
        </TabsList>
        
        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            {agents.map((agent) => (
              <Card 
                key={agent.id} 
                className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedAgent?.id === agent.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedAgent(agent)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-muted">{getInitials(agent.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{agent.name}</p>
                        <Badge variant="outline" className={getStatusColor(agent.status)}>
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-mono">{agent.badge}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(agent.lastActive), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {agent.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="lg:col-span-2">
            {selectedAgent ? (
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback className="bg-muted">{getInitials(selectedAgent.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        {selectedAgent.name}
                        <div className="text-sm font-mono font-normal text-muted-foreground">
                          {selectedAgent.badge}
                        </div>
                      </div>
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(selectedAgent.status)}>
                      {selectedAgent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Specializations</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedAgent.specialization.map((spec) => (
                          <Badge key={spec} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Activity</h3>
                      <p>{new Date(selectedAgent.lastActive).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {selectedAgent.location && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Location</h3>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedAgent.location.address}</span>
                      </div>
                      <div className="relative rounded-md overflow-hidden h-[200px] bg-slate-950/50 mt-3">
                        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2407636/pexels-photo-2407636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-30"></div>
                        
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                          <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-blue-500 animate-ping"></div>
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="font-mono text-xs opacity-80">AGENT LOCATION DATA</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {selectedAgent.assignedRequestIds.length === 0 
                        ? "No Active Assignments" 
                        : "Active Assignments"}
                    </h3>
                    
                    {selectedAgent.assignedRequestIds.length > 0 ? (
                      <div className="space-y-2">
                        {/* In a real app, we would fetch the actual request details */}
                        <Card className="bg-muted">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Emergency Request #{selectedAgent.assignedRequestIds[0]}</p>
                                <p className="text-sm text-muted-foreground">Assigned 25 minutes ago</p>
                              </div>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : selectedAgent.status === "available" ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Available for Assignment</h4>
                        
                        {assignableRequests.map(request => (
                          <Card key={request.id} className="bg-muted">
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{request.title}</p>
                                  <p className="text-sm text-muted-foreground">Priority {request.priority} • {request.type}</p>
                                </div>
                                <Button size="sm">
                                  <Shield className="mr-2 h-3 w-3" />
                                  Assign
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Agent is currently {selectedAgent.status}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button variant="outline">View Full Profile</Button>
                    <div className="space-x-2">
                      <Button variant="outline">Message</Button>
                      <Button>Update Status</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
                  <Shield className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-center text-lg">Select an agent to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}