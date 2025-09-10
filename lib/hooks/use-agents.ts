"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { Agent } from "@/lib/types"

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAgents()

      if (response.success && response.data) {
        setAgents(response.data)
        setError(null)
      } else {
        setError(response.error || "Failed to fetch agents")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createAgent = async (agentData: Omit<Agent, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await apiClient.createAgent(agentData)

      if (response.success && response.data) {
        setAgents((prev) => [...prev, response.data!])
        return response.data
      } else {
        throw new Error(response.error || "Failed to create agent")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const updateAgent = async (id: string, updates: Partial<Agent>) => {
    try {
      const response = await apiClient.updateAgent(id, updates)

      if (response.success && response.data) {
        setAgents((prev) => prev.map((agent) => (agent.id === id ? response.data! : agent)))
        return response.data
      } else {
        throw new Error(response.error || "Failed to update agent")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const deleteAgent = async (id: string) => {
    try {
      const response = await apiClient.deleteAgent(id)

      if (response.success) {
        setAgents((prev) => prev.filter((agent) => agent.id !== id))
      } else {
        throw new Error(response.error || "Failed to delete agent")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
  }
}
