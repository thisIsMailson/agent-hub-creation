import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"
import type { ApiResponse, Agent } from "@/lib/types"

export async function GET() {
  try {
    const agents = await mockDatabase.agents.getAll()

    const response: ApiResponse<Agent[]> = {
      success: true,
      data: agents,
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch agents",
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.description || !body.type) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Missing required fields: name, description, type",
      }

      return NextResponse.json(response, { status: 400 })
    }

    const agent = await mockDatabase.agents.create({
      name: body.name,
      description: body.description,
      type: body.type,
      status: body.status || "active",
      avatar: body.avatar || "",
      lastUsed: "Never",
      conversations: 0,
      systemPrompt: body.systemPrompt || "",
      tools: body.tools || [],
      iconName: body.iconName || "Bot",
    })

    const response: ApiResponse<Agent> = {
      success: true,
      data: agent,
      message: "Agent created successfully",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to create agent",
    }

    return NextResponse.json(response, { status: 500 })
  }
}
