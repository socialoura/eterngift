import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { initDatabase, getAdminUser, updateAdminPassword } from '@/lib/db'

initDatabase().catch(console.error)

export async function POST(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const username = auth.token!.username

    // Verify current password: DB hash first (if a password was previously changed),
    // otherwise the ADMIN_PASSWORD env var.
    const dbUser = await getAdminUser(username)
    const currentValid = dbUser?.password_hash
      ? bcrypt.compareSync(currentPassword, dbUser.password_hash)
      : currentPassword === process.env.ADMIN_PASSWORD

    if (!currentValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10)
    await updateAdminPassword(username, passwordHash)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
