import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { defaultLocale, isValidLocale } from '@/lib/i18n/config'

export default async function RootPage() {
  const cookieStore = await cookies()
  const savedLocale = cookieStore.get('preferred-locale')?.value
  const locale = savedLocale && isValidLocale(savedLocale) ? savedLocale : defaultLocale
  redirect(`/${locale}`)
}
