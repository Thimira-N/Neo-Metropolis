"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const data = [
  { type: "Cyber", count: 12, color: "hsl(var(--chart-2))" },
  { type: "Physical", count: 8, color: "hsl(var(--chart-1))" },
  { type: "Infra", count: 5, color: "hsl(var(--chart-3))" },
  { type: "Medical", count: 7, color: "hsl(var(--chart-4))" },
  { type: "Fire", count: 3, color: "hsl(var(--chart-5))" }
]

export function EmergencyStats() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Emergency Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="type" type="category" width={70} />
              <Tooltip 
                formatter={(value) => [`${value} active cases`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}