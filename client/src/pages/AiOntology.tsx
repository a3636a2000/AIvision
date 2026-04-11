import React from 'react'
import SmartFactoryWrapper from '@/components/SmartFactoryWrapper'
import { LayoutDashboard } from 'lucide-react'

export default function AiOntology() {
  return (
    <SmartFactoryWrapper>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <LayoutDashboard className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-800">AI 온톨로지 분석</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center h-[60vh]">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <LayoutDashboard className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">준비 중인 기능입니다</h2>
          <p className="text-slate-500">데이터 관계 기반의 AI 온톨로지 분석 기능이 곧 업데이트 될 예정입니다.</p>
        </div>
      </div>
    </SmartFactoryWrapper>
  )
}
