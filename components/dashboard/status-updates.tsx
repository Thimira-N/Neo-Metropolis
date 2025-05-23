"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StatusUpdate } from "@/types"
import { PriorityQueue } from "@/lib/data-structures/PriorityQueue"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

// Sample data for status updates
const initialUpdates: StatusUpdate[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    message: "Emergency response system back online",
    type: "success",
    priority: 3,
    source: "Infrastructure",
    acknowledged: false
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    message: "Critical breach detected in north sector",
    type: "error",
    priority: 1,
    source: "Security",
    acknowledged: false
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    message: "Citizen database sync completed",
    type: "info",
    priority: 4,
    source: "Database",
    acknowledged: true
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    message: "Agent deployment authorization required",
    type: "warning",
    priority: 2,
    source: "Administration",
    acknowledged: false
  }
]

export function StatusUpdates() {
  const [updates, setUpdates] = useState<StatusUpdate[]>([])
  const [queue] = useState(() => {
    // Initialize priority queue with sample data
    const queue = new PriorityQueue<StatusUpdate>((a, b) => a - b)
    initialUpdates.forEach(update => {
      queue.enqueue(update, update.priority)
    })
    return queue
  })
  
  useEffect(() => {
    // Dequeue all updates initially
    const initialDequeued: StatusUpdate[] = []
    while (!queue.isEmpty()) {
      const update = queue.dequeue()
      if (update) initialDequeued.push(update)
    }
    // Sort by timestamp (latest first) and priority
    const sorted = initialDequeued.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
    setUpdates(sorted)
    
    // Simulated real-time updates
    const interval = setInterval(() => {
      // Occasionally add a new update
      if (Math.random() > 0.7) {
        const newUpdate: StatusUpdate = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          message: [
            "Network anomaly detected in sector 7",
            "Unauthorized access attempt blocked",
            "Traffic signal malfunction on Main St",
            "Facial recognition system update completed",
            "Backup power systems engaged"
          ][Math.floor(Math.random() * 5)],
          type: ["info", "warning", "error", "success"][Math.floor(Math.random() * 4)] as any,
          priority: Math.floor(Math.random() * 5) + 1,
          source: ["Security", "Infrastructure", "Database", "Surveillance"][Math.floor(Math.random() * 4)],
          acknowledged: false
        }
        
        setUpdates(prev => [newUpdate, ...prev].slice(0, 8))
      }
    }, 8000)
    
    return () => clearInterval(interval)
  }, [queue])
  
  // Function to get status color
  const getStatusColor = (type: string) => {
    switch (type) {
      case "info": return "bg-blue-500"
      case "warning": return "bg-amber-500"
      case "error": return "bg-red-500"
      case "success": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">System Status Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {updates.map(update => (
              <div key={update.id} className="flex gap-3 text-sm">
                <div className="relative mt-1">
                  <div className={cn("h-2 w-2 rounded-full", getStatusColor(update.type))} />
                  <div className="absolute h-full w-px bg-border ml-1 top-3" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{update.message}</p>
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      update.priority === 1 ? "bg-red-500/20 text-red-500" :
                      update.priority === 2 ? "bg-amber-500/20 text-amber-500" :
                      "bg-muted text-muted-foreground"
                    )}>
                      P{update.priority}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex gap-2">
                      <span>{update.source}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(update.timestamp), { addSuffix: true })}</span>
                    </div>
                    {update.acknowledged && <span>✓ Acknowledged</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}