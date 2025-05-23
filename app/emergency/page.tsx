"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertCircle, 
  ArrowUp, 
  ArrowDown, 
  Clock,
  MapPin,
  UserCircle
} from "lucide-react"
import { EmergencyRequest, EmergencyType, EmergencyStatus } from "@/types"
import { PriorityQueue } from "@/lib/data-structures/PriorityQueue"
import { formatDistanceToNow } from "date-fns"

// Sample emergency requests
const sampleRequests: EmergencyRequest[] = [
  {
    id: "e1",
    title: "Cyber Attack on Traffic Control",
    description: "Traffic control system compromised in downtown area",
    location: {
      address: "Main St & 5th Ave, Downtown",
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    type: "cyber",
    priority: 1,
    status: "in-progress",
    reportedTime: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    assignedAgentId: "a3"
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
  },
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
    id: "e4",
    title: "Suspicious Activity",
    description: "Security cameras detected potentially malicious individuals near City Hall",
    location: {
      address: "City Hall Plaza, Government District",
      coordinates: {
        lat: 40.7127,
        lng: -74.0059
      }
    },
    type: "physical",
    priority: 3,
    status: "in-progress",
    reportedTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    assignedAgentId: "a1"
  },
  {
    id: "e5",
    title: "Gas Leak Reported",
    description: "Residential area reporting gas smell, potential infrastructure damage",
    location: {
      address: "Oak Street, Residential District",
      coordinates: {
        lat: 40.7234,
        lng: -73.9876
      }
    },
    type: "infrastructure",
    priority: 2,
    status: "resolved",
    reportedTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    resolvedTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    assignedAgentId: "a5"
  }
];

