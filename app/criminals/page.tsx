"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  UserX,
  Filter
} from "lucide-react"
import { Criminal } from "@/types"
import { CriminalDatabase } from "@/lib/data-structures/CriminalDatabase"

// Sample criminals data
const sampleCriminals: Criminal[] = [
  {
    id: "cr1",
    name: "Alexei Volkov",
    age: 35,
    nationality: "Russian Federation",
    dateOfBirth: "1988-03-12",
    address: "Unknown",
    email: "unknown@secure-mail.com",
    phone: "Unknown",
    crimeHistory: [
      {
        id: "crh1",
        type: "Cyber Crime",
        description: "Banking system breach",
        date: "2023-01-15",
        location: "Financial District",
        status: "open"
      }
    ],
    threatLevel: "high",
    status: "at-large",
    lastSeen: "2023-06-10",
    createdAt: "2023-01-20T10:30:00Z",
    updatedAt: "2023-06-15T14:20:00Z"
  },
  {
    id: "cr2",
    name: "Marcus Reynolds",
    age: 28,
    nationality: "United States",
    dateOfBirth: "1994-07-22",
    address: "Detention Center, Metropolis",
    email: "m.reynolds@public-mail.com",
    phone: "555-9876",
    crimeHistory: [
      {
        id: "crh2",
        type: "Physical",
        description: "Infrastructure sabotage",
        date: "2023-02-28",
        location: "North Power Plant",
        status: "closed"
      }
    ],
    threatLevel: "medium",
    status: "in-custody",
    createdAt: "2023-03-05T08:45:00Z",
    updatedAt: "2023-05-10T11:30:00Z"
  },
  {
    id: "cr3",
    name: "Sophia Chen",
    age: 31,
    nationality: "Singapore",
    dateOfBirth: "1991-11-05",
    address: "Unknown",
    email: "sophia.chen@tech-group.net",
    phone: "Unknown",
    crimeHistory: [
      {
        id: "crh3",
        type: "Cyber Crime",
        description: "Surveillance system hacking",
        date: "2023-04-12",
        location: "City Center",
        status: "under-investigation"
      }
    ],
    threatLevel: "critical",
    status: "at-large",
    lastSeen: "2023-07-01",
    createdAt: "2023-04-15T16:20:00Z",
    updatedAt: "2023-07-02T09:15:00Z"
  },
  {
    id: "cr4",
    name: "Darius Jackson",
    age: 42,
    nationality: "United Kingdom",
    dateOfBirth: "1980-05-17",
    address: "Rehabilitation Center, Metropolis",
    email: "d.jackson@city-rehab.gov",
    phone: "555-5432",
    crimeHistory: [
      {
        id: "crh4",
        type: "Physical",
        description: "Police station attack",
        date: "2022-12-05",
        location: "West District",
        status: "closed"
      }
    ],
    threatLevel: "low",
    status: "released",
    createdAt: "2022-12-10T13:45:00Z",
    updatedAt: "2023-06-20T15:10:00Z"
  },
  {
    id: "cr5",
    name: "Elena Petrov",
    age: 29,
    nationality: "Russian Federation",
    dateOfBirth: "1993-09-28",
    address: "Unknown",
    email: "unknown",
    phone: "Unknown",
    crimeHistory: [
      {
        id: "crh5",
        type: "Cyber Crime",
        description: "Traffic control system manipulation",
        date: "2023-05-20",
        location: "Downtown",
        status: "open"
      }
    ],
    threatLevel: "high",
    status: "at-large",
    lastSeen: "2023-06-25",
    createdAt: "2023-05-22T10:15:00Z",
    updatedAt: "2023-06-26T08:30:00Z"
  }
];

