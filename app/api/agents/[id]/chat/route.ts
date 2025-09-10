import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"
import type { ApiResponse, Message } from "@/lib/types"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { message, conversationId } = body

    if (!message) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Message content is required",
      }

      return NextResponse.json(response, { status: 400 })
    }

    // Check if agent exists
    const agent = await mockDatabase.agents.getById(params.id)
    if (!agent) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Agent not found",
      }

      return NextResponse.json(response, { status: 404 })
    }

    // Create user message
    const userMessage: Omit<Message, "id"> = {
      agentId: params.id,
      content: message,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    // Simulate agent response
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing time

    let agentResponse: Omit<Message, "id">

    if (agent.type === "image") {
      agentResponse = {
        agentId: params.id,
        content: `Generated image based on: "${message}"`,
        sender: "agent",
        timestamp: new Date(),
        type: "image",
        imageUrl: `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(message)}`,
      }
    } else {
      const responses = [
        `I understand you're asking about "${message}". Let me help you with that...`,
        `Based on your request about "${message}", here's what I can suggest...`,
        `Great question about "${message}"! Here's my analysis...`,
        `I've processed your request regarding "${message}". Here are my thoughts...`,
      ]

      agentResponse = {
        agentId: params.id,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "agent",
        timestamp: new Date(),
        type: "text",
      }
    }

    const response: ApiResponse<{ userMessage: Message; agentResponse: Message }> = {
      success: true,
      data: {
        userMessage: { ...userMessage, id: `msg-${Date.now()}-user` },
        agentResponse: { ...agentResponse, id: `msg-${Date.now()}-agent` },
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to process chat message",
    }

    return NextResponse.json(response, { status: 500 })
  }
}
