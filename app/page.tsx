"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Plus, Search, MessageSquare, Settings, Zap, ImageIcon, Code, Brain, Palette } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { AgentManagementDialog } from "@/components/agent-management-dialog"

// Mock agent data
const initialAgents = [
  {
    id: "1",
    name: "Code Assistant",
    description: "Helps with programming tasks and code review",
    type: "text" as const,
    status: "active" as const,
    avatar: "/robot-coding.jpg",
    lastUsed: "2 hours ago",
    conversations: 24,
    icon: Code,
    systemPrompt:
      "You are a helpful coding assistant. Help users with programming tasks, code review, and technical questions.",
    tools: ["code_execution", "web_search", "file_analysis"],
  },
  {
    id: "2",
    name: "Image Generator",
    description: "Creates stunning visuals and artwork",
    type: "image" as const,
    status: "active" as const,
    avatar: "/ai-art-generator.jpg",
    lastUsed: "1 hour ago",
    conversations: 18,
    icon: ImageIcon,
    systemPrompt: "You are an AI image generator. Create beautiful, detailed images based on user descriptions.",
    tools: ["image_generation", "style_transfer"],
  },
  {
    id: "3",
    name: "Research Assistant",
    description: "Analyzes data and provides insights",
    type: "text" as const,
    status: "idle" as const,
    avatar: "/research-assistant.png",
    lastUsed: "5 hours ago",
    conversations: 12,
    icon: Brain,
    systemPrompt: "You are a research assistant. Help users analyze data, find information, and provide insights.",
    tools: ["web_search", "data_analysis", "document_processing"],
  },
  {
    id: "4",
    name: "Design Helper",
    description: "UI/UX design guidance and feedback",
    type: "text" as const,
    status: "active" as const,
    avatar: "/design-assistant.png",
    lastUsed: "30 minutes ago",
    conversations: 31,
    icon: Palette,
    systemPrompt:
      "You are a UI/UX design expert. Provide guidance on design principles, user experience, and visual aesthetics.",
    tools: ["design_analysis", "color_palette", "layout_suggestions"],
  },
]

export default function AgentHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [agents, setAgents] = useState(initialAgents)
  const [isManagementOpen, setIsManagementOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<string | null>(null)

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(agentId)
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setSelectedAgent(null)
  }

  const handleCreateAgent = () => {
    setEditingAgent(null)
    setIsManagementOpen(true)
  }

  const handleEditAgent = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingAgent(agentId)
    setIsManagementOpen(true)
  }

  const handleSaveAgent = (agentData: any) => {
    if (editingAgent) {
      // Update existing agent
      setAgents((prev) => prev.map((agent) => (agent.id === editingAgent ? { ...agent, ...agentData } : agent)))
    } else {
      // Create new agent
      const newAgent = {
        ...agentData,
        id: Date.now().toString(),
        lastUsed: "Never",
        conversations: 0,
      }
      setAgents((prev) => [...prev, newAgent])
    }
    setIsManagementOpen(false)
    setEditingAgent(null)
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== agentId))
    setIsManagementOpen(false)
    setEditingAgent(null)
  }

  const selectedAgentData = selectedAgent ? agents.find((agent) => agent.id === selectedAgent) : null
  const editingAgentData = editingAgent ? agents.find((agent) => agent.id === editingAgent) : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-lg">
                <Zap className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Agent Hub</h1>
                <p className="text-sm text-muted-foreground">Manage and interact with your AI agents</p>
              </div>
            </div>
            <Button onClick={handleCreateAgent} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => {
            const IconComponent = agent.icon
            return (
              <Card
                key={agent.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-border bg-card"
                onClick={() => handleAgentClick(agent.id)}
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
                    <CardDescription className="text-sm text-muted-foreground mt-1">
                      {agent.description}
                    </CardDescription>
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border bg-transparent"
                      onClick={(e) => handleEditAgent(agent.id, e)}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No agents found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or create a new agent to get started.
            </p>
            <Button onClick={handleCreateAgent} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Agent
            </Button>
          </div>
        )}
      </main>

      {/* Chat Interface Overlay */}
      {isChatOpen && selectedAgentData && <ChatInterface agent={selectedAgentData} onClose={handleCloseChat} />}

      {isManagementOpen && (
        <AgentManagementDialog
          agent={editingAgentData}
          onSave={handleSaveAgent}
          onDelete={editingAgent ? () => handleDeleteAgent(editingAgent) : undefined}
          onClose={() => {
            setIsManagementOpen(false)
            setEditingAgent(null)
          }}
        />
      )}
    </div>
  )
}
