import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AdminToken {
  username: string
  role: string
  exp: number
}

export const ADMIN_TOKEN_TTL_SECONDS = 24 * 60 * 60 // 24 hours

function getJwtSecret(): string | null {
  return process.env.JWT_SECRET || null
}

export function signAdminToken(username: string): string | null {
  const secret = getJwtSecret()
  if (!secret) return null
  return jwt.sign({ username, role: 'admin' }, secret, {
    expiresIn: ADMIN_TOKEN_TTL_SECONDS,
  })
}

export function verifyAdminToken(request: NextRequest): { valid: boolean; error?: string; token?: AdminToken } {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing authorization header' }
  }

  const tokenString = authHeader.slice(7)
  const secret = getJwtSecret()

  if (!secret) {
    return { valid: false, error: 'JWT_SECRET is not configured' }
  }

  try {
    const decoded = jwt.verify(tokenString, secret) as AdminToken

    if (decoded.role !== 'admin') {
      return { valid: false, error: 'Insufficient permissions' }
    }

    return { valid: true, token: decoded }
  } catch {
    return { valid: false, error: 'Invalid or expired token' }
  }
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 })
}
