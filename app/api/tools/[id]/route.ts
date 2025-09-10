import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"
import type { ApiResponse, Tool } from "@/lib/types"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const tool = await mockDatabase.tools.updateEnabled(params.id, body.enabled)

    if (!tool) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Tool not found",
      }

      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<Tool> = {
      success: true,
      data: tool,
      message: "Tool updated successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to update tool",
    }

    return NextResponse.json(response, { status: 500 })
  }
}
