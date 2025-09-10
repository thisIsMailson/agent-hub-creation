"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Code, Palette, Zap, Download, Upload, Plus, X, Copy, RefreshCw, AlertCircle } from "lucide-react"

interface MCPTool {
  id: string
  name: string
  description: string
  endpoint: string
  enabled: boolean
  parameters: Record<string, any>
}

interface PromptTemplate {
  id: string
  name: string
  template: string
  variables: string[]
}

interface AgentConfig {
  modelSettings: {
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
  }
  behaviorSettings: {
    responseStyle: string
    verbosity: string
    creativity: string
    formality: string
  }
  mcpTools: MCPTool[]
  promptTemplates: PromptTemplate[]
  customInstructions: string
  memorySettings: {
    contextWindow: number
    rememberConversations: boolean
    personalityConsistency: boolean
  }
}

interface AgentCustomizationPanelProps {
  agentId: string
  config: AgentConfig
  onConfigChange: (config: AgentConfig) => void
  onSave: () => void
  onCancel: () => void
}

const defaultMCPTools: MCPTool[] = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the internet for current information",
    endpoint: "https://api.example.com/search",
    enabled: true,
    parameters: { maxResults: 10, safeSearch: true },
  },
  {
    id: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute and analyze code in multiple languages",
    endpoint: "https://api.example.com/code",
    enabled: false,
    parameters: { timeout: 30, languages: ["python", "javascript", "typescript"] },
  },
  {
    id: "image-analyzer",
    name: "Image Analyzer",
    description: "Analyze and describe images",
    endpoint: "https://api.example.com/vision",
    enabled: false,
    parameters: { maxImageSize: "10MB", formats: ["jpg", "png", "webp"] },
  },
]

const defaultPromptTemplates: PromptTemplate[] = [
  {
    id: "helpful-assistant",
    name: "Helpful Assistant",
    template:
      "You are a helpful assistant named {{agentName}}. {{customInstructions}} Always be {{responseStyle}} and {{verbosity}} in your responses.",
    variables: ["agentName", "customInstructions", "responseStyle", "verbosity"],
  },
  {
    id: "creative-writer",
    name: "Creative Writer",
    template:
      "You are {{agentName}}, a creative writing assistant. Your writing style is {{creativity}} and {{formality}}. {{customInstructions}}",
    variables: ["agentName", "creativity", "formality", "customInstructions"],
  },
  {
    id: "technical-expert",
    name: "Technical Expert",
    template:
      "You are {{agentName}}, a technical expert. Provide {{verbosity}} explanations with a {{formality}} tone. {{customInstructions}}",
    variables: ["agentName", "verbosity", "formality", "customInstructions"],
  },
]

