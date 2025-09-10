import { NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"
import type { ApiResponse, Tool } from "@/lib/types"

export async function GET() {
  try {
    const tools = await mockDatabase.tools.getAll()

    const response: ApiResponse<Tool[]> = {
      success: true,
      data: tools,
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch tools",
    }

    return NextResponse.json(response, { status: 500 })
  }
}
