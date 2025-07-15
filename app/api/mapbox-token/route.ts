import { NextResponse } from "next/server"

/**
 * GET /api/mapbox-token
 * Returns the public Mapbox access-token so that client code
 * doesn't have to import `process.env.*` directly, avoiding
 * build-time exposure warnings.
 */
export async function GET() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""
  return NextResponse.json({ token })
}