export function AgentCustomizationPanel({
  agentId,
  config,
  onConfigChange,
  onSave,
  onCancel,
}: AgentCustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState("model")
  const [newMCPTool, setNewMCPTool] = useState<Partial<MCPTool>>({})
  const [showAddTool, setShowAddTool] = useState(false)

  const updateConfig = (updates: Partial<AgentConfig>) => {
    onConfigChange({ ...config, ...updates })
  }

  const updateModelSettings = (updates: Partial<AgentConfig["modelSettings"]>) => {
    updateConfig({
      modelSettings: { ...config.modelSettings, ...updates },
    })
  }

  const updateBehaviorSettings = (updates: Partial<AgentConfig["behaviorSettings"]>) => {
    updateConfig({
      behaviorSettings: { ...config.behaviorSettings, ...updates },
    })
  }

  const updateMemorySettings = (updates: Partial<AgentConfig["memorySettings"]>) => {
    updateConfig({
      memorySettings: { ...config.memorySettings, ...updates },
    })
  }

  const toggleMCPTool = (toolId: string) => {
    const updatedTools = config.mcpTools.map((tool) =>
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool,
    )
    updateConfig({ mcpTools: updatedTools })
  }

  const addMCPTool = () => {
    if (newMCPTool.name && newMCPTool.endpoint) {
      const tool: MCPTool = {
        id: Date.now().toString(),
        name: newMCPTool.name,
        description: newMCPTool.description || "",
        endpoint: newMCPTool.endpoint,
        enabled: true,
        parameters: {},
      }
      updateConfig({ mcpTools: [...config.mcpTools, tool] })
      setNewMCPTool({})
      setShowAddTool(false)
    }
  }

  const removeMCPTool = (toolId: string) => {
    const updatedTools = config.mcpTools.filter((tool) => tool.id !== toolId)
    updateConfig({ mcpTools: updatedTools })
  }

  const exportConfig = () => {
    const configJson = JSON.stringify(config, null, 2)
    const blob = new Blob([configJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `agent-${agentId}-config.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string)
          onConfigChange(importedConfig)
        } catch (error) {
          console.error("Failed to import config:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agent Customization</h2>
          <p className="text-muted-foreground">Configure advanced settings and capabilities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportConfig} className="border-border bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="border-border bg-transparent">
            <Upload className="w-4 h-4 mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importConfig}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="model">Model Settings</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="tools">MCP Tools</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
        </TabsList>

        {/* Model Settings Tab */}
        <TabsContent value="model" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Model Parameters
              </CardTitle>
              <CardDescription>Fine-tune the AI model's behavior and response characteristics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Temperature: {config.modelSettings.temperature}</Label>
                  <Slider
                    value={[config.modelSettings.temperature]}
                    onValueChange={([value]) => updateModelSettings({ temperature: value })}
                    max={2}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls randomness (0 = deterministic, 2 = very creative)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Max Tokens: {config.modelSettings.maxTokens}</Label>
                  <Slider
                    value={[config.modelSettings.maxTokens]}
                    onValueChange={([value]) => updateModelSettings({ maxTokens: value })}
                    max={4000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Maximum length of response</p>
                </div>

                <div className="space-y-2">
                  <Label>Top P: {config.modelSettings.topP}</Label>
                  <Slider
                    value={[config.modelSettings.topP]}
                    onValueChange={([value]) => updateModelSettings({ topP: value })}
                    max={1}
                    min={0}
                    step={0.05}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Controls diversity via nucleus sampling</p>
                </div>

                <div className="space-y-2">
                  <Label>Frequency Penalty: {config.modelSettings.frequencyPenalty}</Label>
                  <Slider
                    value={[config.modelSettings.frequencyPenalty]}
                    onValueChange={([value]) => updateModelSettings({ frequencyPenalty: value })}
                    max={2}
                    min={-2}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Reduces repetition of frequent tokens</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Settings Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Personality & Style
              </CardTitle>
              <CardDescription>Define how your agent communicates and behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Response Style</Label>
                  <Select
                    value={config.behaviorSettings.responseStyle}
                    onValueChange={(value) => updateBehaviorSettings({ responseStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="analytical">Analytical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Verbosity</Label>
                  <Select
                    value={config.behaviorSettings.verbosity}
                    onValueChange={(value) => updateBehaviorSettings({ verbosity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Creativity Level</Label>
                  <Select
                    value={config.behaviorSettings.creativity}
                    onValueChange={(value) => updateBehaviorSettings({ creativity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="highly-creative">Highly Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Formality</Label>
                  <Select
                    value={config.behaviorSettings.formality}
                    onValueChange={(value) => updateBehaviorSettings({ formality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-casual">Very Casual</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="very-formal">Very Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Custom Instructions</Label>
                <Textarea
                  value={config.customInstructions}
                  onChange={(e) => updateConfig({ customInstructions: e.target.value })}
                  placeholder="Add specific instructions for how this agent should behave..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  These instructions will be included in every conversation with this agent
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MCP Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                MCP Tools Integration
              </CardTitle>
              <CardDescription>Configure Model Context Protocol tools and external capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Enable tools to extend your agent's capabilities</p>
                <Button
                  size="sm"
                  onClick={() => setShowAddTool(true)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tool
                </Button>
              </div>

              {showAddTool && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tool Name</Label>
                        <Input
                          value={newMCPTool.name || ""}
                          onChange={(e) => setNewMCPTool({ ...newMCPTool, name: e.target.value })}
                          placeholder="Enter tool name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Endpoint URL</Label>
                        <Input
                          value={newMCPTool.endpoint || ""}
                          onChange={(e) => setNewMCPTool({ ...newMCPTool, endpoint: e.target.value })}
                          placeholder="https://api.example.com/tool"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Description</Label>
                      <Input
                        value={newMCPTool.description || ""}
                        onChange={(e) => setNewMCPTool({ ...newMCPTool, description: e.target.value })}
                        placeholder="What does this tool do?"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={addMCPTool}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Add Tool
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddTool(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {config.mcpTools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={tool.enabled} onCheckedChange={() => toggleMCPTool(tool.id)} />
                      <div>
                        <div className="font-medium text-foreground">{tool.name}</div>
                        <div className="text-sm text-muted-foreground">{tool.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <code className="bg-muted px-1 rounded">{tool.endpoint}</code>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={tool.enabled ? "default" : "secondary"}>
                        {tool.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMCPTool(tool.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prompts Tab */}
        <TabsContent value="prompts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Prompt Templates
              </CardTitle>
              <CardDescription>Manage system prompts and conversation templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.promptTemplates.map((template) => (
                <div key={template.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">{template.name}</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      value={template.template}
                      onChange={(e) => {
                        const updatedTemplates = config.promptTemplates.map((t) =>
                          t.id === template.id ? { ...t, template: e.target.value } : t,
                        )
                        updateConfig({ promptTemplates: updatedTemplates })
                      }}
                      className="min-h-[80px] font-mono text-sm"
                    />
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Memory Tab */}
        <TabsContent value="memory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Memory & Context
              </CardTitle>
              <CardDescription>Configure how your agent remembers and uses context</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Context Window Size: {config.memorySettings.contextWindow} tokens</Label>
                  <Slider
                    value={[config.memorySettings.contextWindow]}
                    onValueChange={([value]) => updateMemorySettings({ contextWindow: value })}
                    max={32000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">How much conversation history to maintain in memory</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Remember Conversations</Label>
                      <p className="text-sm text-muted-foreground">Keep conversation history between sessions</p>
                    </div>
                    <Checkbox
                      checked={config.memorySettings.rememberConversations}
                      onCheckedChange={(checked) => updateMemorySettings({ rememberConversations: checked as boolean })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Personality Consistency</Label>
                      <p className="text-sm text-muted-foreground">
                        Maintain consistent personality across conversations
                      </p>
                    </div>
                    <Checkbox
                      checked={config.memorySettings.personalityConsistency}
                      onCheckedChange={(checked) =>
                        updateMemorySettings({ personalityConsistency: checked as boolean })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button variant="outline" onClick={onCancel} className="border-border bg-transparent">
          Cancel
        </Button>
        <Button onClick={onSave} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          Save Configuration
        </Button>
      </div>
    </div>
  )
}
