"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentCustomizationPanel } from "@/components/agent-customization-panel"
import { X, Save, Trash2, Code, ImageIcon, Brain, Palette, Bot, Zap } from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  type: "text" | "image"
  status: "active" | "idle"
  avatar: string
  systemPrompt: string
  tools: string[]
  icon: React.ComponentType<{ className?: string }>
}

interface AgentManagementDialogProps {
  agent?: Agent | null
  onSave: (agentData: Partial<Agent>) => void
  onDelete?: () => void
  onClose: () => void
}

const availableIcons = [
  { name: "Code", component: Code },
  { name: "Image", component: ImageIcon },
  { name: "Brain", component: Brain },
  { name: "Palette", component: Palette },
  { name: "Bot", component: Bot },
  { name: "Zap", component: Zap },
]

const availableTools = [
  { id: "web_search", name: "Web Search", description: "Search the internet for information" },
  { id: "code_execution", name: "Code Execution", description: "Execute and analyze code" },
  { id: "file_analysis", name: "File Analysis", description: "Analyze and process files" },
  { id: "image_generation", name: "Image Generation", description: "Generate images from text" },
  { id: "data_analysis", name: "Data Analysis", description: "Analyze and visualize data" },
  { id: "document_processing", name: "Document Processing", description: "Process and extract from documents" },
  { id: "style_transfer", name: "Style Transfer", description: "Apply artistic styles to images" },
  { id: "color_palette", name: "Color Palette", description: "Generate color schemes" },
  { id: "layout_suggestions", name: "Layout Suggestions", description: "Suggest UI/UX layouts" },
  { id: "design_analysis", name: "Design Analysis", description: "Analyze design patterns" },
]

// Default configuration for new agents
const defaultAgentConfig = {
  modelSettings: {
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  },
  behaviorSettings: {
    responseStyle: "friendly",
    verbosity: "balanced",
    creativity: "moderate",
    formality: "neutral",
  },
  mcpTools: [
    {
      id: "web-search",
      name: "Web Search",
      description: "Search the internet for current information",
      endpoint: "https://api.example.com/search",
      enabled: true,
      parameters: { maxResults: 10, safeSearch: true },
    },
  ],
  promptTemplates: [
    {
      id: "helpful-assistant",
      name: "Helpful Assistant",
      template:
        "You are a helpful assistant named {{agentName}}. {{customInstructions}} Always be {{responseStyle}} and {{verbosity}} in your responses.",
      variables: ["agentName", "customInstructions", "responseStyle", "verbosity"],
    },
  ],
  customInstructions: "",
  memorySettings: {
    contextWindow: 8000,
    rememberConversations: true,
    personalityConsistency: true,
  },
}

export function AgentManagementDialog({ agent, onSave, onDelete, onClose }: AgentManagementDialogProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState({
    name: agent?.name || "",
    description: agent?.description || "",
    type: agent?.type || ("text" as "text" | "image"),
    status: agent?.status || ("active" as "active" | "idle"),
    avatar: agent?.avatar || "",
    systemPrompt: agent?.systemPrompt || "",
    tools: agent?.tools || [],
    iconName: availableIcons.find((icon) => icon.component === agent?.icon)?.name || "Bot",
  })

  const [agentConfig, setAgentConfig] = useState(defaultAgentConfig)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Agent name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.systemPrompt.trim()) {
      newErrors.systemPrompt = "System prompt is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const selectedIcon = availableIcons.find((icon) => icon.name === formData.iconName)

    onSave({
      ...formData,
      icon: selectedIcon?.component || Bot,
      // Include advanced configuration
      config: agentConfig,
    })
  }

  const handleToolToggle = (toolId: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(toolId) ? prev.tools.filter((t) => t !== toolId) : [...prev.tools, toolId],
    }))
  }

  const selectedIconComponent = availableIcons.find((icon) => icon.name === formData.iconName)?.component || Bot

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-card-foreground">{agent ? "Edit Agent" : "Create New Agent"}</CardTitle>
            <Button size="sm" variant="outline" onClick={onClose} className="border-border bg-transparent">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-border px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Config</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </div>

            {/* Basic Settings Tab */}
            <TabsContent value="basic" className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Agent Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter agent name"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-foreground">
                      Agent Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "text" | "image") => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Assistant</SelectItem>
                        <SelectItem value="image">Image Generator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what this agent does"
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-foreground">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "idle") => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon" className="text-foreground">
                      Icon
                    </Label>
                    <Select
                      value={formData.iconName}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, iconName: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => {
                          const IconComponent = icon.component
                          return (
                            <SelectItem key={icon.name} value={icon.name}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                {icon.name}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Avatar Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Avatar Preview</h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={formData.avatar || "/placeholder.svg"} alt="Agent avatar" />
                      <AvatarFallback className="bg-secondary">
                        {React.createElement(selectedIconComponent, { className: "w-8 h-8 text-secondary-foreground" })}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Label htmlFor="avatar" className="text-foreground">
                        Avatar URL (optional)
                      </Label>
                      <Input
                        id="avatar"
                        value={formData.avatar}
                        onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>
                </div>

                {/* System Prompt */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">System Prompt</h3>
                  <div className="space-y-2">
                    <Label htmlFor="systemPrompt" className="text-foreground">
                      Instructions for the agent's behavior
                    </Label>
                    <Textarea
                      id="systemPrompt"
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                      placeholder="You are a helpful assistant that..."
                      className={`min-h-[100px] ${errors.systemPrompt ? "border-destructive" : ""}`}
                    />
                    {errors.systemPrompt && <p className="text-sm text-destructive">{errors.systemPrompt}</p>}
                  </div>
                </div>

                {/* Tools & Capabilities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Tools & Capabilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableTools.map((tool) => (
                      <div key={tool.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                        <Checkbox
                          id={tool.id}
                          checked={formData.tools.includes(tool.id)}
                          onCheckedChange={() => handleToolToggle(tool.id)}
                        />
                        <div className="space-y-1">
                          <Label htmlFor={tool.id} className="text-sm font-medium text-foreground cursor-pointer">
                            {tool.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{tool.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Advanced Configuration Tab */}
            <TabsContent value="advanced" className="p-0">
              <AgentCustomizationPanel
                agentId={agent?.id || "new"}
                config={agentConfig}
                onConfigChange={setAgentConfig}
                onSave={() => {}}
                onCancel={() => {}}
              />
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Agent Preview</h3>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={formData.avatar || "/placeholder.svg"} alt="Agent avatar" />
                        <AvatarFallback className="bg-secondary">
                          {React.createElement(selectedIconComponent, {
                            className: "w-8 h-8 text-secondary-foreground",
                          })}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-xl font-semibold text-foreground">{formData.name || "Unnamed Agent"}</h4>
                        <p className="text-muted-foreground">{formData.description || "No description provided"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">System Prompt:</p>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-mono">{formData.systemPrompt || "No system prompt configured"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between p-6 border-t border-border">
            <div>
              {onDelete && (
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Agent
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="border-border bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Save className="w-4 h-4 mr-2" />
                {agent ? "Update Agent" : "Create Agent"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
