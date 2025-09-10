export interface Agent {
  id: string
  name: string
  description: string
  type: "text" | "image"
  status: "active" | "idle"
  avatar: string
  lastUsed: string
  conversations: number
  systemPrompt: string
  tools: string[]
  iconName: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  agentId: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  type: "text" | "image" | "interactive"
  imageUrl?: string
  metadata?: Record<string, any>
}

export interface Conversation {
  id: string
  agentId: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Tool {
  id: string
  name: string
  description: string
  category: string
  enabled: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
