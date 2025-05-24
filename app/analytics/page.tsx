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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {DownloadIcon, Calendar, FileText, File} from "lucide-react"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

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
  const [isExporting, setIsExporting] = useState(false)

  const generateReportData = () => {
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    return {
      title: "Emergency Management Analytics Report",
      generatedDate: currentDate,
      generatedTime: currentTime,
      period: "Last 30 Days",
      summary: {
        totalCases: 573,
        resolutionRate: "87.3%",
        avgResponseTime: "8.2 minutes",
        activeAgents: 42
      },
      threatDistribution: threatData,
      emergencyTypes: emergencyTypeData,
      responseMetrics: responseTimeData,
      incidentTrend: incidentTrendData
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      // Dynamically import jsPDF
      const jsPDF = (await import('jspdf')).default;

      const doc : any = new jsPDF()
      const reportData = generateReportData()

      // Premium color scheme
      const primaryBlue = [30, 64, 175]
      const successGreen = [5, 150, 105]
      const warningOrange = [217, 119, 6]
      const dangerRed = [220, 38, 38]
      const lightGray = [243, 244, 246]

      // Helper function to add premium header
      const addPremiumHeader = (title : any, color = primaryBlue) => {
        // Header background
        doc.setFillColor(...color)
        doc.rect(0, 0, 210, 25, 'F')

        // Title
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text(title, 20, 16)

        // Company branding
        doc.setFontSize(10)
        doc.text('EMERGENCY ANALYTICS SYSTEM', 150, 10)
        doc.text('CONFIDENTIAL REPORT', 150, 20)
      }

      // Helper function to create metric cards
      const addMetricCard = (x : any, y : any, width : any, height : any, title : any, value : any, color : number[] = primaryBlue) => {
        // Card shadow effect (using gray rectangles)
        doc.setFillColor(200, 200, 200)
        doc.rect(x + 1, y + 1, width, height, 'F')

        // Card background
        doc.setFillColor(255, 255, 255)
        doc.rect(x, y, width, height, 'F')

        // Card border
        doc.setDrawColor(...color)
        doc.setLineWidth(1)
        doc.rect(x, y, width, height, 'S')

        // Title background (lighter version of the color)
        const lightColor = color.map(c => Math.min(255, c + 200))
        doc.setFillColor(...lightColor)
        doc.rect(x, y, width, 12, 'F')

        // Title text
        doc.setTextColor(...color)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(title, x + 5, y + 8)

        // Value text
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text(value.toString(), x + 5, y + 25)
      }

      // Helper function to add section divider
      const addSectionDivider = (y : any, title : any, color : number[] = primaryBlue) => {
        const lightColor = color.map(c => Math.min(255, c + 200))
        doc.setFillColor(...lightColor)
        doc.rect(20, y, 170, 15, 'F')

        doc.setTextColor(...color)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text(title, 25, y + 10)
      }

      // PAGE 1: EXECUTIVE DASHBOARD
      addPremiumHeader('EMERGENCY ANALYTICS EXECUTIVE REPORT')

      // Report metadata section
      doc.setFillColor(...lightGray)
      doc.rect(20, 35, 170, 20, 'F')

      doc.setTextColor(100, 100, 100)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Generated: ${reportData.generatedDate} at ${reportData.generatedTime}`, 25, 43)
      doc.text(`Report Period: ${reportData.period}`, 25, 50)

      // Executive Summary Cards
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('KEY PERFORMANCE INDICATORS', 20, 70)

      // Premium metric cards
      addMetricCard(20, 80, 80, 35, 'TOTAL CASES', reportData.summary.totalCases, primaryBlue)
      addMetricCard(110, 80, 80, 35, 'RESOLUTION RATE', reportData.summary.resolutionRate, successGreen)
      addMetricCard(20, 125, 80, 35, 'AVG RESPONSE TIME', reportData.summary.avgResponseTime, warningOrange)
      addMetricCard(110, 125, 80, 35, 'ACTIVE AGENTS', reportData.summary.activeAgents, dangerRed)

      // Executive Insights Box
      const lightBlueExecutive = primaryBlue.map(c => Math.min(255, c + 200))
      doc.setFillColor(...lightBlueExecutive)
      doc.rect(20, 175, 170, 50, 'F')

      doc.setTextColor(...primaryBlue)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('EXECUTIVE INSIGHTS', 25, 185)

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('• System performance exceeds industry benchmarks by 18%', 25, 195)
      doc.text('• Critical incident response time improved 12% vs previous period', 25, 202)
      doc.text('• Security threat detection accuracy increased to 94.2%', 25, 209)
      doc.text('• Recommend increasing P1 response capacity during peak hours', 25, 216)

      // Page footer
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(8)
      doc.text('Confidential - Emergency Analytics Report', 20, 285)
      doc.text('Page 1 of 3', 180, 285)

      // PAGE 2: THREAT ANALYSIS
      doc.addPage()
      addPremiumHeader('THREAT DISTRIBUTION & EMERGENCY ANALYSIS', dangerRed)

      // Threat Distribution Section
      addSectionDivider(35, 'THREAT DISTRIBUTION ANALYSIS', dangerRed)

      let yPos = 60
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Threat Type', 30, yPos)
      doc.text('Cases', 90, yPos)
      doc.text('Percentage', 130, yPos)
      doc.text('Risk Level', 170, yPos)

      // Draw header line
      doc.setDrawColor(...dangerRed)
      doc.setLineWidth(1)
      doc.line(20, yPos + 3, 190, yPos + 3)

      yPos += 12
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      reportData.threatDistribution.forEach((threat, index) => {
        const percentage = ((threat.value / reportData.summary.totalCases) * 100).toFixed(1)
        const riskLevel = threat.value > 50 ? 'HIGH' : threat.value > 20 ? 'MEDIUM' : 'LOW'
        const riskColor = threat.value > 50 ? dangerRed : threat.value > 20 ? warningOrange : successGreen

        // Alternating row backgrounds
        if (index % 2 === 0) {
          doc.setFillColor(...lightGray)
          doc.rect(20, yPos - 8, 170, 12, 'F')
        }

        doc.setTextColor(0, 0, 0)
        doc.text(threat.name, 30, yPos)
        doc.text(threat.value.toString(), 90, yPos)
        doc.text(percentage + '%', 130, yPos)

        // Color-coded risk level
        doc.setTextColor(...riskColor)
        doc.setFont('helvetica', 'bold')
        doc.text(riskLevel, 170, yPos)
        doc.setFont('helvetica', 'normal')

        yPos += 12
      })

      // Emergency Types Section
      yPos += 15
      addSectionDivider(yPos, 'EMERGENCY INCIDENT BREAKDOWN', warningOrange)
      yPos += 25

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Emergency Type', 30, yPos)
      doc.text('Count', 100, yPos)
      doc.text('Priority', 140, yPos)
      doc.text('Avg Response', 170, yPos)

      doc.setDrawColor(...warningOrange)
      doc.line(20, yPos + 3, 190, yPos + 3)

      yPos += 12
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      reportData.emergencyTypes.forEach((type, index) => {
        const priority = type.type.includes('Fire') || type.type.includes('Medical') ? 'P1' :
            type.type.includes('Security') ? 'P2' : 'P3'
        const avgResponse = priority === 'P1' ? '8 min' : priority === 'P2' ? '15 min' : '25 min'

        if (index % 2 === 0) {
          doc.setFillColor(...lightGray)
          doc.rect(20, yPos - 8, 170, 12, 'F')
        }

        doc.setTextColor(0, 0, 0)
        doc.text(type.type, 30, yPos)
        doc.text(type.count.toString(), 100, yPos)
        doc.text(priority, 140, yPos)
        doc.text(avgResponse, 170, yPos)

        yPos += 12
      })

      // Page footer
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(8)
      doc.text('Confidential - Emergency Analytics Report', 20, 285)
      doc.text('Page 2 of 3', 180, 285)

      // PAGE 3: PERFORMANCE METRICS
      doc.addPage()
      addPremiumHeader('RESPONSE TIME PERFORMANCE & TRENDS', successGreen)

      // Calculate averages
      const avgP1 = (responseTimeData.reduce((sum, day) => sum + day.p1, 0) / responseTimeData.length).toFixed(1)
      const avgP2 = (responseTimeData.reduce((sum, day) => sum + day.p2, 0) / responseTimeData.length).toFixed(1)
      const avgP3 = (responseTimeData.reduce((sum, day) => sum + day.p3, 0) / responseTimeData.length).toFixed(1)

      // Performance metric cards
      addMetricCard(20, 40, 50, 40, 'P1 CRITICAL\nAVG TIME', avgP1 + ' min',
          parseFloat(avgP1) <= 15 ? successGreen : dangerRed)
      addMetricCard(80, 40, 50, 40, 'P2 HIGH\nAVG TIME', avgP2 + ' min',
          parseFloat(avgP2) <= 30 ? successGreen : warningOrange)
      addMetricCard(140, 40, 50, 40, 'P3 MEDIUM\nAVG TIME', avgP3 + ' min',
          parseFloat(avgP3) <= 60 ? successGreen : warningOrange)

      // Weekly Performance Breakdown
      addSectionDivider(95, 'WEEKLY RESPONSE TIME BREAKDOWN', successGreen)

      yPos = 120
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Day', 30, yPos)
      doc.text('P1 Critical', 70, yPos)
      doc.text('P2 High', 110, yPos)
      doc.text('P3 Medium', 150, yPos)
      doc.text('Score', 180, yPos)

      doc.setDrawColor(...successGreen)
      doc.line(20, yPos + 3, 190, yPos + 3)

      yPos += 12
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      responseTimeData.forEach((day, index) => {
        // Calculate performance score
        const score = Math.round((
            (day.p1 <= 15 ? 100 : Math.max(0, 100 - (day.p1 - 15) * 5)) * 0.5 +
            (day.p2 <= 30 ? 100 : Math.max(0, 100 - (day.p2 - 30) * 3)) * 0.3 +
            (day.p3 <= 60 ? 100 : Math.max(0, 100 - (day.p3 - 60) * 2)) * 0.2
        ))

        if (index % 2 === 0) {
          doc.setFillColor(...lightGray)
          doc.rect(20, yPos - 8, 170, 12, 'F')
        }

        doc.setTextColor(0, 0, 0)
        doc.text(day.day, 30, yPos)
        doc.text(day.p1 + ' min', 70, yPos)
        doc.text(day.p2 + ' min', 110, yPos)
        doc.text(day.p3 + ' min', 150, yPos)

        // Color-coded score
        const scoreColor = score >= 90 ? successGreen : score >= 75 ? warningOrange : dangerRed
        doc.setTextColor(...scoreColor)
        doc.setFont('helvetica', 'bold')
        doc.text(score + '%', 180, yPos)
        doc.setFont('helvetica', 'normal')

        yPos += 12
      })

      // Monthly Trends Section
      yPos += 15
      addSectionDivider(yPos, 'MONTHLY INCIDENT TRENDS', primaryBlue)
      yPos += 20

      const totalIncidents = incidentTrendData.reduce((sum, month) => sum + month.incidents, 0)
      const avgMonthly = (totalIncidents / incidentTrendData.length).toFixed(1)

      // Summary metrics
      addMetricCard(20, yPos, 80, 30, 'TOTAL INCIDENTS (YTD)', totalIncidents, primaryBlue)
      addMetricCard(110, yPos, 80, 30, 'MONTHLY AVERAGE', avgMonthly, successGreen)

      yPos += 45
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Monthly Breakdown:', 20, yPos)
      yPos += 10

      incidentTrendData.forEach((month, index) => {
        if (index % 4 === 0 && index > 0) yPos += 8 // New line every 4 months
        const x = 20 + (index % 4) * 45
        const trend = month.incidents > parseFloat(avgMonthly) ? '↗' : '↘'
        const trendColor = month.incidents > parseFloat(avgMonthly) ? dangerRed : successGreen

        doc.setTextColor(0, 0, 0)
        doc.text(`${month.date}: ${month.incidents}`, x, yPos)
        doc.setTextColor(...trendColor)
        doc.text(trend, x + 35, yPos)
      })

      // Recommendations box
      yPos += 20
      const lightBlue2 = primaryBlue.map(c => Math.min(255, c + 200))
      doc.setFillColor(...lightBlue2)
      doc.rect(20, yPos, 170, 35, 'F')

      doc.setTextColor(...primaryBlue)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('KEY RECOMMENDATIONS', 25, yPos + 10)

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('• Optimize P1 response team scheduling for 15% improvement', 25, yPos + 18)
      doc.text('• Implement predictive analytics for early threat detection', 25, yPos + 25)
      doc.text('• Enhance cross-training program to improve agent flexibility', 25, yPos + 32)

      // Page footer
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(8)
      doc.text('Confidential - Emergency Analytics Report', 20, 285)
      doc.text('Page 3 of 3', 180, 285)


      // PAGE 4: RESOURCE ALLOCATION & AGENT PERFORMANCE
      doc.addPage()
      addPremiumHeader('RESOURCE ALLOCATION & AGENT PERFORMANCE', [5, 150, 105]) // Green theme

// Agent Performance Metrics
      addSectionDivider(35, 'AGENT PERFORMANCE OVERVIEW', [5, 150, 105])

      const agentData = [
        { name: 'Team Alpha', cases: 127, resolution: 94.2, avgTime: 6.8, score: 'A+' },
        { name: 'Team Beta', cases: 98, resolution: 89.1, avgTime: 8.2, score: 'A' },
        { name: 'Team Gamma', cases: 156, resolution: 91.7, avgTime: 7.4, score: 'A+' },
        { name: 'Team Delta', cases: 89, resolution: 86.3, avgTime: 9.1, score: 'B+' },
        { name: 'Team Echo', cases: 103, resolution: 88.9, avgTime: 8.7, score: 'A-' }
      ]

      yPos = 55
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Team', 25, yPos)
      doc.text('Cases', 70, yPos)
      doc.text('Resolution %', 105, yPos)
      doc.text('Avg Time', 145, yPos)
      doc.text('Grade', 175, yPos)

      doc.setDrawColor(5, 150, 105)
      doc.line(20, yPos + 3, 190, yPos + 3)

      yPos += 15
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      agentData.forEach((agent, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(243, 244, 246)
          doc.rect(20, yPos - 8, 170, 14, 'F')
        }

        doc.setTextColor(0, 0, 0)
        doc.text(agent.name, 25, yPos)
        doc.text(agent.cases.toString(), 70, yPos)
        doc.text(agent.resolution + '%', 105, yPos)
        doc.text(agent.avgTime + ' min', 145, yPos)

        // Color-coded grade
        const gradeColor = agent.score.includes('A') ? [5, 150, 105] :
            agent.score.includes('B') ? [217, 119, 6] : [220, 38, 38]
        doc.setTextColor(...gradeColor)
        doc.setFont('helvetica', 'bold')
        doc.text(agent.score, 175, yPos)
        doc.setFont('helvetica', 'normal')

        yPos += 14
      })

// Resource Utilization
      yPos += 20
      addSectionDivider(yPos, 'RESOURCE UTILIZATION BREAKDOWN', [217, 119, 6])
      yPos += 20

      const resourceData = [
        { resource: 'Field Agents', allocated: 42, utilized: 38, efficiency: '90.5%' },
        { resource: 'Emergency Vehicles', allocated: 15, utilized: 12, efficiency: '80.0%' },
        { resource: 'Communication Systems', allocated: 8, utilized: 8, efficiency: '100%' },
        { resource: 'Medical Equipment', allocated: 25, utilized: 19, efficiency: '76.0%' },
        { resource: 'Technical Support', allocated: 12, utilized: 11, efficiency: '91.7%' }
      ]

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Resource Type', 25, yPos)
      doc.text('Allocated', 85, yPos)
      doc.text('Utilized', 125, yPos)
      doc.text('Efficiency', 165, yPos)

      doc.setDrawColor(217, 119, 6)
      doc.line(20, yPos + 3, 190, yPos + 3)

      yPos += 15
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      resourceData.forEach((resource, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(243, 244, 246)
          doc.rect(20, yPos - 8, 170, 14, 'F')
        }

        const efficiency = parseFloat(resource.efficiency)
        const efficiencyColor = efficiency >= 90 ? [5, 150, 105] :
            efficiency >= 75 ? [217, 119, 6] : [220, 38, 38]

        doc.setTextColor(0, 0, 0)
        doc.text(resource.resource, 25, yPos)
        doc.text(resource.allocated.toString(), 85, yPos)
        doc.text(resource.utilized.toString(), 125, yPos)

        doc.setTextColor(...efficiencyColor)
        doc.setFont('helvetica', 'bold')
        doc.text(resource.efficiency, 165, yPos)
        doc.setFont('helvetica', 'normal')

        yPos += 14
      })

// Page footer
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(8)
      doc.text('Confidential - Emergency Analytics Report', 20, 285)
      doc.text('Page 4 of 6', 180, 285)

// PAGE 5: SHIFT COVERAGE & STAFFING ANALYSIS
      doc.addPage()
      addPremiumHeader('SHIFT COVERAGE & STAFFING ANALYSIS', [217, 119, 6]) // Orange theme

// Shift Coverage Analysis
      addSectionDivider(35, 'SHIFT COVERAGE BREAKDOWN', [217, 119, 6])

      const shiftData = [
        { shift: 'Day Shift (06:00-14:00)', required: 20, assigned: 19, coverage: '95%', status: 'Optimal' },
        { shift: 'Evening Shift (14:00-22:00)', required: 18, assigned: 16, coverage: '88%', status: 'Needs +2' },
        { shift: 'Night Shift (22:00-06:00)', required: 14, assigned: 11, coverage: '78%', status: 'Critical' },
        { shift: 'Weekend Day', required: 16, assigned: 15, coverage: '93%', status: 'Good' },
        { shift: 'Weekend Night', required: 12, assigned: 9, coverage: '75%', status: 'Understaffed' }
      ]

      yPos = 55
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Shift Period', 25, yPos)
      doc.text('Required', 85, yPos)
      doc.text('Assigned', 125, yPos)
      doc.text('Coverage', 160, yPos)
      doc.text('Status', 185, yPos)

      doc.setDrawColor(217, 119, 6)
      doc.line(20, yPos + 3, 210, yPos + 3)

      yPos += 15
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      shiftData.forEach((shift, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(243, 244, 246)
          doc.rect(20, yPos - 8, 190, 14, 'F')
        }

        const coverage = parseFloat(shift.coverage)
        const statusColor = coverage >= 95 ? [5, 150, 105] :
            coverage >= 85 ? [217, 119, 6] : [220, 38, 38]

        doc.setTextColor(0, 0, 0)
        doc.text(shift.shift, 25, yPos)
        doc.text(shift.required.toString(), 85, yPos)
        doc.text(shift.assigned.toString(), 125, yPos)
        doc.text(shift.coverage, 160, yPos)

        doc.setTextColor(...statusColor)
        doc.setFont('helvetica', 'bold')
        doc.text(shift.status, 185, yPos)
        doc.setFont('helvetica', 'normal')

        yPos += 16
      })

// Staffing Recommendations
      yPos += 25
      addSectionDivider(yPos, 'STAFFING RECOMMENDATIONS', [59, 130, 246])
      yPos += 20

      const recommendations = [
        { priority: 'HIGH', action: 'Hire 3 additional night shift agents', timeline: '2 weeks', cost: '$45K/year' },
        { priority: 'MEDIUM', action: 'Cross-train 5 day shift agents for evening coverage', timeline: '1 month', cost: '$8K training' },
        { priority: 'LOW', action: 'Implement flexible scheduling system', timeline: '3 months', cost: '$15K setup' }
      ]

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Priority', 25, yPos)
      doc.text('Recommended Action', 60, yPos)
      doc.text('Timeline', 140, yPos)
      doc.text('Est. Cost', 175, yPos)

      doc.setDrawColor(59, 130, 246)
      doc.line(20, yPos + 3, 190, yPos + 3)

      yPos += 15
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      recommendations.forEach((rec, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(243, 244, 246)
          doc.rect(20, yPos - 8, 170, 16, 'F')
        }

        const priorityColor = rec.priority === 'HIGH' ? [220, 38, 38] :
            rec.priority === 'MEDIUM' ? [217, 119, 6] : [5, 150, 105]

        doc.setTextColor(...priorityColor)
        doc.setFont('helvetica', 'bold')
        doc.text(rec.priority, 25, yPos)

        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')

        // Split long action text
        const actionWords = rec.action.split(' ')
        if (actionWords.length > 6) {
          const line1 = actionWords.slice(0, 6).join(' ')
          const line2 = actionWords.slice(6).join(' ')
          doc.text(line1, 60, yPos - 3)
          doc.text(line2, 60, yPos + 5)
        } else {
          doc.text(rec.action, 60, yPos)
        }

        doc.text(rec.timeline, 140, yPos)
        doc.text(rec.cost, 175, yPos)

        yPos += 18
      })

// Performance Metrics Box
      yPos += 15
      const lightBlue = [59, 130, 246].map(c => Math.min(255, c + 200))
      doc.setFillColor(...lightBlue)
      doc.rect(20, yPos, 170, 40, 'F')

      doc.setTextColor(59, 130, 246)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('STAFFING EFFICIENCY METRICS', 25, yPos + 12)

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('• Overall Staffing Efficiency: 87.2% (Target: 90%)', 25, yPos + 22)
      doc.text('• Agent Utilization Rate: 83.4% (Industry Average: 78%)', 25, yPos + 29)
      doc.text('• Overtime Hours: 12.3% of total (Budget: 15%)', 25, yPos + 36)

// Page footer
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(8)
      doc.text('Confidential - Emergency Analytics Report', 20, 285)
      doc.text('Page 5 of 6', 180, 285)

// PAGE 6: DETAILED INCIDENT ANALYSIS & FORECASTING
      doc.addPage()
      addPremiumHeader('INCIDENT ANALYSIS & PREDICTIVE FORECASTING', [147, 51, 234]) // Purple theme

// Incident Category Deep Dive
      addSectionDivider(35, 'INCIDENT CATEGORY ANALYSIS', [147, 51, 234])

      const detailedIncidents = [
        { category: 'Cybersecurity', subcategory: 'Malware Detection', count: 23, severity: 'High', trend: '↗ +15%' },
        { category: 'Cybersecurity', subcategory: 'Phishing Attempts', count: 31, severity: 'Medium', trend: '↘ -8%' },
        { category: 'Physical Security', subcategory: 'Unauthorized Access', count: 12, severity: 'Critical', trend: '→ 0%' },
        { category: 'Physical Security', subcategory: 'Equipment Theft', count: 8, severity: 'High', trend: '↘ -12%' },
        { category: 'Infrastructure', subcategory: 'Power Outages', count: 15, severity: 'High', trend: '↗ +22%' },
        { category: 'Infrastructure', subcategory: 'Network Failures', count: 9, severity: 'Critical', trend: '↗ +33%' },
        { category: 'Medical Emergency', subcategory: 'Workplace Injury', count: 18, severity: 'Medium', trend: '↘ -5%' },
        { category: 'Fire Safety', subcategory: 'Alarm Triggers', count: 7, severity: 'Low', trend: '→ +2%' }
      ]

      yPos = 60
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Category', 25, yPos)
      doc.text('Subcategory', 70, yPos)
      doc.text('Count', 120, yPos)
      doc.text('Severity', 145, yPos)
      doc.text('Trend', 175, yPos)

      doc.setDrawColor(147, 51, 234)
      doc.line(20, yPos + 3, 190, yPos + 3)

      yPos += 10
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')

      detailedIncidents.forEach((incident, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(243, 244, 246)
          doc.rect(20, yPos - 6, 170, 10, 'F')
        }

        const severityColor = incident.severity === 'Critical' ? [220, 38, 38] :
            incident.severity === 'High' ? [217, 119, 6] :
                incident.severity === 'Medium' ? [59, 130, 246] : [5, 150, 105]

        const trendColor = incident.trend.includes('↗') ? [220, 38, 38] :
            incident.trend.includes('↘') ? [5, 150, 105] : [100, 100, 100]

        doc.setTextColor(0, 0, 0)
        doc.text(incident.category, 25, yPos)
        doc.text(incident.subcategory, 70, yPos)
        doc.text(incident.count.toString(), 120, yPos)

        doc.setTextColor(...severityColor)
        doc.setFont('helvetica', 'bold')
        doc.text(incident.severity, 145, yPos)

        doc.setTextColor(...trendColor)
        doc.text(incident.trend, 175, yPos)
        doc.setFont('helvetica', 'normal')

        yPos += 10
      })

// Predictive Analytics Section
      yPos += 15
      addSectionDivider(yPos, 'PREDICTIVE ANALYTICS & FORECASTING', [59, 130, 246])
      yPos += 25

// Risk Assessment Matrix
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('RISK ASSESSMENT MATRIX - NEXT 30 DAYS', 25, yPos)
      yPos += 15

      const riskPredictions = [
        { risk: 'Cyber Attack Surge', probability: '68%', impact: 'High', mitigation: 'Enhanced monitoring' },
        { risk: 'Infrastructure Failure', probability: '34%', impact: 'Critical', mitigation: 'Preventive maintenance' },
        { risk: 'Staff Shortage (Night)', probability: '82%', impact: 'Medium', mitigation: 'Recruit temp staff' },
        { risk: 'Equipment Overload', probability: '45%', impact: 'Medium', mitigation: 'Load balancing' }
      ]

      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Risk Factor', 25, yPos)
      doc.text('Probability', 80, yPos)
      doc.text('Impact', 120, yPos)
      doc.text('Recommended Action', 150, yPos)

      doc.setDrawColor(59, 130, 246)
      doc.line(20, yPos + 3, 190, yPos + 3)

      yPos += 10
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')

      riskPredictions.forEach((risk, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(243, 244, 246)
          doc.rect(20, yPos - 6, 170, 10, 'F')
        }

        const probColor = parseFloat(risk.probability) >= 70 ? [220, 38, 38] :
            parseFloat(risk.probability) >= 50 ? [217, 119, 6] : [5, 150, 105]

        const impactColor = risk.impact === 'Critical' ? [220, 38, 38] :
            risk.impact === 'High' ? [217, 119, 6] : [59, 130, 246]

        doc.setTextColor(0, 0, 0)
        doc.text(risk.risk, 25, yPos)

        doc.setTextColor(...probColor)
        doc.setFont('helvetica', 'bold')
        doc.text(risk.probability, 80, yPos)

        doc.setTextColor(...impactColor)
        doc.text(risk.impact, 120, yPos)

        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.text(risk.mitigation, 150, yPos)

        yPos += 10
      })

// Strategic Recommendations
      yPos += 20
      const lightPurple = [147, 51, 234].map(c => Math.min(255, c + 200))
      doc.setFillColor(...lightPurple)
      doc.rect(20, yPos, 170, 50, 'F')

      doc.setTextColor(147, 51, 234)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('STRATEGIC RECOMMENDATIONS', 25, yPos + 12)

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('SHORT TERM (1-3 months):', 25, yPos + 22)
      doc.text('• Implement AI-powered threat detection system', 25, yPos + 29)
      doc.text('• Increase night shift staffing by 25%', 25, yPos + 36)

      doc.text('LONG TERM (6-12 months):', 25, yPos + 45)
      doc.text('• Deploy predictive maintenance protocols', 25, yPos + 52)
      doc.text('• Establish cross-training program for skill diversification', 25, yPos + 59)

// Compliance & Audit Trail
      yPos += 70
      addSectionDivider(yPos, 'COMPLIANCE & AUDIT INFORMATION', [220, 38, 38])
      yPos += 15

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('Report Generation Details:', 25, yPos)
      doc.text(`• Generated by: Emergency Analytics System v2.1`, 25, yPos + 8)
      doc.text(`• Data Sources: 5 integrated systems, ${reportData.summary.totalCases} validated records`, 25, yPos + 15)
      doc.text(`• Accuracy Rating: 99.2% (verified against manual audits)`, 25, yPos + 22)
      doc.text(`• Next Scheduled Report: ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()}`, 25, yPos + 29)

// Page footer
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(8)
      doc.text('Confidential - Emergency Analytics Report', 20, 285)
      doc.text('Page 5 of 5', 180, 285)


      // Save the PDF
      doc.save(`Emergency_Analytics_Report_${reportData.generatedDate.replace(/\//g, '-')}.pdf`)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF report. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToHTML = () => {
    setIsExporting(true)
    try {
      const reportData = generateReportData()

      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
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
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .summary-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #4a5568;
            font-size: 1.1em;
        }
        .summary-card .value {
            font-size: 2.5em;
            font-weight: 700;
            color: #2d3748;
            margin: 0;
        }
        .section {
            background: white;
            margin-bottom: 30px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .section-header {
            background: #f7fafc;
            padding: 20px 30px;
            border-bottom: 1px solid #e2e8f0;
        }
        .section-header h2 {
            margin: 0;
            color: #2d3748;
            font-size: 1.5em;
        }
        .section-content {
            padding: 30px;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .data-table th,
        .data-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        .data-table th {
            background-color: #f7fafc;
            font-weight: 600;
            color: #4a5568;
        }
        .data-table tr:hover {
            background-color: #f7fafc;
        }
        .metric-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .metric-row:last-child {
            border-bottom: none;
        }
        .metric-label {
            font-weight: 500;
            color: #4a5568;
        }
        .metric-value {
            font-weight: 700;
            color: #2d3748;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            color: #718096;
            font-size: 0.9em;
        }
        @media print {
            body { background-color: white; }
            .section { box-shadow: none; border: 1px solid #e2e8f0; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${reportData.title}</h1>
        <p>Generated on ${reportData.generatedDate} at ${reportData.generatedTime}</p>
        <p>Report Period: ${reportData.period}</p>
    </div>

    <div class="summary-grid">
        <div class="summary-card">
            <h3>Total Cases</h3>
            <div class="value">${reportData.summary.totalCases}</div>
        </div>
        <div class="summary-card">
            <h3>Resolution Rate</h3>
            <div class="value">${reportData.summary.resolutionRate}</div>
        </div>
        <div class="summary-card">
            <h3>Avg Response Time</h3>
            <div class="value">${reportData.summary.avgResponseTime}</div>
        </div>
        <div class="summary-card">
            <h3>Active Agents</h3>
            <div class="value">${reportData.summary.activeAgents}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-header">
            <h2>Threat Distribution</h2>
        </div>
        <div class="section-content">
            <p>Breakdown of security threats by severity level:</p>
            ${reportData.threatDistribution.map(threat => `
                <div class="metric-row">
                    <span class="metric-label">${threat.name}</span>
                    <span class="metric-value">${threat.value} cases</span>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <div class="section-header">
            <h2>Emergency Types</h2>
        </div>
        <div class="section-content">
            <p>Distribution of emergency incidents by category:</p>
            ${reportData.emergencyTypes.map(type => `
                <div class="metric-row">
                    <span class="metric-label">${type.type}</span>
                    <span class="metric-value">${type.count} incidents</span>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <div class="section-header">
            <h2>Response Time Metrics</h2>
        </div>
        <div class="section-content">
            <p>Average response times by priority level and daily breakdown:</p>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Priority 1 (Critical)</th>
                        <th>Priority 2 (High)</th>
                        <th>Priority 3 (Medium)</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.responseMetrics.map(day => `
                        <tr>
                            <td>${day.day}</td>
                            <td>${day.p1} minutes</td>
                            <td>${day.p2} minutes</td>
                            <td>${day.p3} minutes</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-header">
            <h2>Monthly Incident Trends</h2>
        </div>
        <div class="section-content">
            <p>Incident count trends over the past 12 months:</p>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Incidents</th>
                        <th>Trend</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.incidentTrend.map((month, index) => {
        const prevMonth = index > 0 ? reportData.incidentTrend[index - 1].incidents : month.incidents
        const trend = month.incidents > prevMonth ? '↑' : month.incidents < prevMonth ? '↓' : '→'
        const trendColor = month.incidents > prevMonth ? '#e53e3e' : month.incidents < prevMonth ? '#38a169' : '#718096'
        return `
                            <tr>
                                <td>${month.date}</td>
                                <td>${month.incidents}</td>
                                <td style="color: ${trendColor}; font-weight: bold;">${trend}</td>
                            </tr>
                        `
      }).join('')}
                </tbody>
            </table>
        </div>
    </div>

    <div class="footer">
        <p>This report was automatically generated by the Emergency Management Analytics System.</p>
        <p>For questions or additional analysis, please contact the operations team.</p>
    </div>
</body>
</html>`

      // Create and download HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Emergency_Analytics_Report_${reportData.generatedDate.replace(/\//g, '-')}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error generating HTML:', error)
      alert('Error generating HTML report. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Analytics & Reporting</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isExporting}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export Report'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToHTML} className="cursor-pointer">
                <File className="mr-2 h-4 w-4" />
                Export as HTML
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                    <p className="text-muted-foreground italic">
                      Coming Soon...
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
                    <p className="text-muted-foreground italic">
                      Coming Soon...
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