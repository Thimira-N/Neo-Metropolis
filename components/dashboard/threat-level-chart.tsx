"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Critical", value: 8, color: "hsl(var(--destructive))" },
  { name: "High", value: 15, color: "hsl(var(--chart-1))" },
  { name: "Medium", value: 27, color: "hsl(var(--chart-4))" },
  { name: "Low", value: 42, color: "hsl(var(--chart-2))" }
]

export function ThreatLevelChart() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Threat Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
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
  )
}