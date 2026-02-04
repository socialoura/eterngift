import { NextRequest, NextResponse } from 'next/server'
import { initDatabase } from '@/lib/db'

initDatabase().catch(console.error)

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUsername || !adminPassword) {
      return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 })
    }

    if (username === adminUsername && password === adminPassword) {
      const tokenData = {
        username,
        role: 'admin',
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }
      const token = Buffer.from(JSON.stringify(tokenData)).toString('base64')

      return NextResponse.json({ success: true, token })
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
