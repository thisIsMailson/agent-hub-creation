import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"
import type { ApiResponse, Agent } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agent = await mockDatabase.agents.getById(params.id)

    if (!agent) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Agent not found",
      }

      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<Agent> = {
      success: true,
      data: agent,
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch agent",
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const agent = await mockDatabase.agents.update(params.id, body)

    if (!agent) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Agent not found",
      }

      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<Agent> = {
      success: true,
      data: agent,
      message: "Agent updated successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to update agent",
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await mockDatabase.agents.delete(params.id)

    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Agent not found",
      }

      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<null> = {
      success: true,
      message: "Agent deleted successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to delete agent",
    }

    return NextResponse.json(response, { status: 500 })
  }
}
