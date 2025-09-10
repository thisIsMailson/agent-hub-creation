import type { Agent, Message, Conversation, Tool } from "./types"

export const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Code Assistant",
    description: "Helps with programming tasks and code review",
    type: "text",
    status: "active",
    avatar: "/robot-coding.jpg",
    lastUsed: "2 hours ago",
    conversations: 24,
    systemPrompt:
      "You are a helpful coding assistant. Help users with programming tasks, code review, and technical questions.",
    tools: ["code_execution", "web_search", "file_analysis"],
    iconName: "Code",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Image Generator",
    description: "Creates stunning visuals and artwork",
    type: "image",
    status: "active",
    avatar: "/ai-art-generator.jpg",
    lastUsed: "1 hour ago",
    conversations: 18,
    systemPrompt: "You are an AI image generator. Create beautiful, detailed images based on user descriptions.",
    tools: ["image_generation", "style_transfer"],
    iconName: "ImageIcon",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "3",
    name: "Research Assistant",
    description: "Analyzes data and provides insights",
    type: "text",
    status: "idle",
    avatar: "/research-assistant.png",
    lastUsed: "5 hours ago",
    conversations: 12,
    systemPrompt: "You are a research assistant. Help users analyze data, find information, and provide insights.",
    tools: ["web_search", "data_analysis", "document_processing"],
    iconName: "Brain",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "4",
    name: "Design Helper",
    description: "UI/UX design guidance and feedback",
    type: "text",
    status: "active",
    avatar: "/design-assistant.png",
    lastUsed: "30 minutes ago",
    conversations: 31,
    systemPrompt:
      "You are a UI/UX design expert. Provide guidance on design principles, user experience, and visual aesthetics.",
    tools: ["design_analysis", "color_palette", "layout_suggestions"],
    iconName: "Palette",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-21"),
  },
]

export const mockTools: Tool[] = [
  {
    id: "web_search",
    name: "Web Search",
    description: "Search the internet for information",
    category: "Research",
    enabled: true,
  },
  {
    id: "code_execution",
    name: "Code Execution",
    description: "Execute and analyze code",
    category: "Development",
    enabled: true,
  },
  {
    id: "file_analysis",
    name: "File Analysis",
    description: "Analyze and process files",
    category: "Productivity",
    enabled: true,
  },
  {
    id: "image_generation",
    name: "Image Generation",
    description: "Generate images from text",
    category: "Creative",
    enabled: true,
  },
  {
    id: "data_analysis",
    name: "Data Analysis",
    description: "Analyze and visualize data",
    category: "Analytics",
    enabled: true,
  },
  {
    id: "document_processing",
    name: "Document Processing",
    description: "Process and extract from documents",
    category: "Productivity",
    enabled: true,
  },
  {
    id: "style_transfer",
    name: "Style Transfer",
    description: "Apply artistic styles to images",
    category: "Creative",
    enabled: true,
  },
  {
    id: "color_palette",
    name: "Color Palette",
    description: "Generate color schemes",
    category: "Design",
    enabled: true,
  },
  {
    id: "layout_suggestions",
    name: "Layout Suggestions",
    description: "Suggest UI/UX layouts",
    category: "Design",
    enabled: true,
  },
  {
    id: "design_analysis",
    name: "Design Analysis",
    description: "Analyze design patterns",
    category: "Design",
    enabled: true,
  },
]

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    agentId: "1",
    title: "React Component Help",
    messages: [
      {
        id: "msg-1",
        agentId: "1",
        content: "Hello! I'm Code Assistant. How can I help you with programming today?",
        sender: "agent",
        timestamp: new Date("2024-01-21T10:00:00"),
        type: "text",
      },
      {
        id: "msg-2",
        agentId: "1",
        content: "Can you help me create a React component for a user profile card?",
        sender: "user",
        timestamp: new Date("2024-01-21T10:01:00"),
        type: "text",
      },
    ],
    createdAt: new Date("2024-01-21T10:00:00"),
    updatedAt: new Date("2024-01-21T10:01:00"),
  },
]

// In-memory storage simulation
const agents = [...mockAgents]
const conversations = [...mockConversations]
const tools = [...mockTools]

export const mockDatabase = {
  agents: {
    getAll: () => Promise.resolve([...agents]),
    getById: (id: string) => Promise.resolve(agents.find((agent) => agent.id === id)),
    create: (agent: Omit<Agent, "id" | "createdAt" | "updatedAt">) => {
      const newAgent: Agent = {
        ...agent,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      agents.push(newAgent)
      return Promise.resolve(newAgent)
    },
    update: (id: string, updates: Partial<Agent>) => {
      const index = agents.findIndex((agent) => agent.id === id)
      if (index === -1) return Promise.resolve(null)

      agents[index] = { ...agents[index], ...updates, updatedAt: new Date() }
      return Promise.resolve(agents[index])
    },
    delete: (id: string) => {
      const index = agents.findIndex((agent) => agent.id === id)
      if (index === -1) return Promise.resolve(false)

      agents.splice(index, 1)
      return Promise.resolve(true)
    },
  },
  conversations: {
    getAll: () => Promise.resolve([...conversations]),
    getByAgentId: (agentId: string) => Promise.resolve(conversations.filter((conv) => conv.agentId === agentId)),
    getById: (id: string) => Promise.resolve(conversations.find((conv) => conv.id === id)),
    create: (conversation: Omit<Conversation, "id" | "createdAt" | "updatedAt">) => {
      const newConversation: Conversation = {
        ...conversation,
        id: `conv-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      conversations.push(newConversation)
      return Promise.resolve(newConversation)
    },
    addMessage: (conversationId: string, message: Omit<Message, "id">) => {
      const conversation = conversations.find((conv) => conv.id === conversationId)
      if (!conversation) return Promise.resolve(null)

      const newMessage: Message = {
        ...message,
        id: `msg-${Date.now()}`,
      }

      conversation.messages.push(newMessage)
      conversation.updatedAt = new Date()

      return Promise.resolve(newMessage)
    },
  },
  tools: {
    getAll: () => Promise.resolve([...tools]),
    getById: (id: string) => Promise.resolve(tools.find((tool) => tool.id === id)),
    updateEnabled: (id: string, enabled: boolean) => {
      const tool = tools.find((t) => t.id === id)
      if (!tool) return Promise.resolve(null)

      tool.enabled = enabled
      return Promise.resolve(tool)
    },
  },
}
