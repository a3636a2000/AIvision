import React, { useState } from 'react'
import SmartFactoryWrapper from '@/components/SmartFactoryWrapper'
import {
  Activity, AlertTriangle, BarChart3, Brain, ChevronDown, Clock,
  Database, Download, Eye, LayoutDashboard, Network, Pause,
  ShieldAlert, Target, TrendingUp, Zap, Radio
} from 'lucide-react'

export default function RealtimeInsight() {
  const [activeTab, setActiveTab] = useState('개요')

  const tabs = [
    { id: '개요', icon: Eye },
    { id: '예측', icon: TrendingUp },
    { id: '이상탐지', icon: AlertTriangle },
    { id: '패턴', icon: Target },
    { id: '융합', icon: Zap },
  ]

  return (
    <SmartFactoryWrapper>
      <div className="flex flex-col absolute inset-0 bg-[#f8f9fc] overflow-y-auto">
        
        {/* 헤더 */}
        <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-indigo-500 bg-indigo-50">
              <div className="w-4 h-4 text-indigo-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold text-indigo-600 tracking-tight">실시간 인사이트 플랫폼</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-md text-xs font-bold shadow-sm">
              <Activity className="w-3.5 h-3.5" />
              LIVE
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select className="h-9 px-3 border border-slate-200 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer min-w-[100px]">
              <option>24시간</option>
              <option>1시간</option>
              <option>1주일</option>
            </select>
            <button className="h-9 px-4 flex items-center gap-1.5 bg-emerald-500 text-white rounded-md text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm">
              <Pause className="w-4 h-4 fill-current" /> 일시정지
            </button>
            <button className="h-9 px-4 flex items-center gap-1.5 bg-indigo-500 text-white rounded-md text-sm font-bold hover:bg-indigo-600 transition-colors shadow-sm">
              <Download className="w-4 h-4" /> JSON
            </button>
          </div>
        </div>

        {/* 상단 스탯 (8개) */}
        <div className="px-4 lg:px-6 pt-4 shrink-0">
          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-2 snap-x">
            {/* 데이터 수집 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-w-[160px] flex-1 snap-start relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-sm font-medium">데이터 수집</span>
                <Database className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-800">1361/s</div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-100">
                <div className="h-full bg-blue-500 w-[60%]"></div>
              </div>
            </div>

            {/* 처리된 레코드 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-w-[160px] flex-1 snap-start relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-sm font-medium">처리된 레코드</span>
                <BarChart3 className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-800">38,295</div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-100">
                <div className="h-full bg-emerald-500 w-[80%]"></div>
              </div>
            </div>

            {/* 활성 연결 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-w-[160px] flex-1 snap-start relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-sm font-medium">활성 연결</span>
                <Network className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-800">13</div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-100">
                <div className="h-full bg-purple-500 w-[30%]"></div>
              </div>
            </div>

            {/* 시스템 부하 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-w-[160px] flex-1 snap-start relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-sm font-medium">시스템 부하</span>
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl font-black text-slate-800">91.0%</div>
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100 mx-4" style={{ bottom: '12px', width: 'calc(100% - 32px)' }}>
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>

            {/* 메모리 사용 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-w-[160px] flex-1 snap-start relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-sm font-medium">메모리 사용</span>
                <Zap className="w-6 h-6 text-yellow-500" fill="currentColor" />
              </div>
              <div className="text-2xl font-black text-slate-800">90.0%</div>
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100 mx-4" style={{ bottom: '12px', width: 'calc(100% - 32px)' }}>
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            {/* 이상 탐지 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-w-[160px] flex-1 snap-start relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-sm font-medium">이상 탐지</span>
                <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-2xl font-black text-red-500">2</div>
            </div>

            {/* 알림 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-w-[160px] flex-1 snap-start relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-sm font-medium">알림</span>
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl font-black text-orange-500">2</div>
            </div>

            {/* 업데이트 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-w-[160px] flex-1 snap-start relative overflow-hidden flex flex-col justify-center items-center text-center">
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-1">
                  업데이트 <Clock className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-slate-400">오후 1:58:43</div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="px-4 lg:px-6 shrink-0">
          <div className="flex justify-center border-b border-slate-200 bg-slate-50/50 pt-2 rounded-t-xl mx-auto w-full max-w-4xl mt-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
                  activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.id}
              </button>
            ))}
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 p-4 lg:p-6">
          {activeTab === '개요' && (
            <div className="flex flex-col gap-4">
              
              {/* 중간 요약 카드 4개 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col relative overflow-hidden h-28">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                  <div className="flex items-center gap-2 mb-auto">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">1</div>
                    <span className="font-bold text-slate-800 text-sm">예측 모델</span>
                  </div>
                  <div className="flex items-end justify-center w-full relative">
                    <Brain className="absolute left-0 bottom-0 w-16 h-16 text-blue-50 opacity-50" />
                    <div className="flex items-baseline gap-1 relative z-10">
                      <span className="text-4xl font-black text-blue-600">4</span>
                      <span className="text-slate-500 text-sm font-semibold">개</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fffbfa] rounded-xl shadow-sm border border-red-100 p-4 flex flex-col relative overflow-hidden h-28">
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
                  <div className="flex items-center gap-2 mb-auto">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-[10px] font-bold">2</div>
                    <span className="font-bold text-slate-800 text-sm">이상 탐지</span>
                  </div>
                  <div className="flex items-end justify-center w-full relative">
                    <AlertTriangle className="absolute left-0 bottom-0 w-16 h-16 text-red-50 opacity-50" />
                    <div className="flex items-baseline gap-1 relative z-10">
                      <span className="text-4xl font-black text-red-500">2</span>
                      <span className="text-slate-500 text-sm font-semibold">건</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fffdf0] rounded-xl shadow-sm border border-yellow-200 p-4 flex flex-col relative overflow-hidden h-28">
                  <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                  <div className="flex items-center gap-2 mb-auto">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-[10px] font-bold">3</div>
                    <span className="font-bold text-slate-800 text-sm">패턴</span>
                  </div>
                  <div className="flex items-end justify-center w-full relative">
                    <Target className="absolute left-0 bottom-0 w-16 h-16 text-yellow-50 opacity-50" />
                    <div className="flex items-baseline gap-1 relative z-10">
                      <span className="text-4xl font-black text-yellow-500">4</span>
                      <span className="text-slate-500 text-sm font-semibold">개</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f2fdf7] rounded-xl shadow-sm border border-emerald-200 p-4 flex flex-col relative overflow-hidden h-28">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400"></div>
                  <div className="flex items-center gap-2 mb-auto">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-bold">4</div>
                    <span className="font-bold text-slate-800 text-sm">처리된 레코드</span>
                  </div>
                  <div className="flex items-end justify-center w-full relative">
                    <Activity className="absolute left-0 bottom-0 w-16 h-16 text-emerald-50 opacity-50" />
                    <div className="flex items-baseline gap-1 relative z-10">
                      <span className="text-4xl font-black text-emerald-500">38.3K</span>
                      <span className="text-slate-500 text-sm font-semibold">건</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 3단 상세 카드 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* 1. 예측 모델 */}
                <div className="bg-white rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden flex flex-col min-h-[300px]">
                  <div className="px-4 py-3 flex items-center justify-between border-b border-fuchsia-50 bg-fuchsia-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-white border border-fuchsia-200 text-fuchsia-500 text-xs">
                        i
                      </div>
                      <h2 className="text-base font-bold text-fuchsia-600">예측 모델</h2>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    
                    <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800 text-[15px]">고객 행동 예측 모델</h3>
                        <span className="text-emerald-500 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">ready</span>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-slate-500 text-xs">classification</span>
                        <span className="text-slate-500 text-xs font-medium">정확도: <span className="text-slate-700">87.0%</span></span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800 text-[15px]">수출 예측 모델</h3>
                        <span className="text-emerald-500 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">ready</span>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-slate-500 text-xs">timeseries</span>
                        <span className="text-slate-500 text-xs font-medium">정확도: <span className="text-slate-700">91.0%</span></span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800 text-[15px]">품질 불량 탐지 모델</h3>
                        <span className="text-emerald-500 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">ready</span>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-slate-500 text-xs">anomaly</span>
                        <span className="text-slate-500 text-xs font-medium">정확도: <span className="text-slate-700">94.0%</span></span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. 이상 탐지 */}
                <div className="bg-white rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden flex flex-col min-h-[300px]">
                  <div className="px-4 py-3 flex items-center justify-between border-b border-fuchsia-50 bg-fuchsia-50/50">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-fuchsia-500" />
                      <h2 className="text-base font-bold text-fuchsia-600">이상 탐지</h2>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    
                    <div className="bg-[#fffdf7] border border-slate-100 shadow-sm rounded-lg p-4 flex gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mt-1 shrink-0"></div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-slate-800 text-[14px] leading-tight">피크 시간 대비 시스템 성능 저하 감지</h3>
                        <span className="text-slate-400 text-[11px] mt-1.5 font-medium">2026. 4. 4. 오후 1:13:43</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. 패턴 분석 */}
                <div className="bg-white rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden flex flex-col min-h-[300px]">
                  <div className="px-4 py-3 flex items-center justify-between border-b border-fuchsia-50 bg-fuchsia-50/50">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
                      <h2 className="text-base font-bold text-indigo-600">패턴 분석</h2>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    
                    <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <h3 className="font-bold text-slate-800 text-[15px]">Trend</h3>
                        <span className="text-slate-500 text-xs font-medium">강도: 85%</span>
                      </div>
                      <div className="text-slate-500 text-xs">방향: increasing</div>
                    </div>

                    <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-4 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-[15px]">Seasonal</h3>
                      <span className="text-slate-500 text-xs font-medium">강도: 72%</span>
                    </div>

                    <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-4 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-[15px]">Cyclic</h3>
                      <span className="text-slate-500 text-xs font-medium">강도: 61%</span>
                    </div>

                    <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-4 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-[15px]">Irregular</h3>
                      <span className="text-slate-500 text-xs font-medium">강도: 45%</span>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab !== '개요' && (
            <div className="flex-1 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 h-full min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <LayoutDashboard className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-800 font-bold text-lg mb-1">{activeTab} 상세 화면</h3>
                <p className="text-slate-500 text-sm">해당 탭의 기능은 준비 중입니다.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </SmartFactoryWrapper>
  )
}
