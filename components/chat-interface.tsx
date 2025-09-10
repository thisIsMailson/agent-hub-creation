"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  History,
} from "lucide-react"
import { ChatHistoryPanel } from "@/components/chat-history-panel"

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
  const [showInteractiveDemo, setShowInteractiveDemo] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
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

  const handleClose = () => {
    onClose()
  }

  const IconComponent = agent.icon

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-slate-900/40 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl h-[85vh] flex flex-col bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 ring-2 ring-white shadow-lg">
                <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                <AvatarFallback className="bg-gradient-to-br from-[#24546B] to-[#1e4a5f] text-white">
                  <IconComponent className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-[#24546B] font-semibold">{agent.name}</CardTitle>
                <div className="flex items-center gap-3 mt-1">
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
                  <span className="text-sm text-slate-600 font-medium">{agent.description}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100/80 backdrop-blur-sm rounded-xl p-1 shadow-inner">
                <Button
                  size="sm"
                  variant={agentMode === "text" ? "default" : "ghost"}
                  onClick={() => setAgentMode("text")}
                  className={
                    agentMode === "text"
                      ? "bg-gradient-to-r from-[#24546B] to-[#1e4a5f] text-white shadow-md"
                      : "text-slate-600 hover:bg-white/60"
                  }
                >
                  <Type className="w-4 h-4 mr-2" />
                  Text
                </Button>
                <Button
                  size="sm"
                  variant={agentMode === "image" ? "default" : "ghost"}
                  onClick={() => setAgentMode("image")}
                  className={
                    agentMode === "image"
                      ? "bg-gradient-to-r from-[#24546B] to-[#1e4a5f] text-white shadow-md"
                      : "text-slate-600 hover:bg-white/60"
                  }
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
                className="border-slate-200 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-slate-700"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowInteractiveDemo(true)}
                className="border-slate-200 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-slate-700"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Demo
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="border-slate-200 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-slate-700"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleClose}
                className="border-slate-200 bg-white/60 backdrop-blur-sm hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="flex flex-1 overflow-hidden">
          {showHistory && (
            <div className="w-80 border-r border-slate-200/60 bg-slate-50/50 backdrop-blur-sm">
              <ChatHistoryPanel
                agentId={agent.id}
                onSelectConversation={(conversationId) => {
                  console.log("Selected conversation:", conversationId)
                  setShowHistory(false)
                }}
              />
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white/40 to-slate-50/40">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "agent" && (
                    <Avatar className="w-9 h-9 mt-1 ring-2 ring-white shadow-md">
                      <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#24546B] to-[#1e4a5f] text-white">
                        <IconComponent className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[75%] ${message.sender === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-2xl p-4 shadow-sm backdrop-blur-sm ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-[#24546B] to-[#1e4a5f] text-white ml-auto shadow-lg"
                          : "bg-white/80 text-slate-800 border border-slate-200/60"
                      }`}
                    >
                      {message.isEditing ? (
                        <div className="space-y-3">
                          <Textarea
                            defaultValue={message.content}
                            className="min-h-[80px] bg-white/90 text-slate-800 border-slate-200 rounded-xl"
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
                              className="bg-gradient-to-r from-[#24546B] to-[#1e4a5f] hover:from-[#1e4a5f] hover:to-[#24546B] text-white"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelEdit(message.id)}
                              className="border-slate-200 bg-white/60"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {message.type === "image" && message.imageUrl ? (
                            <div className="space-y-3">
                              <img
                                src={message.imageUrl || "/placeholder.svg"}
                                alt="Generated image"
                                className="rounded-xl max-w-full h-auto shadow-md"
                              />
                              <p className="text-sm font-medium">{message.content}</p>
                            </div>
                          ) : message.type === "interactive" ? (
                            <div>
                              <p className="text-balance mb-3 font-medium">{message.content}</p>
                              {message.interactiveComponent}
                            </div>
                          ) : (
                            <p className="text-balance leading-relaxed">{message.content}</p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <span className="font-medium">{message.timestamp.toLocaleTimeString()}</span>
                      {message.sender === "user" && !message.isEditing && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditMessage(message.id)}
                          className="h-7 px-2 text-xs hover:bg-slate-100 text-slate-600 rounded-lg"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      {message.sender === "agent" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 hover:bg-slate-100 text-slate-600 rounded-lg"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 hover:bg-green-50 hover:text-green-600 rounded-lg"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 hover:bg-red-50 hover:text-red-600 rounded-lg"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4">
                  <Avatar className="w-9 h-9 mt-1 ring-2 ring-white shadow-md">
                    <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#24546B] to-[#1e4a5f] text-white">
                      <IconComponent className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 max-w-[75%] border border-slate-200/60 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-[#24546B] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#24546B] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#24546B] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t border-slate-200/60 p-6 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${agent.name}... (${agentMode === "image" ? "Describe image to generate" : "Ask anything"})`}
                    className="pr-14 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-[#24546B] focus:ring-[#24546B]/20 rounded-xl shadow-sm text-slate-800 placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#24546B] to-[#1e4a5f] hover:from-[#1e4a5f] hover:to-[#24546B] text-white shadow-md rounded-lg h-8 w-8 p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <span className="font-medium">Press Enter to send, Shift+Enter for new line</span>
                <span className="font-medium">Mode: {agentMode === "image" ? "Image Generation" : "Text Chat"}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Demo Overlay - kept but with modern styling */}
      {showInteractiveDemo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
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
