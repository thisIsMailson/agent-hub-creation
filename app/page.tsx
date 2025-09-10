"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MessageSquare, Zap, ImageIcon, Code, Brain, Palette, X, Save, Edit3 } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"

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
  const [isCreating, setIsCreating] = useState(false)
  const [editingAgent, setEditingAgent] = useState<string | null>(null)

  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    type: "text" as "text" | "image",
    systemPrompt: "",
  })

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAgentClick = (agentId: string) => {
    if (editingAgent === agentId) return // Don't open chat if editing
    setSelectedAgent(agentId)
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setSelectedAgent(null)
  }

  const handleCreateAgent = () => {
    setIsCreating(true)
    setEditingAgent(null)
  }

  const handleSaveNewAgent = () => {
    if (!newAgent.name.trim() || !newAgent.description.trim()) return

    const agent = {
      ...newAgent,
      id: Date.now().toString(),
      status: "active" as const,
      avatar: "",
      lastUsed: "Never",
      conversations: 0,
      icon: newAgent.type === "image" ? ImageIcon : Code,
      tools: newAgent.type === "image" ? ["image_generation"] : ["web_search"],
    }

    setAgents((prev) => [...prev, agent])
    setNewAgent({ name: "", description: "", type: "text", systemPrompt: "" })
    setIsCreating(false)
  }

  const handleCancelCreate = () => {
    setNewAgent({ name: "", description: "", type: "text", systemPrompt: "" })
    setIsCreating(false)
  }

  const handleEditAgent = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingAgent(editingAgent === agentId ? null : agentId)
    setIsCreating(false)
  }

  const selectedAgentData = selectedAgent ? agents.find((agent) => agent.id === selectedAgent) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#24546B] to-[#1e4a5f] rounded-xl shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#24546B] to-[#1e4a5f] bg-clip-text text-transparent">
                  Agent Hub
                </h1>
                <p className="text-slate-600 font-medium">Manage and interact with your AI agents</p>
              </div>
            </div>
            <Button
              onClick={handleCreateAgent}
              className="bg-gradient-to-r from-[#24546B] to-[#1e4a5f] hover:from-[#1e4a5f] hover:to-[#24546B] text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Agent
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-8">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-[#24546B] focus:ring-[#24546B]/20 rounded-xl shadow-sm"
            />
          </div>
        </div>

        {isCreating && (
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#24546B]">Create New Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter agent name"
                    className="bg-white/60"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newAgent.type}
                    onValueChange={(value: "text" | "image") => setNewAgent((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="bg-white/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Assistant</SelectItem>
                      <SelectItem value="image">Image Generator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description"
                  className="bg-white/60"
                />
              </div>
              <div>
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  value={newAgent.systemPrompt}
                  onChange={(e) => setNewAgent((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                  placeholder="Instructions for the agent..."
                  className="bg-white/60 min-h-[80px]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSaveNewAgent} className="bg-[#24546B] hover:bg-[#1e4a5f]">
                  <Save className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
                <Button variant="outline" onClick={handleCancelCreate}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => {
            const IconComponent = agent.icon
            const isEditing = editingAgent === agent.id

            return (
              <Card
                key={agent.id}
                className={`transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-slate-200 ${
                  !isEditing ? "cursor-pointer" : ""
                } ${isEditing ? "ring-2 ring-[#24546B]/30" : ""}`}
                onClick={() => !isEditing && handleAgentClick(agent.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Avatar className="w-14 h-14 ring-2 ring-white shadow-md">
                      <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#24546B] to-[#1e4a5f] text-white">
                        <IconComponent className="w-7 h-7" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={agent.status === "active" ? "default" : "secondary"}
                        className={
                          agent.status === "active"
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0"
                            : "bg-slate-100 text-slate-600"
                        }
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#24546B] font-semibold">{agent.name}</CardTitle>
                    <CardDescription className="text-slate-600 mt-1 font-medium">{agent.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span>Last used: {agent.lastUsed}</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{agent.conversations}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-[#24546B] to-[#1e4a5f] hover:from-[#1e4a5f] hover:to-[#24546B] text-white shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAgentClick(agent.id)
                      }}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Chat
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`border-slate-200 hover:bg-slate-50 ${isEditing ? "bg-[#24546B] text-white" : ""}`}
                      onClick={(e) => handleEditAgent(agent.id, e)}
                    >
                      {isEditing ? <X className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[#24546B]/10 to-[#1e4a5f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-[#24546B]" />
            </div>
            <h3 className="text-xl font-semibold text-[#24546B] mb-3">No agents found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Try adjusting your search or create a new agent to get started with your AI assistant collection.
            </p>
            <Button
              onClick={handleCreateAgent}
              className="bg-gradient-to-r from-[#24546B] to-[#1e4a5f] hover:from-[#1e4a5f] hover:to-[#24546B] text-white shadow-lg px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Agent
            </Button>
          </div>
        )}
      </main>

      {/* Chat Interface Overlay */}
      {isChatOpen && selectedAgentData && <ChatInterface agent={selectedAgentData} onClose={handleCloseChat} />}
    </div>
  )
}
