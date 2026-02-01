import { Heart } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block">
          <Heart className="w-16 h-16 text-primary animate-pulse" />
        </div>
        <p className="text-gray-500 mt-4 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
