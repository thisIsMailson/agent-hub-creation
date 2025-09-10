import type { Agent, Conversation, Tool, ApiResponse, Message } from "./types"

const API_BASE = "/api"

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Agent methods
  async getAgents(): Promise<ApiResponse<Agent[]>> {
    return this.request<Agent[]>("/agents")
  }

  async getAgent(id: string): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/agents/${id}`)
  }

  async createAgent(agent: Omit<Agent, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Agent>> {
    return this.request<Agent>("/agents", {
      method: "POST",
      body: JSON.stringify(agent),
    })
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/agents/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async deleteAgent(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/agents/${id}`, {
      method: "DELETE",
    })
  }

  // Chat methods
  async sendMessage(
    agentId: string,
    message: string,
    conversationId?: string,
  ): Promise<ApiResponse<{ userMessage: Message; agentResponse: Message }>> {
    return this.request<{ userMessage: Message; agentResponse: Message }>(`/agents/${agentId}/chat`, {
      method: "POST",
      body: JSON.stringify({ message, conversationId }),
    })
  }

  // Conversation methods
  async getConversations(agentId?: string): Promise<ApiResponse<Conversation[]>> {
    const query = agentId ? `?agentId=${agentId}` : ""
    return this.request<Conversation[]>(`/conversations${query}`)
  }

  async createConversation(
    conversation: Omit<Conversation, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<Conversation>> {
    return this.request<Conversation>("/conversations", {
      method: "POST",
      body: JSON.stringify(conversation),
    })
  }

  // Tool methods
  async getTools(): Promise<ApiResponse<Tool[]>> {
    return this.request<Tool[]>("/tools")
  }

  async updateTool(id: string, enabled: boolean): Promise<ApiResponse<Tool>> {
    return this.request<Tool>(`/tools/${id}`, {
      method: "PUT",
      body: JSON.stringify({ enabled }),
    })
  }
}

export const apiClient = new ApiClient()
