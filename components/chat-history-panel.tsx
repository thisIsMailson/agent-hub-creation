"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Clock, Trash2, Star } from "lucide-react"

interface Conversation {
  id: string
  title: string
  preview: string
  timestamp: Date
  messageCount: number
  isStarred: boolean
  agentId: string
}

interface ChatHistoryPanelProps {
  agentId: string
  onSelectConversation: (conversationId: string) => void
}

// Mock conversation data
const mockConversations: Conversation[] = [
  {
    id: "conv1",
    title: "Code Review Help",
    preview: "Can you help me review this React component?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    messageCount: 12,
    isStarred: true,
    agentId: "1",
  },
  {
    id: "conv2",
    title: "API Integration",
    preview: "I need help integrating a REST API...",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    messageCount: 8,
    isStarred: false,
    agentId: "1",
  },
  {
    id: "conv3",
    title: "Database Design",
    preview: "What's the best approach for designing...",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    messageCount: 15,
    isStarred: true,
    agentId: "1",
  },
  {
    id: "conv4",
    title: "Performance Optimization",
    preview: "My React app is running slowly...",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    messageCount: 6,
    isStarred: false,
    agentId: "1",
  },
  {
    id: "conv5",
    title: "Landscape Generation",
    preview: "Create a beautiful mountain landscape...",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    messageCount: 4,
    isStarred: false,
    agentId: "2",
  },
  {
    id: "conv6",
    title: "Portrait Art",
    preview: "Generate a portrait in oil painting style...",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    messageCount: 7,
    isStarred: true,
    agentId: "2",
  },
]

export function ChatHistoryPanel({ agentId, onSelectConversation }: ChatHistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "starred">("all")

  // Filter conversations by agent and search query
  const filteredConversations = mockConversations
    .filter((conv) => conv.agentId === agentId)
    .filter((conv) => {
      if (selectedFilter === "starred" && !conv.isStarred) return false
      if (searchQuery) {
        return (
          conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      return true
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return timestamp.toLocaleDateString()
  }

  const handleToggleStar = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // In a real app, this would update the conversation in the backend
    console.log("Toggle star for conversation:", conversationId)
  }

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // In a real app, this would delete the conversation
    console.log("Delete conversation:", conversationId)
  }

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/60">
        <h3 className="text-lg font-semibold text-[#24546B] mb-3">Chat History</h3>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 bg-white/80 border-slate-200 focus:border-[#24546B] focus:ring-[#24546B]/20 rounded-lg text-sm"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={selectedFilter === "all" ? "default" : "outline"}
            onClick={() => setSelectedFilter("all")}
            className={
              selectedFilter === "all"
                ? "bg-[#24546B] hover:bg-[#1e4a5f] text-white h-8 text-xs"
                : "border-slate-200 bg-white/60 hover:bg-white/80 text-slate-600 h-8 text-xs"
            }
          >
            All
          </Button>
          <Button
            size="sm"
            variant={selectedFilter === "starred" ? "default" : "outline"}
            onClick={() => setSelectedFilter("starred")}
            className={
              selectedFilter === "starred"
                ? "bg-[#24546B] hover:bg-[#1e4a5f] text-white h-8 text-xs"
                : "border-slate-200 bg-white/60 hover:bg-white/80 text-slate-600 h-8 text-xs"
            }
          >
            <Star className="w-3 h-3 mr-1" />
            Starred
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">
                {searchQuery ? "No conversations found" : "No chat history yet"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {searchQuery ? "Try a different search term" : "Start a conversation to see it here"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className="group p-3 rounded-xl bg-white/60 hover:bg-white/80 border border-slate-200/60 hover:border-slate-300/60 cursor-pointer transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-[#24546B] truncate flex-1 mr-2">{conversation.title}</h4>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleToggleStar(conversation.id, e)}
                        className={`h-6 w-6 p-0 hover:bg-slate-100 ${
                          conversation.isStarred ? "text-yellow-500" : "text-slate-400"
                        }`}
                      >
                        <Star className={`w-3 h-3 ${conversation.isStarred ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                        className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 text-slate-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">{conversation.preview}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{formatTimestamp(conversation.timestamp)}</span>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                      {conversation.messageCount} messages
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
