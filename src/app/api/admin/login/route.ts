import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { initDatabase, getAdminUser } from '@/lib/db'
import { signAdminToken } from '@/lib/admin-auth'

initDatabase().catch(console.error)

/**
 * Password check order:
 * 1. If a row exists in `admin_users` (set via change-password), use bcrypt against it.
 * 2. Otherwise fall back to ADMIN_USERNAME / ADMIN_PASSWORD env vars.
 */
async function isValidAdminCredentials(username: string, password: string): Promise<boolean> {
  try {
    const dbUser = await getAdminUser(username)
    if (dbUser?.password_hash) {
      return bcrypt.compareSync(password, dbUser.password_hash)
    }
  } catch (error) {
    console.error('Failed to read admin user from DB, falling back to env:', error)
  }

  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminUsername || !adminPassword) return false
  return username === adminUsername && password === adminPassword
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    if (!(await isValidAdminCredentials(username, password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signAdminToken(username)
    if (!token) {
      return NextResponse.json({ error: 'JWT_SECRET is not configured' }, { status: 500 })
    }

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