export default function EmergencyPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [queue] = useState(() => {
    // Initialize priority queue
    const pq = new PriorityQueue<EmergencyRequest>((a, b) => a - b)
    sampleRequests
      .filter(req => req.status !== "resolved")
      .forEach(req => {
        pq.enqueue(req, req.priority)
      })
    return pq
  })
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("active")
  
  useEffect(() => {
    if (activeFilter === "active") {
      setRequests(sampleRequests.filter(req => req.status !== "resolved"))
    } else if (activeFilter === "pending") {
      setRequests(sampleRequests.filter(req => req.status === "pending"))
    } else if (activeFilter === "in-progress") {
      setRequests(sampleRequests.filter(req => req.status === "in-progress"))
    } else if (activeFilter === "resolved") {
      setRequests(sampleRequests.filter(req => req.status === "resolved"))
    } else {
      setRequests(sampleRequests)
    }
  }, [activeFilter])
  
  const getTypeIcon = (type: EmergencyType) => {
    switch (type) {
      case "cyber":
        return <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/50">Cyber</Badge>
      case "physical":
        return <Badge variant="outline" className="bg-chart-1/20 text-chart-1 border-chart-1/50">Physical</Badge>
      case "infrastructure":
        return <Badge variant="outline" className="bg-chart-3/20 text-chart-3 border-chart-3/50">Infrastructure</Badge>
      case "medical":
        return <Badge variant="outline" className="bg-chart-4/20 text-chart-4 border-chart-4/50">Medical</Badge>
      case "fire":
        return <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5/50">Fire</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1:
        return <Badge className="bg-destructive hover:bg-destructive">P1</Badge>
      case 2:
        return <Badge className="bg-chart-1 hover:bg-chart-1">P2</Badge>
      case 3:
        return <Badge className="bg-chart-4 hover:bg-chart-4">P3</Badge>
      case 4:
        return <Badge className="bg-chart-2 hover:bg-chart-2">P4</Badge>
      case 5:
        return <Badge className="bg-muted hover:bg-muted">P5</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }
  
  const getStatusBadge = (status: EmergencyStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/50">Pending</Badge>
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/50">In Progress</Badge>
      case "resolved":
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Resolved</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  const changePriority = (requestId: string, newPriority: number) => {
    // Update the request in the state
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, priority: newPriority as any } 
          : req
      )
    )
    
    // Update the selected request if it's the one being modified
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(prev => 
        prev ? { ...prev, priority: newPriority as any } : null
      )
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Emergency Response</h1>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <AlertCircle className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="active" onValueChange={setActiveFilter}>
        <TabsList>
          <TabsTrigger value="active">Active ({sampleRequests.filter(req => req.status !== "resolved").length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({sampleRequests.filter(req => req.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({sampleRequests.filter(req => req.status === "in-progress").length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({sampleRequests.filter(req => req.status === "resolved").length})</TabsTrigger>
        </TabsList>
        
        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          <TabsContent value="active" className="space-y-4 m-0">
            <div className="grid gap-2">
              {requests.sort((a, b) => a.priority - b.priority).map((request) => (
                <Card 
                  key={request.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedRequest?.id === request.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        {getPriorityBadge(request.priority)}
                        {getTypeIcon(request.type)}
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <h3 className="font-medium text-base mb-1">{request.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {request.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <Clock className="h-3 w-3" /> 
                      <span>Reported {formatDistanceToNow(new Date(request.reportedTime), { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4 m-0">
            <div className="grid gap-2">
              {requests.sort((a, b) => a.priority - b.priority).map((request) => (
                <Card 
                  key={request.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedRequest?.id === request.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        {getPriorityBadge(request.priority)}
                        {getTypeIcon(request.type)}
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <h3 className="font-medium text-base mb-1">{request.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {request.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <Clock className="h-3 w-3" /> 
                      <span>Reported {formatDistanceToNow(new Date(request.reportedTime), { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="in-progress" className="space-y-4 m-0">
            <div className="grid gap-2">
              {requests.sort((a, b) => a.priority - b.priority).map((request) => (
                <Card 
                  key={request.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedRequest?.id === request.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        {getPriorityBadge(request.priority)}
                        {getTypeIcon(request.type)}
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <h3 className="font-medium text-base mb-1">{request.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {request.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <Clock className="h-3 w-3" /> 
                      <span>Reported {formatDistanceToNow(new Date(request.reportedTime), { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="resolved" className="space-y-4 m-0">
            <div className="grid gap-2">
              {requests.sort((a, b) => a.priority - b.priority).map((request) => (
                <Card 
                  key={request.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedRequest?.id === request.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        {getPriorityBadge(request.priority)}
                        {getTypeIcon(request.type)}
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <h3 className="font-medium text-base mb-1">{request.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {request.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <Clock className="h-3 w-3" /> 
                      <span>Reported {formatDistanceToNow(new Date(request.reportedTime), { addSuffix: true })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Selected Request Details */}
          <Card className="col-span-full lg:col-span-2 h-full">
            {selectedRequest ? (
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{selectedRequest.title}</h2>
                    <div className="flex gap-2">
                      {getPriorityBadge(selectedRequest.priority)}
                      {getTypeIcon(selectedRequest.type)}
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedRequest.priority === 1}
                      onClick={() => changePriority(selectedRequest.id, Math.max(1, selectedRequest.priority - 1))}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedRequest.priority === 5}
                      onClick={() => changePriority(selectedRequest.id, Math.min(5, selectedRequest.priority + 1))}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p>{selectedRequest.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedRequest.location.address}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Reported {new Date(selectedRequest.reportedTime).toLocaleString()}</span>
                      </div>
                      {selectedRequest.assignedAgentId && (
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          <span>Assigned to Agent {selectedRequest.assignedAgentId}</span>
                        </div>
                      )}
                      {selectedRequest.resolvedTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Resolved {new Date(selectedRequest.resolvedTime).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative rounded-md overflow-hidden h-[200px] bg-slate-950/50 mt-4">
                    <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-30"></div>
                    
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-destructive/30 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-destructive animate-ping"></div>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="font-mono text-xs opacity-80">LOCATION DATA LOADING...</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline">View Full Details</Button>
                    {selectedRequest.status === "pending" ? (
                      <Button>Assign Agent</Button>
                    ) : selectedRequest.status === "in-progress" ? (
                      <Button>Mark as Resolved</Button>
                    ) : (
                      <Button variant="outline" disabled>Resolved</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
                <AlertCircle className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-center text-lg">Select an emergency request to view details</p>
              </CardContent>
            )}
          </Card>
        </div>
      </Tabs>
    </div>
  )
}