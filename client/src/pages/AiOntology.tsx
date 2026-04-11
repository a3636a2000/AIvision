import React, { useState } from 'react'
import SmartFactoryWrapper from '@/components/SmartFactoryWrapper'
import { 
  Database, LayoutDashboard, MessageSquare, Paperclip, Send, Trash2, Search, AlertTriangle, Eye,
  FileText, BarChart2, BookOpen, Lightbulb, Sparkles, Zap, TrendingUp, Target, Globe, CheckCircle2, ChevronDown,
  Activity
} from 'lucide-react'

export default function AiOntology() {
  const [activeTab, setActiveTab] = useState('개요')
  const [chatInput, setChatInput] = useState('')

  return (
    <SmartFactoryWrapper>
      <div className="flex flex-col absolute inset-0 bg-[#f8f9fc] p-2 overflow-hidden">
        {/* 상단 헤더 영역 */}
        <div className="relative bg-white border border-indigo-100 rounded-xl px-4 py-3 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 z-10 shadow-sm animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-indigo-900 font-bold text-lg tracking-tight">AI 온톨로지 분석</h2>
              <p className="text-slate-500 text-[11px] mt-0.5">데이터 관계 기반의 AI 온톨로지 분석 및 관리</p>
            </div>
          </div>
        </div>

        {/* 메인 레이아웃 (2단 분할) */}
        <div className="flex-1 flex flex-col lg:flex-row gap-2 min-h-0 z-10">
          
          {/* 좌측 패널 - 챗봇 인터페이스 */}
          <div className="w-full lg:w-[350px] flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm shrink-0 animate-in slide-in-from-left-4 fade-in duration-500 delay-100 fill-mode-both">
            {/* 좌측 패널 헤더 */}
            <div className="bg-purple-50/80 px-4 py-3 border-b border-purple-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <Database className="w-4 h-4" />
                온톨로지 AI 분석
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <AlertTriangle className="w-4 h-4" />
                <Eye className="w-4 h-4" />
              </div>
            </div>

            {/* 채팅 내용 영역 */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-700 text-[13px] font-bold">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  온톨로지 AI 분석 <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-full ml-1">온라인</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              <div className="bg-white rounded-2xl rounded-tl-sm p-4 text-[13px] text-slate-700 mb-4 border border-slate-200 shadow-sm">
                <p className="mb-3 leading-relaxed">안녕하세요! 제조업 AI 지능형 분석 시스템입니다. 생산 데이터 분석을 도와드리겠습니다.</p>
                <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 text-slate-600 text-xs">
                  <span className="mr-1">💡</span> SAP B1 MIS 모드로 전환하여 SAP Business One 데이터를 분석할 ..
                </div>
                <p className="text-[10px] text-slate-400 mt-2">오후 1:25:59</p>
              </div>
            </div>

            {/* 입력 영역 */}
            <div className="p-4 border-t border-slate-200 bg-white shrink-0">
              <button className="mb-2 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold py-1.5 px-3 rounded-full flex items-center gap-1.5 transition-colors shadow-sm">
                <Paperclip className="w-3.5 h-3.5" /> 파일 첨부 다중 선택 가능
              </button>
              
              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder="생산 데이터 질문.." 
                  className="flex-1 h-9 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors shadow-sm shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-[13px]">
                <Search className="w-4 h-4 text-slate-400" /> 분석 질문
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="명령어 입력.. (예: 검색 품질불량, 분석 생산성, 도표" 
                  className="w-full h-9 pl-3 pr-16 text-[11px] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white shadow-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <Send className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* 우측 패널 - 분석 결과 */}
          <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm min-w-0 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200 fill-mode-both">
            {/* 탭 영역 */}
            <div className="flex border-b border-slate-200 px-2 shrink-0 bg-slate-50/50">
              {[
                { id: '개요', icon: FileText },
                { id: '그래픽', icon: BarChart2 },
                { id: '요약', icon: BookOpen },
                { id: '해결책', icon: Lightbulb }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-5 py-3 text-[13px] font-bold border-b-2 transition-colors ${
                    activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600 bg-white' 
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-300'}`} />
                  {tab.id}
                </button>
              ))}
            </div>

            {/* 탭 내용 */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
              {activeTab === '개요' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full items-start">
                  
                  {/* 왼쪽 단 */}
                  <div className="flex flex-col gap-4">
                    {/* 제조업 분석 개요 */}
                    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[15px]">
                          <FileText className="w-4 h-4" /> 제조업 분석 개요
                        </div>
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          신뢰도 75%
                        </span>
                      </div>
                      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 text-blue-600">
                          <Database className="w-4 h-4" />
                          <span className="text-2xl font-black">5</span>
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 font-medium">분석 대상 데이터 건수</span>
                      </div>
                    </div>

                    {/* AI 분석 개요 (1단계) */}
                    <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                      <div className="flex items-center gap-1.5 text-indigo-600 font-bold mb-1 text-[15px]">
                        <Sparkles className="w-4 h-4" /> AI 분석 개요 (1단계)
                      </div>
                      
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[13px] mb-1.5">
                          <Zap className="w-3.5 h-3.5" /> 분석 결과
                        </div>
                        <p className="text-[13px] text-slate-700 leading-relaxed">
                          안녕하세요! 제조업 AI 지능형 분석 시스템입니다. 생산 데이터 분석을 도와드리겠습니다.
                        </p>
                      </div>

                      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-blue-700 font-bold text-[12px] mb-1">다음 단계:</div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            요약 탭에서 국내 제조업 비교 분석을 확인하세요 → 해결책 탭에서 글로벌 트렌드 기반 해결책을 확인하세요
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 처리 현황 및 성과 */}
                    <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-3 text-[15px]">
                        <TrendingUp className="w-4 h-4" /> 처리 현황 및 성과
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-600 text-[13px] font-medium">
                            <Globe className="w-3.5 h-3.5 text-slate-400" /> 번역 정확도:
                          </div>
                          <span className="text-blue-500 font-bold text-[15px]">85%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-600 text-[13px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 컬럼 매칭:
                          </div>
                          <span className="text-emerald-500 font-bold text-[15px]">0개 성공</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-600 text-[13px] font-medium">
                            <Database className="w-3.5 h-3.5 text-fuchsia-400" /> 검색된 데이터:
                          </div>
                          <span className="text-fuchsia-500 font-bold text-[15px]">5건 활용</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <div className="flex items-center gap-1.5 text-slate-600 text-[13px] font-medium">
                            <Activity className="w-3.5 h-3.5 text-orange-400" /> 처리 단계:
                          </div>
                          <span className="text-orange-500 font-bold text-[15px]">4단계 완료</span>
                        </div>
                      </div>
                    </div>

                    {/* 핵심 키워드 */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-3 text-[15px]">
                        <Target className="w-4 h-4 text-slate-400" /> 핵심 키워드
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['제조업', '품질', '생산', '분석'].map((kw, i) => (
                          <span key={i} className="flex items-center gap-1 bg-cyan-50 border border-cyan-200 text-cyan-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                            <Search className="w-3 h-3 text-cyan-500" /> {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽 단 */}
                  <div className="flex flex-col gap-4">
                    {/* 데이터 매칭 결과 */}
                    <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-3 text-[15px]">
                        <BarChart2 className="w-4 h-4" /> 데이터 매칭 결과
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex flex-col items-center justify-center text-center">
                          <div className="flex items-center gap-1.5 text-blue-600 mb-0.5">
                            <Database className="w-4 h-4" />
                            <span className="text-xl font-black">5</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">검색된 데이터</span>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 flex flex-col items-center justify-center text-center">
                          <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
                            <Target className="w-4 h-4" />
                            <span className="text-xl font-black">0</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">매칭된 컬럼</span>
                        </div>
                      </div>
                    </div>

                    {/* 번역 결과 */}
                    <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-1.5 text-amber-600 font-bold mb-3 text-[15px]">
                        <Globe className="w-4 h-4" /> 번역 결과
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="bg-amber-50/30 border border-amber-100 rounded-lg p-3">
                          <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[12px] mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> 원본 질문:
                          </div>
                          <div className="h-8 bg-white border border-amber-100 rounded shadow-sm"></div>
                        </div>
                        
                        <div className="bg-blue-50/30 border border-blue-100 rounded-lg p-3">
                          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[12px] mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> 번역된 질문:
                          </div>
                          <div className="bg-white border border-blue-100 rounded p-2.5 text-[13px] text-slate-700 shadow-sm font-medium">
                            Manufacturing quality analysis
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  <div className="text-center">
                    <LayoutDashboard className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>{activeTab} 기능은 준비 중입니다.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </SmartFactoryWrapper>
  )
}
