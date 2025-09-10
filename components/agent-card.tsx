"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Settings } from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  type: "text" | "image"
  status: "active" | "idle"
  avatar: string
  lastUsed: string
  conversations: number
  icon: React.ComponentType<{ className?: string }>
}

interface AgentCardProps {
  agent: Agent
  onClick: (agentId: string) => void
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const IconComponent = agent.icon

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-border bg-card"
      onClick={() => onClick(agent.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Avatar className="w-12 h-12">
            <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
            <AvatarFallback className="bg-secondary">
              <IconComponent className="w-6 h-6 text-secondary-foreground" />
            </AvatarFallback>
          </Avatar>
          <Badge
            variant={agent.status === "active" ? "default" : "secondary"}
            className={agent.status === "active" ? "bg-accent text-accent-foreground" : ""}
          >
            {agent.status}
          </Badge>
        </div>
        <div>
          <CardTitle className="text-lg text-card-foreground">{agent.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">{agent.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last used: {agent.lastUsed}</span>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{agent.conversations}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            <MessageSquare className="w-3 h-3 mr-1" />
            Chat
          </Button>
          <Button size="sm" variant="outline" className="border-border bg-transparent">
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
