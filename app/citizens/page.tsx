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
  Upload,
  FileText,
  FileSpreadsheet,
  FileImage
} from "lucide-react"
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
    createdAt: "2025-04-23T08:30:00Z",
    updatedAt: "2025-05-18T14:15:00Z"
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
    createdAt: "2025-04-08T10:15:00Z",
    updatedAt: "2025-05-13T09:45:00Z"
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
    createdAt: "2025-05-03T15:45:00Z",
    updatedAt: "2025-05-20T11:30:00Z"
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
    createdAt: "2025-04-18T11:20:00Z",
    updatedAt: "2025-05-16T16:10:00Z"
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
    createdAt: "2025-05-08T09:10:00Z",
    updatedAt: "2025-05-21T13:25:00Z"
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
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
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
      id: `c${nextId}`,
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

    citizenRegistry.add(citizenToAdd)  // Add to registry
    setCitizens(prev => [...prev, citizenToAdd])  // Update the citizens state
    setNextId(prev => prev + 1)  // Increment the ID counter

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

    setErrors({})  // Clear any remaining errors
    setIsDialogOpen(false)  // Close the dialog
  }

  // Export functions
  // Premium PDF Export with Enhanced Visual Design
  const exportAsPDF = async () => {
    try {
      // Dynamic import to ensure it only runs on client side
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = 297;
      const pageHeight = 210;

      // Premium gradient-style header
      const createPremiumHeader = () => {
        // Main header background with gradient effect simulation
        doc.setFillColor(16, 24, 40); // Deep navy
        doc.rect(0, 0, pageWidth, 35, 'F');

        // Accent stripe
        doc.setFillColor(59, 130, 246); // Premium blue
        doc.rect(0, 32, pageWidth, 3, 'F');

        // Secondary accent
        doc.setFillColor(147, 197, 253); // Light blue
        doc.rect(0, 29, pageWidth, 3, 'F');

        // Company/System Logo Area (simulated)
        doc.setFillColor(255, 255, 255);
        doc.circle(25, 17.5, 8, 'F');
        doc.setFillColor(59, 130, 246);
        doc.circle(25, 17.5, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('CR', 22, 19);

        // Main title
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text('CITIZEN REGISTRY', 45, 15);

        // Subtitle
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(200, 220, 255);
        doc.text('Comprehensive Database Export', 45, 23);

        // Right side info panel
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const formattedTime = today.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(`Generated: ${formattedDate}`, pageWidth - 80, 10);
        doc.text(`Time: ${formattedTime}`, pageWidth - 80, 16);
        doc.text(`Total Records: ${citizens.length}`, pageWidth - 80, 22);
        doc.text(`Status: ACTIVE`, pageWidth - 80, 28);
      };

      // Executive summary box
      const createSummaryBox = () => {
        const startY = 45;

        // Summary background
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.roundedRect(15, startY, pageWidth - 30, 20, 2, 2, 'FD');

        // Summary content
        doc.setTextColor(51, 65, 85);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('NEO-METROPOLIS', 20, startY + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const summaryText = `This report contains ${citizens.length} citizen records exported from the system database. ` +
            `Data includes personal information, contact details, and registration metadata.`;
        doc.text(summaryText, 20, startY + 12, { maxWidth: pageWidth - 40 });

        // Status indicators
        doc.setFillColor(34, 197, 94);
        doc.circle(pageWidth - 40, startY + 8, 2, 'F');
        doc.setTextColor(34, 197, 94);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('VERIFIED', pageWidth - 35, startY + 9);
      };

      // Enhanced table styling
      const createPremiumTable = () => {
        const headers = [
          'Full Name',
          'Age',
          'Nationality',
          'Date of Birth',
          'Address',
          'Email Address',
          'Phone Number',
          'Registration Date'
        ];

        const data = citizens.map((citizen, index) => [
          citizen.name || 'N/A',
          citizen.age?.toString() || 'N/A',
          citizen.nationality || 'N/A',
          citizen.dateOfBirth || 'N/A',
          citizen.address || 'N/A',
          citizen.email || 'N/A',
          citizen.phone || 'N/A',
          citizen.createdAt ? new Date(citizen.createdAt).toLocaleDateString() : 'N/A'
        ]);

        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 75,

          theme: 'plain',

          styles: {
            fontSize: 8,
            cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
            overflow: 'linebreak',
            halign: 'left',
            valign: 'middle',
            textColor: [30, 41, 59],
            lineColor: [203, 213, 225],
            lineWidth: 0.1
          },

          headStyles: {
            fillColor: [30, 41, 59], // Sophisticated dark
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
            halign: 'center',
            cellPadding: { top: 6, right: 3, bottom: 6, left: 3 }
          },

          bodyStyles: {
            fillColor: [255, 255, 255]
          },

          alternateRowStyles: {
            fillColor: [248, 250, 252] // Subtle alternating rows
          },

          columnStyles: {
            0: { cellWidth: 35, fontStyle: 'bold', textColor: [59, 130, 246] }, // Name in brand color
            1: { cellWidth: 15, halign: 'center' },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 25, halign: 'center', fontSize: 7 },
            4: { cellWidth: 45, fontSize: 7 },
            5: { cellWidth: 50, fontSize: 7, textColor: [16, 185, 129] }, // Email in green
            6: { cellWidth: 28, halign: 'center', fontSize: 7 },
            7: { cellWidth: 25, halign: 'center', fontSize: 7, textColor: [107, 114, 128] }
          },

          margin: { top: 75, left: 15, right: 15, bottom: 25 },

          didDrawCell: function(data) {
            // Add subtle borders for premium look
            if (data.section === 'head') {
              doc.setDrawColor(59, 130, 246);
              doc.setLineWidth(0.5);
              doc.line(
                  data.cell.x,
                  data.cell.y + data.cell.height,
                  data.cell.x + data.cell.width,
                  data.cell.y + data.cell.height
              );
            }
          },

          didDrawPage: function(data) {
            // Premium footer
            const footerY = pageHeight - 15;

            // Footer background
            doc.setFillColor(248, 250, 252);
            doc.rect(0, footerY - 5, pageWidth, 20, 'F');

            // Footer line
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

            // Footer content
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');

            // Left side
            doc.text(`Page ${data.pageNumber}`, 20, footerY);
            doc.text('Citizen Registry System', 20, footerY + 5);

            // Center
            doc.text(`Document ID: CR-${Date.now()}`, pageWidth/2 - 25, footerY);
            doc.text('CONFIDENTIAL', pageWidth/2 - 15, footerY + 5);
            doc.text('Developed by ThimiraNavodana', pageWidth/2 - 23, footerY + 12);

            // Right side
            doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 80, footerY);
            doc.text('© 2025 All Rights Reserved', pageWidth - 80, footerY + 5);

            // Security watermark
            doc.setTextColor(240, 240, 240);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(60);
            doc.saveGraphicsState();

            // Create graphics state for transparency
            const gState = new (doc as any).GState({opacity: 0.1});
            doc.setGState(gState);

            doc.text('OFFICIAL', pageWidth/2 - 40, pageHeight/2, {
              angle: -45,
              align: 'center'
            });
            doc.restoreGraphicsState();
          }
        });
      };

      // Generate all components
      createPremiumHeader();
      createSummaryBox();
      createPremiumTable();

      // Save with professional filename
      const timestamp = new Date().toISOString().slice(0, 10);
      const timeStr = new Date().toTimeString().slice(0, 5).replace(':', '');
      doc.save(`CitizenRegistry_Export_${timestamp}_${timeStr}.pdf`);

    } catch (error) {
      console.error('Error generating premium PDF:', error);
      // Fallback notification
      alert('Error generating PDF. Please try again.');
    }
  };

  // CSV
  const exportAsCSV = () => {
    const headers = ["Name", "Age", "Nationality", "Date of Birth", "Address", "Email", "Phone", "Created At"]
    const csvContent = [
      headers.join(","),
      ...citizens.map(citizen => [
        `"${citizen.name}"`,
        citizen.age,
        `"${citizen.nationality}"`,
        citizen.dateOfBirth,
        `"${citizen.address}"`,
        citizen.email,
        citizen.phone,
        new Date(citizen.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "citizens.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsExportDialogOpen(false)
  }

  // JSON
  const exportAsJSON = () => {
    const jsonContent = JSON.stringify(citizens, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "citizens.json")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsExportDialogOpen(false)
  }

  // TXT
  const exportAsTXT = () => {
    const txtContent = citizens.map(citizen =>
        `Name: ${citizen.name}\nAge: ${citizen.age}\nNationality: ${citizen.nationality}\nDate of Birth: ${citizen.dateOfBirth}\nAddress: ${citizen.address}\nEmail: ${citizen.email}\nPhone: ${citizen.phone}\nCreated: ${new Date(citizen.createdAt).toLocaleDateString()}\n${"=".repeat(50)}\n`
    ).join("\n")

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "citizens.txt")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsExportDialogOpen(false)
  }

  // HTML
  const exportAsHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Citizen Registry</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>Citizen Registry Export</h1>
    <p>Generated on: ${new Date().toLocaleDateString()}</p>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Nationality</th>
                <th>Date of Birth</th>
                <th>Address</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created</th>
            </tr>
        </thead>
        <tbody>
            ${citizens.map(citizen => `
                <tr>
                    <td>${citizen.name}</td>
                    <td>${citizen.age}</td>
                    <td>${citizen.nationality}</td>
                    <td>${citizen.dateOfBirth}</td>
                    <td>${citizen.address}</td>
                    <td>${citizen.email}</td>
                    <td>${citizen.phone}</td>
                    <td>${new Date(citizen.createdAt).toLocaleDateString()}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "citizens.html")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsExportDialogOpen(false)
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

            {/* Export Dialog */}
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Export Citizens Data</DialogTitle>
                  <DialogDescription>
                    Choose your preferred export format to download the citizen registry data.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">

                  <Button
                      variant="outline"
                      className="justify-start h-12"
                      onClick={exportAsPDF}
                  >
                    <FileText className="mr-3 h-5 w-5 text-red-600" />
                    <div className="text-left">
                      <div className="font-medium">Export as PDF</div>
                      <div className="text-sm text-muted-foreground">Portable document format file</div>
                    </div>
                  </Button>

                  <Button
                      variant="outline"
                      className="justify-start h-12"
                      onClick={exportAsCSV}
                  >
                    <FileSpreadsheet className="mr-3 h-5 w-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Export as CSV</div>
                      <div className="text-sm text-muted-foreground">Comma-separated values file</div>
                    </div>
                  </Button>

                  <Button
                      variant="outline"
                      className="justify-start h-12"
                      onClick={exportAsJSON}
                  >
                    <FileText className="mr-3 h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Export as JSON</div>
                      <div className="text-sm text-muted-foreground">JavaScript object notation file</div>
                    </div>
                  </Button>

                  <Button
                      variant="outline"
                      className="justify-start h-12"
                      onClick={exportAsHTML}
                  >
                    <FileImage className="mr-3 h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium">Export as HTML</div>
                      <div className="text-sm text-muted-foreground">Formatted web page</div>
                    </div>
                  </Button>

                  <Button
                      variant="outline"
                      className="justify-start h-12"
                      onClick={exportAsTXT}
                  >
                    <FileText className="mr-3 h-5 w-5 text-gray-600" />
                    <div className="text-left">
                      <div className="font-medium">Export as TXT</div>
                      <div className="text-sm text-muted-foreground">Plain text file</div>
                    </div>
                  </Button>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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