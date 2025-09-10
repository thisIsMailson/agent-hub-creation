"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { MultipleChoice } from "@/components/ui/multiple-choice"
import { SelectableGallery } from "@/components/ui/selectable-gallery"
import {
  X,
  Send,
  Edit3,
  Check,
  ImageIcon,
  Type,
  Settings,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Palette,
  Grid3X3,
} from "lucide-react"

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

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  isEditing?: boolean
  originalPrompt?: string
  type?: "text" | "image" | "interactive"
  imageUrl?: string
  interactiveComponent?: React.ReactNode
}

interface ChatInterfaceProps {
  agent: Agent
  onClose: () => void
}

// Mock data for interactive components
const mockChoices = [
  {
    id: "option1",
    label: "Generate a landscape",
    description: "Create a beautiful natural scene",
    icon: <ImageIcon className="w-4 h-4" />,
  },
  {
    id: "option2",
    label: "Generate a portrait",
    description: "Create a character or person",
    icon: <Type className="w-4 h-4" />,
  },
  {
    id: "option3",
    label: "Generate abstract art",
    description: "Create artistic patterns",
    icon: <Palette className="w-4 h-4" />,
  },
]

const mockGalleryItems = [
  {
    id: "style1",
    title: "Photorealistic",
    description: "Highly detailed, camera-like quality",
    category: "Photography",
    imageUrl: "/photorealistic.jpg",
  },
  {
    id: "style2",
    title: "Oil Painting",
    description: "Classic painted artwork style",
    category: "Art",
    imageUrl: "/abstract-oil-painting.png",
  },
  {
    id: "style3",
    title: "Watercolor",
    description: "Soft, flowing paint effects",
    category: "Art",
    imageUrl: "/watercolor.jpg",
  },
  {
    id: "style4",
    title: "Digital Art",
    description: "Modern digital illustration",
    category: "Digital",
    imageUrl: "/abstract-digital-composition.png",
  },
  {
    id: "style5",
    title: "Sketch",
    description: "Hand-drawn pencil style",
    category: "Drawing",
    imageUrl: "/pencil-sketch.png",
  },
  {
    id: "style6",
    title: "Cartoon",
    description: "Animated, stylized look",
    category: "Animation",
    imageUrl: "/cartoon-style.jpg",
  },
]

const mockComboboxOptions = [
  {
    value: "low",
    label: "Low Quality",
    description: "Fast generation, basic quality",
    icon: <div className="w-2 h-2 bg-red-500 rounded-full" />,
  },
  {
    value: "medium",
    label: "Medium Quality",
    description: "Balanced speed and quality",
    icon: <div className="w-2 h-2 bg-yellow-500 rounded-full" />,
  },
  {
    value: "high",
    label: "High Quality",
    description: "Slower generation, best quality",
    icon: <div className="w-2 h-2 bg-green-500 rounded-full" />,
  },
]

