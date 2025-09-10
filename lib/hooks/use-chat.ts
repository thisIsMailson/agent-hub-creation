"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { Message } from "@/lib/types"

export function useChat(agentId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (content: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.sendMessage(agentId, content)

      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data!.userMessage, response.data!.agentResponse])
      } else {
        throw new Error(response.error || "Failed to send message")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
    setError(null)
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  }
}
