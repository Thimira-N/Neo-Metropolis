"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Upload
} from "lucide-react"
import { Citizen } from "@/types"
import { CitizenRegistry } from "@/lib/data-structures/CitizenRegistry"

// Sample citizens data with static recent dates
const sampleCitizens: Citizen[] = [
  {
    id: "c1",
    name: "Jane Cooper",
    age: 32,
    nationality: "United States",
    dateOfBirth: "1990-05-15",
    address: "123 Main St, Metropolis",
    email: "jane.cooper@example.com",
    phone: "555-1234",
    createdAt: "2025-04-23T08:30:00Z", // 30 days ago
    updatedAt: "2025-05-18T14:15:00Z"  // 5 days ago
  },
  {
    id: "c2",
    name: "Wade Warren",
    age: 45,
    nationality: "Canada",
    dateOfBirth: "1977-08-22",
    address: "456 Oak Ave, Metropolis",
    email: "wade.warren@example.com",
    phone: "555-2345",
    createdAt: "2025-04-08T10:15:00Z", // 45 days ago
    updatedAt: "2025-05-13T09:45:00Z"  // 10 days ago
  },
  {
    id: "c3",
    name: "Esther Howard",
    age: 29,
    nationality: "United Kingdom",
    dateOfBirth: "1993-11-04",
    address: "789 Pine St, Metropolis",
    email: "esther.howard@example.com",
    phone: "555-3456",
    createdAt: "2025-05-03T15:45:00Z", // 20 days ago
    updatedAt: "2025-05-20T11:30:00Z"  // 3 days ago
  },
  {
    id: "c4",
    name: "Cameron Williamson",
    age: 38,
    nationality: "Australia",
    dateOfBirth: "1984-07-10",
    address: "101 Maple Rd, Metropolis",
    email: "cameron.williamson@example.com",
    phone: "555-4567",
    createdAt: "2025-04-18T11:20:00Z", // 35 days ago
    updatedAt: "2025-05-16T16:10:00Z"  // 7 days ago
  },
  {
    id: "c5",
    name: "Brooklyn Simmons",
    age: 27,
    nationality: "United States",
    dateOfBirth: "1996-03-18",
    address: "202 Cedar Ln, Metropolis",
    email: "brooklyn.simmons@example.com",
    phone: "555-5678",
    createdAt: "2025-05-08T09:10:00Z", // 15 days ago
    updatedAt: "2025-05-21T13:25:00Z"  // 2 days ago
  }
];