export function ChatInterface({ agent, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello! I'm ${agent.name}. ${agent.description}. How can I help you today?`,
      sender: "agent",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [agentMode, setAgentMode] = useState<"text" | "image">(agent.type)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showInteractiveDemo, setShowInteractiveDemo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAgentResponse = async (userMessage: string, mode: "text" | "image") => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let response: Message

    if (mode === "image") {
      response = {
        id: Date.now().toString(),
        content: `Generated image based on: "${userMessage}"`,
        sender: "agent",
        timestamp: new Date(),
        type: "image",
        imageUrl: `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(userMessage)}`,
      }
    } else {
      // Check for interactive component triggers
      if (userMessage.toLowerCase().includes("interactive") || userMessage.toLowerCase().includes("demo")) {
        response = {
          id: Date.now().toString(),
          content: "Here are some interactive options for you:",
          sender: "agent",
          timestamp: new Date(),
          type: "interactive",
          interactiveComponent: (
            <div className="space-y-4 mt-4">
              <MultipleChoice
                title="What would you like to do?"
                description="Choose one or more options"
                choices={mockChoices}
                allowMultiple={true}
                maxSelections={2}
                onSelect={(choice) => {
                  console.log("Selected:", choice)
                  addMessage(`You selected: ${choice}`, "user")
                }}
              />
            </div>
          ),
        }
      } else {
        const responses = [
          `I understand you're asking about "${userMessage}". Let me help you with that...`,
          `Based on your request about "${userMessage}", here's what I can suggest...`,
          `Great question about "${userMessage}"! Here's my analysis...`,
          `I've processed your request regarding "${userMessage}". Here are my thoughts...`,
        ]
        response = {
          id: Date.now().toString(),
          content: responses[Math.floor(Math.random() * responses.length)],
          sender: "agent",
          timestamp: new Date(),
          type: "text",
        }
      }
    }

    setMessages((prev) => [...prev, response])
    setIsLoading(false)
  }

  const addMessage = (content: string, sender: "user" | "agent") => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      type: "text",
    }
    setMessages((prev) => [...prev, message])
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    await simulateAgentResponse(inputValue, agentMode)
  }

  const handleEditMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isEditing: true, originalPrompt: msg.content } : msg)),
    )
  }

  const handleSaveEdit = async (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, content: newContent, isEditing: false } : msg)),
    )

    // Remove subsequent messages and regenerate response
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    const updatedMessages = messages.slice(0, messageIndex + 1)
    updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], content: newContent, isEditing: false }
    setMessages(updatedMessages)

    await simulateAgentResponse(newContent, agentMode)
  }

  const handleCancelEdit = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isEditing: false, content: msg.originalPrompt || msg.content } : msg,
      ),
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const IconComponent = agent.icon

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col bg-card border-border">
        {/* Chat Header */}
        <CardHeader className="border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                <AvatarFallback className="bg-secondary">
                  <IconComponent className="w-5 h-5 text-secondary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg text-card-foreground">{agent.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={agent.status === "active" ? "default" : "secondary"}
                    className={agent.status === "active" ? "bg-accent text-accent-foreground" : ""}
                  >
                    {agent.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{agent.description}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Mode Toggle */}
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  size="sm"
                  variant={agentMode === "text" ? "default" : "ghost"}
                  onClick={() => setAgentMode("text")}
                  className={agentMode === "text" ? "bg-accent text-accent-foreground" : ""}
                >
                  <Type className="w-4 h-4 mr-1" />
                  Text
                </Button>
                <Button
                  size="sm"
                  variant={agentMode === "image" ? "default" : "ghost"}
                  onClick={() => setAgentMode("image")}
                  className={agentMode === "image" ? "bg-accent text-accent-foreground" : ""}
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  Image
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowInteractiveDemo(true)}
                className="border-border bg-transparent"
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                Demo
              </Button>

              <Button size="sm" variant="outline" className="border-border bg-transparent">
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirmation(true)}
                className="border-border bg-transparent"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "agent" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                  <AvatarFallback className="bg-secondary">
                    <IconComponent className="w-4 h-4 text-secondary-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-[70%] ${message.sender === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-accent text-accent-foreground ml-auto"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        defaultValue={message.content}
                        className="min-h-[60px] bg-background text-foreground"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.ctrlKey) {
                            const target = e.target as HTMLTextAreaElement
                            handleSaveEdit(message.id, target.value)
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            const textarea = e.currentTarget.parentElement
                              ?.previousElementSibling as HTMLTextAreaElement
                            handleSaveEdit(message.id, textarea.value)
                          }}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelEdit(message.id)}
                          className="border-border"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.type === "image" && message.imageUrl ? (
                        <div className="space-y-2">
                          <img
                            src={message.imageUrl || "/placeholder.svg"}
                            alt="Generated image"
                            className="rounded-lg max-w-full h-auto"
                          />
                          <p className="text-sm">{message.content}</p>
                        </div>
                      ) : message.type === "interactive" ? (
                        <div>
                          <p className="text-balance mb-2">{message.content}</p>
                          {message.interactiveComponent}
                        </div>
                      ) : (
                        <p className="text-balance">{message.content}</p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.sender === "user" && !message.isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditMessage(message.id)}
                      className="h-6 px-2 text-xs hover:bg-muted"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  )}
                  {message.sender === "agent" && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-6 px-2 hover:bg-muted">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2 hover:bg-muted">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2 hover:bg-muted">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                <AvatarFallback className="bg-secondary">
                  <IconComponent className="w-4 h-4 text-secondary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3 max-w-[70%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${agent.name}... (${agentMode === "image" ? "Describe image to generate" : "Ask anything"})`}
                className="pr-12 bg-background text-foreground"
                disabled={isLoading}
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Mode: {agentMode === "image" ? "Image Generation" : "Text Chat"}</span>
          </div>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          setShowConfirmation(false)
          onClose()
        }}
        title="Close Chat"
        description="Are you sure you want to close this chat? Your conversation will be saved."
        confirmText="Close Chat"
        cancelText="Keep Chatting"
        variant="info"
      />

      {/* Interactive Demo Overlay */}
      {showInteractiveDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="space-y-6 max-w-4xl w-full">
            <SelectableGallery
              title="Choose Art Style"
              description="Select one or more art styles for your image generation"
              items={mockGalleryItems}
              categories={["Photography", "Art", "Digital", "Drawing", "Animation"]}
              allowMultiple={true}
              maxSelections={3}
              onSelect={(selection) => {
                console.log("Gallery selection:", selection)
                setShowInteractiveDemo(false)
              }}
              onCancel={() => setShowInteractiveDemo(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
