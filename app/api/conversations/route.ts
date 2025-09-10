import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"
import type { ApiResponse, Conversation } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get("agentId")

    let conversations
    if (agentId) {
      conversations = await mockDatabase.conversations.getByAgentId(agentId)
    } else {
      conversations = await mockDatabase.conversations.getAll()
    }

    const response: ApiResponse<Conversation[]> = {
      success: true,
      data: conversations,
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch conversations",
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.agentId || !body.title) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Missing required fields: agentId, title",
      }

      return NextResponse.json(response, { status: 400 })
    }

    const conversation = await mockDatabase.conversations.create({
      agentId: body.agentId,
      title: body.title,
      messages: body.messages || [],
    })

    const response: ApiResponse<Conversation> = {
      success: true,
      data: conversation,
      message: "Conversation created successfully",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to create conversation",
    }

    return NextResponse.json(response, { status: 500 })
  }
}
