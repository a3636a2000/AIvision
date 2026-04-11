import React, { ReactNode } from 'react'

interface SmartFactoryWrapperProps {
  children: ReactNode
}

/**
 * 스마트팩토리 섹션 전용 래퍼
 * - 다크 테마(기본) / 라이트 테마 호환
 */
export default function SmartFactoryWrapper({ children }: SmartFactoryWrapperProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans">
      {/* 페이지 콘텐츠 */}
      <div className="flex-1 overflow-auto p-4 lg:p-5 relative">
        {children}
      </div>
    </div>
  )
}
