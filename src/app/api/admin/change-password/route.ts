import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { currentPassword, newPassword } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (currentPassword !== adminPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Note: In production, you would update an environment variable or database
    // For now, we return success but the password change would need to be done manually
    return NextResponse.json({ success: true, message: 'Please update ADMIN_PASSWORD in environment variables' })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
