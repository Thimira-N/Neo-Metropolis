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
  UserCircle, Download
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

    // generate report
  const generateReport = () => {
    const now = new Date()
    const reportDate = now.toLocaleDateString()
    const reportTime = now.toLocaleTimeString()

    // Calculate statistics
    const totalRequests = sampleRequests.length
    const priorityStats = {
      p1: sampleRequests.filter(r => r.priority === 1).length,
      p2: sampleRequests.filter(r => r.priority === 2).length,
      p3: sampleRequests.filter(r => r.priority === 3).length,
      p4: sampleRequests.filter(r => r.priority === 4).length,
      p5: sampleRequests.filter(r => r.priority === 5).length,
    }

    const statusStats = {
      pending: sampleRequests.filter(r => r.status === "pending").length,
      inProgress: sampleRequests.filter(r => r.status === "in-progress").length,
      resolved: sampleRequests.filter(r => r.status === "resolved").length,
    }

    const typeStats = {
      cyber: sampleRequests.filter(r => r.type === "cyber").length,
      physical: sampleRequests.filter(r => r.type === "physical").length,
      infrastructure: sampleRequests.filter(r => r.type === "infrastructure").length,
      medical: sampleRequests.filter(r => r.type === "medical").length,
      fire: sampleRequests.filter(r => r.type === "fire").length,
    }

    // Calculate average response times
    const resolvedRequests = sampleRequests.filter(r => r.resolvedTime)
    const avgResponseTime = resolvedRequests.length > 0
        ? resolvedRequests.reduce((acc, req) => {
      const reportTime = new Date(req.reportedTime).getTime()
      const resolveTime = new Date(req.resolvedTime!).getTime()
      return acc + (resolveTime - reportTime)
    }, 0) / resolvedRequests.length / (1000 * 60) // Convert to minutes
        : 0

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency Response Report - ${reportDate}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 1.1em;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
        }
        .stat-card h3 {
            margin: 0 0 15px;
            color: #667eea;
            font-size: 1.2em;
        }
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #333;
            margin: 10px 0;
        }
        .priority-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            margin-top: 15px;
        }
        .priority-item {
            text-align: center;
            padding: 10px;
            border-radius: 8px;
            font-weight: bold;
        }
        .p1 { background: #ef4444; color: white; }
        .p2 { background: #f97316; color: white; }
        .p3 { background: #eab308; color: white; }
        .p4 { background: #22c55e; color: white; }
        .p5 { background: #6b7280; color: white; }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 15px;
        }
        .status-item {
            text-align: center;
            padding: 15px;
            border-radius: 8px;
            font-weight: bold;
        }
        .pending { background: #fbbf24; color: white; }
        .in-progress { background: #3b82f6; color: white; }
        .resolved { background: #10b981; color: white; }
        .requests-table {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-top: 30px;
        }
        .table-header {
            background: #667eea;
            color: white;
            padding: 20px;
            font-size: 1.3em;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #555;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-cyber { background: #e0f2fe; color: #0277bd; }
        .badge-physical { background: #fce4ec; color: #c2185b; }
        .badge-infrastructure { background: #e8f5e8; color: #388e3c; }
        .badge-medical { background: #fff3e0; color: #f57c00; }
        .badge-fire { background: #ffebee; color: #d32f2f; }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        .chart-container {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        @media print {
            body { background: white; }
            .header { background: #667eea !important; -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Emergency Response Report</h1>
        <p>Generated on ${reportDate} at ${reportTime}</p>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <h3>Total Emergency Calls</h3>
            <div class="stat-number">${totalRequests}</div>
            <p>Emergency requests received</p>
        </div>

        <div class="stat-card">
            <h3>⏱Average Response Time</h3>
            <div class="stat-number">${avgResponseTime.toFixed(1)}</div>
            <p>Minutes (for resolved cases)</p>
        </div>

        <div class="stat-card">
            <h3>Resolution Rate</h3>
            <div class="stat-number">${((statusStats.resolved / totalRequests) * 100).toFixed(1)}%</div>
            <p>Cases successfully resolved</p>
        </div>

        <div class="stat-card">
            <h3>Critical Cases</h3>
            <div class="stat-number">${priorityStats.p1}</div>
            <p>Priority 1 emergencies</p>
        </div>
    </div>

    <div class="stats-grid">
        <div class="chart-container">
            <h3>Priority Distribution</h3>
            <div class="priority-grid">
                <div class="priority-item p1">
                    <div>P1</div>
                    <div>${priorityStats.p1}</div>
                </div>
                <div class="priority-item p2">
                    <div>P2</div>
                    <div>${priorityStats.p2}</div>
                </div>
                <div class="priority-item p3">
                    <div>P3</div>
                    <div>${priorityStats.p3}</div>
                </div>
                <div class="priority-item p4">
                    <div>P4</div>
                    <div>${priorityStats.p4}</div>
                </div>
                <div class="priority-item p5">
                    <div>P5</div>
                    <div>${priorityStats.p5}</div>
                </div>
            </div>
        </div>

        <div class="chart-container">
            <h3>Status Overview</h3>
            <div class="status-grid">
                <div class="status-item pending">
                    <div>Pending</div>
                    <div>${statusStats.pending}</div>
                </div>
                <div class="status-item in-progress">
                    <div>In Progress</div>
                    <div>${statusStats.inProgress}</div>
                </div>
                <div class="status-item resolved">
                    <div>Resolved</div>
                    <div>${statusStats.resolved}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="requests-table">
        <div class="table-header">Detailed Emergency Requests</div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Reported Time</th>
                    <th>Response Time</th>
                </tr>
            </thead>
            <tbody>
                ${sampleRequests.map(req => {
      const reportTime = new Date(req.reportedTime)
      const responseTime = req.resolvedTime
          ? Math.round((new Date(req.resolvedTime).getTime() - reportTime.getTime()) / (1000 * 60))
          : 'Ongoing'

      return `
                    <tr>
                        <td>${req.id}</td>
                        <td>${req.title}</td>
                        <td><span class="badge badge-${req.type}">${req.type}</span></td>
                        <td>P${req.priority}</td>
                        <td>${req.status}</td>
                        <td>${req.location.address}</td>
                        <td>${reportTime.toLocaleString()}</td>
                        <td>${typeof responseTime === 'number' ? responseTime + ' min' : responseTime}</td>
                    </tr>
                  `
    }).join('')}
            </tbody>
        </table>
    </div>

    <div class="chart-container">
        <h3>Emergency Types Distribution</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px;">
            ${Object.entries(typeStats)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => `
                <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 2em; margin-bottom: 5px;">${count}</div>
                    <div style="font-weight: bold; text-transform: capitalize;">${type}</div>
                </div>
              `).join('')}
        </div>
    </div>

    <div class="footer">
        <p>Emergency Response Management System</p>
        <p>This report contains ${totalRequests} emergency requests with comprehensive analysis of priority levels, response times, and resolution status.</p>
        <p><strong>Report Period:</strong> All time • <strong>Generated:</strong> ${reportDate} ${reportTime}</p>
    </div>
</body>
</html>`

    // Create and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `emergency-report-${reportDate.replace(/\//g, '-')}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }


  
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
          <Button size="sm" variant="outline" onClick={generateReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
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