export default function CriminalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [criminalDb] = useState(() => {
    const db = new CriminalDatabase()
    sampleCriminals.forEach(criminal => db.add(criminal))
    return db
  })
  const [criminals, setCriminals] = useState(sampleCriminals)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  
  useEffect(() => {
    // Apply filter when it changes
    if (activeFilter === "all") {
      setCriminals(sampleCriminals)
    } else if (activeFilter === "at-large") {
      setCriminals(criminalDb.findByStatus("at-large"))
    } else if (activeFilter === "in-custody") {
      setCriminals(criminalDb.findByStatus("in-custody"))
    } else if (activeFilter === "critical") {
      setCriminals(criminalDb.findByThreatLevel("critical"))
    } else if (activeFilter === "high") {
      setCriminals(criminalDb.findByThreatLevel("high"))
    }
  }, [activeFilter, criminalDb])
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setCriminals(sampleCriminals)
      return
    }
    
    const results = criminalDb.findByName(searchQuery)
    setCriminals(results)
  }
  
  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-blue-500 hover:bg-blue-600"
      case "medium": return "bg-amber-500 hover:bg-amber-600"
      case "high": return "bg-chart-1 hover:bg-chart-1/90"
      case "critical": return "bg-destructive hover:bg-destructive/90"
      default: return "bg-slate-500 hover:bg-slate-600"
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "at-large": return "bg-destructive/20 text-destructive"
      case "in-custody": return "bg-green-500/20 text-green-500"
      case "released": return "bg-blue-500/20 text-blue-500"
      default: return "bg-slate-500/20 text-slate-500"
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Criminal Database</h1>
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="sm">
            <AlertTriangle className="mr-2 h-4 w-4" />
            High Alert
          </Button>
          <Button variant="outline" size="sm">
            <UserX className="mr-2 h-4 w-4" />
            Report Sighting
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search criminal records..."
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
      
      <Tabs defaultValue="all" onValueChange={setActiveFilter}>
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="at-large">At Large</TabsTrigger>
          <TabsTrigger value="in-custody">In Custody</TabsTrigger>
          <TabsTrigger value="critical">Critical Threat</TabsTrigger>
          <TabsTrigger value="high">High Threat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {criminals.map((criminal) => (
              <Card key={criminal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{criminal.name}</CardTitle>
                    <Badge className={getStatusColor(criminal.status)}>
                      {criminal.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    ID: {criminal.id} • Age: {criminal.age} • {criminal.nationality}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1 text-sm">
                    {criminal.lastSeen && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last seen:</span>
                        <span>{criminal.lastSeen}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crime type:</span>
                      <span>{criminal.crimeHistory[0].type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {criminal.crimeHistory[0].description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      className={`w-auto ${getThreatLevelColor(criminal.threatLevel)}`}
                      size="sm"
                    >
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      {criminal.threatLevel.charAt(0).toUpperCase() + criminal.threatLevel.slice(1)} Threat
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="at-large" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {criminals.map((criminal) => (
              <Card key={criminal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{criminal.name}</CardTitle>
                    <Badge className={getStatusColor(criminal.status)}>
                      {criminal.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    ID: {criminal.id} • Age: {criminal.age} • {criminal.nationality}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1 text-sm">
                    {criminal.lastSeen && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last seen:</span>
                        <span>{criminal.lastSeen}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crime type:</span>
                      <span>{criminal.crimeHistory[0].type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {criminal.crimeHistory[0].description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      className={`w-auto ${getThreatLevelColor(criminal.threatLevel)}`}
                      size="sm"
                    >
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      {criminal.threatLevel.charAt(0).toUpperCase() + criminal.threatLevel.slice(1)} Threat
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="in-custody">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {criminals.map((criminal) => (
              <Card key={criminal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{criminal.name}</CardTitle>
                    <Badge className={getStatusColor(criminal.status)}>
                      {criminal.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    ID: {criminal.id} • Age: {criminal.age} • {criminal.nationality}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1 text-sm">
                    {criminal.lastSeen && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last seen:</span>
                        <span>{criminal.lastSeen}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crime type:</span>
                      <span>{criminal.crimeHistory[0].type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {criminal.crimeHistory[0].description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      className={`w-auto ${getThreatLevelColor(criminal.threatLevel)}`}
                      size="sm"
                    >
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      {criminal.threatLevel.charAt(0).toUpperCase() + criminal.threatLevel.slice(1)} Threat
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="critical">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {criminals.map((criminal) => (
              <Card key={criminal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{criminal.name}</CardTitle>
                    <Badge className={getStatusColor(criminal.status)}>
                      {criminal.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    ID: {criminal.id} • Age: {criminal.age} • {criminal.nationality}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1 text-sm">
                    {criminal.lastSeen && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last seen:</span>
                        <span>{criminal.lastSeen}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crime type:</span>
                      <span>{criminal.crimeHistory[0].type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {criminal.crimeHistory[0].description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      className={`w-auto ${getThreatLevelColor(criminal.threatLevel)}`}
                      size="sm"
                    >
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      {criminal.threatLevel.charAt(0).toUpperCase() + criminal.threatLevel.slice(1)} Threat
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="high">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {criminals.map((criminal) => (
              <Card key={criminal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{criminal.name}</CardTitle>
                    <Badge className={getStatusColor(criminal.status)}>
                      {criminal.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    ID: {criminal.id} • Age: {criminal.age} • {criminal.nationality}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1 text-sm">
                    {criminal.lastSeen && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last seen:</span>
                        <span>{criminal.lastSeen}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crime type:</span>
                      <span>{criminal.crimeHistory[0].type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {criminal.crimeHistory[0].description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      className={`w-auto ${getThreatLevelColor(criminal.threatLevel)}`}
                      size="sm"
                    >
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      {criminal.threatLevel.charAt(0).toUpperCase() + criminal.threatLevel.slice(1)} Threat
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}