"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"
import { DownloadIcon, Calendar } from "lucide-react"

// Sample data for charts
const threatData = [
  { name: "Critical", value: 8, color: "hsl(var(--destructive))" },
  { name: "High", value: 15, color: "hsl(var(--chart-1))" },
  { name: "Medium", value: 27, color: "hsl(var(--chart-4))" },
  { name: "Low", value: 42, color: "hsl(var(--chart-2))" }
]

const emergencyTypeData = [
  { type: "Cyber", count: 12, color: "hsl(var(--chart-2))" },
  { type: "Physical", count: 8, color: "hsl(var(--chart-1))" },
  { type: "Infrastructure", count: 5, color: "hsl(var(--chart-3))" },
  { type: "Medical", count: 7, color: "hsl(var(--chart-4))" },
  { type: "Fire", count: 3, color: "hsl(var(--chart-5))" }
]

const responseTimeData = [
  { day: "Mon", p1: 3.2, p2: 8.5, p3: 15.7 },
  { day: "Tue", p1: 4.1, p2: 7.8, p3: 14.2 },
  { day: "Wed", p1: 2.8, p2: 9.2, p3: 16.5 },
  { day: "Thu", p1: 3.5, p2: 6.9, p3: 13.8 },
  { day: "Fri", p1: 5.2, p2: 8.1, p3: 15.2 },
  { day: "Sat", p1: 4.7, p2: 10.3, p3: 17.9 },
  { day: "Sun", p1: 3.9, p2: 9.7, p3: 16.1 }
]

const incidentTrendData = [
  { date: "Jan", incidents: 42 },
  { date: "Feb", incidents: 38 },
  { date: "Mar", incidents: 45 },
  { date: "Apr", incidents: 53 },
  { date: "May", incidents: 68 },
  { date: "Jun", incidents: 73 },
  { date: "Jul", incidents: 65 },
  { date: "Aug", incidents: 48 },
  { date: "Sep", incidents: 52 },
  { date: "Oct", incidents: 58 },
  { date: "Nov", incidents: 62 },
  { date: "Dec", incidents: 57 }
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("1m")
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Analytics & Reporting</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +12% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2m</div>
            <p className="text-xs text-muted-foreground">
              -1.4m from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              85% deployment rate
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="incidents">Incident Analysis</TabsTrigger>
          <TabsTrigger value="response">Response Metrics</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 grid gap-6">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Threat Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of threats by severity level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={threatData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {threatData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} cases`, 'Count']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '0.5rem',
                            color: 'hsl(var(--card-foreground))'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Types</CardTitle>
                  <CardDescription>
                    Distribution of emergency requests by type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={emergencyTypeData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} cases`, 'Count']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '0.5rem',
                            color: 'hsl(var(--card-foreground))'
                          }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {emergencyTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Incident Trend</CardTitle>
                <CardDescription>
                  Monthly incident count over the past year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={incidentTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} cases`, 'Incidents']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '0.5rem',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="incidents" 
                        stroke="hsl(var(--chart-2))" 
                        fill="hsl(var(--chart-2)/0.2)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle>Incident Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of incident types and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      Incident analysis data would be displayed here in a real implementation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="response">
            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
                <CardDescription>
                  Average response times by priority level (minutes)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} minutes`, '']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '0.5rem',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="p1" 
                        name="Priority 1" 
                        stroke="hsl(var(--destructive))" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="p2" 
                        name="Priority 2" 
                        stroke="hsl(var(--chart-1))" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="p3" 
                        name="Priority 3" 
                        stroke="hsl(var(--chart-4))" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
                <CardDescription>
                  Distribution of resources across different sectors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      Resource allocation data would be displayed here in a real implementation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}