export default function CitizensPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [citizenRegistry] = useState(() => {
    const registry = new CitizenRegistry();
    sampleCitizens.forEach(citizen => registry.add(citizen));
    return registry;
  })
  const [citizens, setCitizens] = useState(sampleCitizens)
  const [newCitizen, setNewCitizen] = useState<Partial<Citizen>>({
    name: "",
    age: 0,
    nationality: "",
    dateOfBirth: "",
    address: "",
    email: "",
    phone: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [nextId, setNextId] = useState(6) // Counter for generating IDs

  // Prevent hydration mismatch by only rendering after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{3}-\d{4}$|^\(\d{3}\)\s?\d{3}-\d{4}$|^\d{10}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validateAge = (age: number): boolean => {
    return age > 0 && age <= 150
  }

  const validateDateOfBirth = (dateOfBirth: string): boolean => {
    if (!dateOfBirth) return false
    const date = new Date(dateOfBirth)
    const today = new Date()
    return date <= today && date > new Date('1900-01-01')
  }

  const validateCitizen = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!newCitizen.name?.trim()) {
      newErrors.name = "Name is required"
    } else if (newCitizen.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Age validation
    if (!newCitizen.age || !validateAge(newCitizen.age)) {
      newErrors.age = "Age must be between 1 and 150"
    }

    // Nationality validation
    if (!newCitizen.nationality?.trim()) {
      newErrors.nationality = "Nationality is required"
    }

    // Date of birth validation
    if (!newCitizen.dateOfBirth || !validateDateOfBirth(newCitizen.dateOfBirth)) {
      newErrors.dateOfBirth = "Valid date of birth is required"
    }

    // Address validation
    if (!newCitizen.address?.trim()) {
      newErrors.address = "Address is required"
    } else if (newCitizen.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters"
    }

    // Email validation
    if (!newCitizen.email?.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(newCitizen.email)) {
      newErrors.email = "Invalid email format"
    }

    // Phone validation
    if (!newCitizen.phone?.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!validatePhone(newCitizen.phone)) {
      newErrors.phone = "Invalid phone format (e.g., 555-1234 or (555) 123-4567)"
    }

    // Check for duplicate email
    const existingCitizen = citizens.find(citizen =>
        citizen.email.toLowerCase() === newCitizen.email?.toLowerCase()
    )
    if (existingCitizen) {
      newErrors.email = "Email already exists"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setCitizens(sampleCitizens)
      return
    }

    const results = citizenRegistry.findByName(searchQuery)
    setCitizens(results)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCitizen(prev => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleAddCitizen = () => {
    if (!validateCitizen()) {
      return
    }

    const now = new Date().toISOString()

    // Create a new citizen with a predictable ID
    const citizenToAdd: Citizen = {
      id: `c${nextId}`, // Use counter instead of Date.now()
      name: newCitizen.name?.trim() || "",
      age: newCitizen.age || 0,
      nationality: newCitizen.nationality?.trim() || "",
      dateOfBirth: newCitizen.dateOfBirth || "",
      address: newCitizen.address?.trim() || "",
      email: newCitizen.email?.trim() || "",
      phone: newCitizen.phone?.trim() || "",
      createdAt: now,
      updatedAt: now
    }

    // Add to registry
    citizenRegistry.add(citizenToAdd)

    // Update the citizens state
    setCitizens(prev => [...prev, citizenToAdd])

    // Increment the ID counter
    setNextId(prev => prev + 1)

    // Reset the form
    setNewCitizen({
      name: "",
      age: 0,
      nationality: "",
      dateOfBirth: "",
      address: "",
      email: "",
      phone: ""
    })

    // Clear any remaining errors
    setErrors({})

    // Close the dialog
    setIsDialogOpen(false)
  }

  // Don't render until component is mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Citizen Registry</h1>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Citizen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Citizen</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new citizen to add to the registry.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                          id="name"
                          name="name"
                          value={newCitizen.name}
                          onChange={handleInputChange}
                          className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                          id="age"
                          name="age"
                          type="number"
                          value={newCitizen.age}
                          onChange={handleInputChange}
                          className={errors.age ? "border-red-500" : ""}
                      />
                      {errors.age && (
                          <p className="text-sm text-red-500">{errors.age}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                          id="nationality"
                          name="nationality"
                          value={newCitizen.nationality}
                          onChange={handleInputChange}
                          className={errors.nationality ? "border-red-500" : ""}
                      />
                      {errors.nationality && (
                          <p className="text-sm text-red-500">{errors.nationality}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={newCitizen.dateOfBirth}
                          onChange={handleInputChange}
                          className={errors.dateOfBirth ? "border-red-500" : ""}
                      />
                      {errors.dateOfBirth && (
                          <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        name="address"
                        value={newCitizen.address}
                        onChange={handleInputChange}
                        className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                        <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                          id="email"
                          name="email"
                          type="email"
                          value={newCitizen.email}
                          onChange={handleInputChange}
                          className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                          <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                          id="phone"
                          name="phone"
                          value={newCitizen.phone}
                          onChange={handleInputChange}
                          className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddCitizen}>Add Citizen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button size="sm" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search citizens by name..."
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

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Citizens</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Nationality</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead className="hidden lg:table-cell">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {citizens.map((citizen) => (
                        <TableRow key={citizen.id}>
                          <TableCell className="font-medium">{citizen.name}</TableCell>
                          <TableCell>{citizen.age}</TableCell>
                          <TableCell>{citizen.nationality}</TableCell>
                          <TableCell className="hidden md:table-cell">{citizen.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{citizen.phone}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {new Date(citizen.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recently Added</CardTitle>
                <CardDescription>
                  Citizens added to the registry in the last 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">
                  Coming Soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="flagged">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Citizens</CardTitle>
                <CardDescription>
                  Citizens that require additional verification or attention.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">
                  Coming Soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}