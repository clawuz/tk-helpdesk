'use client'
import { HelpdeskTab } from '@/components/HelpdeskTab'

export default function HelpdeskPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <HelpdeskTab />
      </div>
    </div>
  )
}
