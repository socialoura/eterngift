import { NextRequest, NextResponse } from 'next/server'

export interface AdminToken {
  username: string
  role: string
  exp: number
}

export function verifyAdminToken(request: NextRequest): { valid: boolean; error?: string; token?: AdminToken } {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing authorization header' }
  }

  const tokenString = authHeader.slice(7)
  
  try {
    const decoded = JSON.parse(Buffer.from(tokenString, 'base64').toString('utf-8')) as AdminToken
    
    if (decoded.exp < Date.now()) {
      return { valid: false, error: 'Token expired' }
    }
    
    if (decoded.role !== 'admin') {
      return { valid: false, error: 'Insufficient permissions' }
    }
    
    return { valid: true, token: decoded }
  } catch {
    return { valid: false, error: 'Invalid token' }
  }
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 })
}
