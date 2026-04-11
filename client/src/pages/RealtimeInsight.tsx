import React, { useState } from 'react'
import SmartFactoryWrapper from '@/components/SmartFactoryWrapper'
import {
  Activity, AlertTriangle, BarChart3, Brain, ChevronDown, Clock,
  Database, Download, Eye, LayoutDashboard, Network, Pause,
  ShieldAlert, Target, TrendingUp, Zap, Radio, Play, Settings2,
  Filter, RefreshCw, Search, LineChart, Lightbulb, TrendingDown, Share2
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RealtimeInsight() {
  const [activeTab, setActiveTab] = useState('개요')

  const tabs = [
    { id: '개요', icon: Eye },
    { id: '예측', icon: TrendingUp },
    { id: '이상탐지', icon: AlertTriangle },
    { id: '패턴', icon: Target },
    { id: '융합', icon: Zap },
  ]

  const anomalyChartData = [
    { time: '오후 02:35', value: 1000 },
    { time: '오후 04:35', value: 1000 },
    { time: '오후 06:35', value: 1000 },
    { time: '오후 08:35', value: 1000 },
    { time: '오후 10:35', value: 1000 },
    { time: '오전 12:35', value: 1000 },
    { time: '오전 02:35', value: 1000 },
    { time: '오전 04:35', value: 1000 },
    { time: '오전 06:35', value: 1000 },
    { time: '오전 08:35', value: 1000 },
    { time: '오전 10:35', value: 1000 },
    { time: '오후 12:35', value: 1000 },
    { time: '오후 01:35', value: 1000 },
  ]

  return (
    <SmartFactoryWrapper>
      <div className="flex flex-col absolute inset-0 bg-[#f8f9fc] p-2 overflow-y-auto">
        
        {/* 헤더 */}
        <div className="relative bg-white border border-indigo-100 rounded-xl px-4 py-3 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 z-10 shadow-sm animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-indigo-900 font-bold text-lg tracking-tight">실시간 인사이트 플랫폼</h2>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold shadow-sm">
                  <Activity className="w-3 h-3" />
                  LIVE
                </div>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">실시간 데이터 수집 및 상태 모니터링</p>
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
        <div className="px-4 pt-4 shrink-0 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100 fill-mode-both">
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
        <div className="px-4 shrink-0 animate-in fade-in duration-500 delay-200 fill-mode-both">
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
        <div className="flex-1 p-4 animate-in slide-in-from-bottom-6 fade-in duration-500 delay-300 fill-mode-both">
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

          {activeTab === '예측' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-800 font-bold text-[17px]">예측 모델 관리</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center opacity-80" /> 새 모델 생성
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* 1. 고객 행동 예측 모델 */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="bg-fuchsia-50/50 px-5 py-4 border-b border-fuchsia-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-fuchsia-300 flex items-center justify-center text-fuchsia-500 text-[10px] font-bold">i</div>
                      <h4 className="text-fuchsia-600 font-bold text-lg tracking-tight">고객 행동 예측 모델</h4>
                    </div>
                    <span className="text-emerald-500 font-bold text-[11px] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded shadow-sm">ready</span>
                  </div>
                  <div className="p-6 flex flex-col gap-5">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">모델 타입</p>
                        <p className="text-slate-800 font-semibold text-[13px]">classification</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium mb-1">정확도</p>
                        <p className="text-slate-800 font-semibold text-[13px]">87.0%</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-2">입력 특성</p>
                      <div className="flex flex-wrap gap-2">
                        {['고객유형', '거래빈도', '주문패턴', '지역정보'].map(t => (
                          <span key={t} className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-md">{t}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">목표 컬럼</p>
                      <p className="text-slate-800 font-bold text-[13px]">customer_behavior</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">학습 일시</p>
                      <p className="text-slate-800 font-bold text-[13px]">2026. 4. 11. 오후 1:29:53</p>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <Play className="w-3.5 h-3.5" /> 예측 실행
                      </button>
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <BarChart3 className="w-3.5 h-3.5" /> 성능 평가
                      </button>
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <Settings2 className="w-3.5 h-3.5" /> 설정
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. 수출 예측 모델 */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="bg-fuchsia-50/50 px-5 py-4 border-b border-fuchsia-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-fuchsia-300 flex items-center justify-center text-fuchsia-500 text-[10px] font-bold">i</div>
                      <h4 className="text-fuchsia-600 font-bold text-lg tracking-tight">수출 예측 모델</h4>
                    </div>
                    <span className="text-emerald-500 font-bold text-[11px] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded shadow-sm">ready</span>
                  </div>
                  <div className="p-6 flex flex-col gap-5">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">모델 타입</p>
                        <p className="text-slate-800 font-semibold text-[13px]">timeseries</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium mb-1">정확도</p>
                        <p className="text-slate-800 font-semibold text-[13px]">91.0%</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-2">입력 특성</p>
                      <div className="flex flex-wrap gap-2">
                        {['수출량', '국가별패턴', '환율', '계절성'].map(t => (
                          <span key={t} className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-md">{t}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">목표 컬럼</p>
                      <p className="text-slate-800 font-bold text-[13px]">export_amount</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">학습 일시</p>
                      <p className="text-slate-800 font-bold text-[13px]">2026. 4. 11. 오후 1:29:53</p>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <Play className="w-3.5 h-3.5" /> 예측 실행
                      </button>
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <BarChart3 className="w-3.5 h-3.5" /> 성능 평가
                      </button>
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <Settings2 className="w-3.5 h-3.5" /> 설정
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. 품질 불량 탐지 모델 */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="bg-fuchsia-50/50 px-5 py-4 border-b border-fuchsia-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-fuchsia-300 flex items-center justify-center text-fuchsia-500 text-[10px] font-bold">i</div>
                      <h4 className="text-fuchsia-600 font-bold text-lg tracking-tight">품질 불량 탐지 모델</h4>
                    </div>
                    <span className="text-emerald-500 font-bold text-[11px] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded shadow-sm">ready</span>
                  </div>
                  <div className="p-6 flex flex-col gap-5">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">모델 타입</p>
                        <p className="text-slate-800 font-semibold text-[13px]">anomaly</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium mb-1">정확도</p>
                        <p className="text-slate-800 font-semibold text-[13px]">94.0%</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-2">입력 특성</p>
                      <div className="flex flex-wrap gap-2">
                        {['불량유형', '불량코드', '발생빈도', '제품분류'].map(t => (
                          <span key={t} className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-md">{t}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">목표 컬럼</p>
                      <p className="text-slate-800 font-bold text-[13px]">defect_prediction</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">학습 일시</p>
                      <p className="text-slate-800 font-bold text-[13px]">2026. 4. 11. 오후 1:30:53</p>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <Play className="w-3.5 h-3.5" /> 예측 실행
                      </button>
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <BarChart3 className="w-3.5 h-3.5" /> 성능 평가
                      </button>
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <Settings2 className="w-3.5 h-3.5" /> 설정
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. 주문 최적화 모델 */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="bg-fuchsia-50/50 px-5 py-4 border-b border-fuchsia-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-fuchsia-300 flex items-center justify-center text-fuchsia-500 text-[10px] font-bold">i</div>
                      <h4 className="text-fuchsia-600 font-bold text-lg tracking-tight">주문 최적화 모델</h4>
                    </div>
                    <span className="text-emerald-500 font-bold text-[11px] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded shadow-sm">ready</span>
                  </div>
                  <div className="p-6 flex flex-col gap-5">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">모델 타입</p>
                        <p className="text-slate-800 font-semibold text-[13px]">regression</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium mb-1">정확도</p>
                        <p className="text-slate-800 font-semibold text-[13px]">86.0%</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-2">입력 특성</p>
                      <div className="flex flex-wrap gap-2">
                        {['주문패턴', '고객유형', '계절성', '재고수준'].map(t => (
                          <span key={t} className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-md">{t}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">목표 컬럼</p>
                      <p className="text-slate-800 font-bold text-[13px]">optimal_order_qty</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">학습 일시</p>
                      <p className="text-slate-800 font-bold text-[13px]">2026. 4. 11. 오후 1:30:53</p>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <Play className="w-3.5 h-3.5" /> 예측 실행
                      </button>
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <BarChart3 className="w-3.5 h-3.5" /> 성능 평가
                      </button>
                      <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                        <Settings2 className="w-3.5 h-3.5" /> 설정
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === '이상탐지' && (
            <div className="flex flex-col gap-4">
              {/* 타이틀 및 버튼 영역 */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-slate-800 font-bold text-[17px]">이상 탐지 모니터링</h3>
                <div className="flex gap-2">
                  <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
                    <Filter className="w-3.5 h-3.5" /> 필터
                  </button>
                  <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> 새로고침
                  </button>
                </div>
              </div>

              {/* 차트 카드 영역 */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-1.5 text-cyan-600 font-bold text-sm">
                    <Activity className="w-4 h-4" /> 최근 48시간 이상 탐지
                  </div>
                  <span className="text-slate-600 text-xs bg-white border border-slate-200 px-2 py-1 rounded-md font-bold shadow-sm">
                    실시간 모니터링
                  </span>
                </div>
                <div className="p-5 flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={anomalyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} angle={-15} textAnchor="end" />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 1000]} ticks={[0, 250, 500, 750, 1000]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="#bbf7d0" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* 차트 범례 */}
                  <div className="w-[180px] shrink-0 flex flex-col gap-5 justify-center border-l border-slate-100 pl-6">
                    <div className="flex items-start gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-slate-700 text-[13px] font-bold mb-0.5">예상값</p>
                        <p className="text-slate-400 text-[10px]">정상 범위 예상값</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-slate-700 text-[13px] font-bold mb-0.5">측정값</p>
                        <p className="text-slate-400 text-[10px]">실제 측정된 값</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-red-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-slate-700 text-[13px] font-bold mb-0.5">이상 탐지</p>
                        <p className="text-slate-400 text-[10px]">탐지된 이상 패턴</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-orange-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-slate-700 text-[13px] font-bold mb-0.5">편차</p>
                        <p className="text-slate-400 text-[10px]">예상값 대비 편차</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 2단 카드 영역 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                
                {/* 왼쪽: 실시간 탐지 로그 */}
                <div className="bg-[#fffdf7] border border-amber-100 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
                  <div className="px-5 py-3.5 border-b border-amber-100 flex justify-between items-center bg-[#fffdf7]">
                    <div className="flex items-center gap-1.5 text-red-500 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" /> 실시간 탐지 로그
                    </div>
                    <span className="text-slate-700 text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">최근 1건</span>
                  </div>
                  <div className="p-5 h-full">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 h-full">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <h4 className="text-slate-800 font-bold text-[15px] leading-tight">피크 시간 대비 시스템 성능 저하 감지</h4>
                        </div>
                        <div className="pl-6">
                          <span className="inline-block bg-amber-100 text-amber-700 text-[11px] font-bold px-2.5 py-0.5 rounded shadow-sm">보통</span>
                        </div>
                      </div>
                      
                      <div className="pl-6">
                        <p className="text-slate-500 text-xs font-medium mb-3">2026. 04. 11. 오후 12:50:09</p>
                        
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-600 text-xs font-medium">이상 점수:</span>
                          <span className="text-slate-800 text-xs font-bold">2.1</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4 flex items-center">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: '40%' }} />
                        </div>
                        
                        <p className="text-slate-500 text-[11px] mb-1.5">영향 메트릭:</p>
                        <div className="flex gap-1.5 mb-4">
                          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shadow-sm">시스템 응답시간</span>
                          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shadow-sm">CPU 사용률</span>
                        </div>
                        
                        <p className="text-slate-500 text-[11px] mb-1">권장 조치:</p>
                        <p className="text-slate-700 text-xs font-medium">서버 리소스 모니터링 강화</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 상세 내역 */}
                <div className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm relative h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
                  <div className="p-6 pl-8 flex flex-col gap-6 h-full">
                    
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <h3 className="text-fuchsia-600 font-bold text-lg leading-tight">피크 시간 대비 시스템 성능 저하 감지</h3>
                      </div>
                      <span className="text-slate-600 text-[10px] font-bold bg-fuchsia-50 border border-fuchsia-100 px-2.5 py-1 rounded shadow-sm shrink-0">MEDIUM</span>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pb-6 border-b border-slate-100">
                      <div>
                        <p className="text-slate-500 text-[13px] font-medium mb-2.5">영향받는 메트릭</p>
                        <div className="flex gap-1.5">
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded shadow-sm border border-slate-200">시스템 응답시간</span>
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded shadow-sm border border-slate-200">CPU 사용률</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-slate-500 text-[13px] font-medium">이상 점수</p>
                          <span className="text-slate-800 font-bold text-[17px]">2.1</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex items-center">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: '40%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-slate-800 text-[14px] font-bold mb-3.5">권장 조치</p>
                      <ul className="space-y-2.5">
                        <li className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <span className="text-slate-600 text-[13px] font-medium">서버 리소스 모니터링 강화</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <span className="text-slate-600 text-[13px] font-medium">로드 밸런싱 확인</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <span className="text-slate-600 text-[13px] font-medium">불필요한 프로세스 정리</span>
                        </li>
                      </ul>
                    </div>
                    
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === '패턴' && (
            <div className="flex flex-col gap-4">
              
              {/* 타이틀 및 상단 버튼 */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-slate-800 font-bold text-[17px]">패턴 매칭 & 시계열 분석</h3>
                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
                    <Search className="w-3.5 h-3.5" /> 패턴 검색
                  </button>
                  <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
                    <LineChart className="w-3.5 h-3.5 text-slate-500" /> 시계열 분석
                  </button>
                </div>
              </div>

              {/* 상단 4개 요약 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-600 text-[13px] font-medium">탐지된 패턴</span>
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">4</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-600 text-[13px] font-medium">강한 패턴</span>
                    <LineChart className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-emerald-500">2</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-600 text-[13px] font-medium">이상 패턴</span>
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-2xl font-black text-orange-500">0</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-600 text-[13px] font-medium">예측 정확도</span>
                    <Target className="w-5 h-5 text-fuchsia-500" />
                  </div>
                  <div className="text-2xl font-black text-fuchsia-500">66%</div>
                </div>
              </div>

              {/* 메인 2단 레이아웃 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                
                {/* 좌측: 시계열 패턴 */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[15px] mb-1">
                    <Search className="w-4 h-4 text-blue-500" /> 시계열 패턴
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* 트렌드 */}
                    <div className="bg-white rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden">
                      <div className="px-5 py-3 border-b border-fuchsia-50 bg-fuchsia-50/30 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <h4 className="text-blue-600 font-bold text-[15px]">트렌드</h4>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 font-medium mb-1.5">
                            <span>패턴 강도</span>
                            <span className="text-slate-800 font-bold">85%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div>
                            <span className="text-[11px] text-slate-500 font-medium block mb-1">방향성</span>
                            <span className="inline-block bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">증가</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-500 font-medium block mb-0.5">변화점</span>
                            <span className="text-xs text-slate-700 font-medium">2개 감지됨</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 계절성 */}
                    <div className="bg-white rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden">
                      <div className="px-5 py-3 border-b border-fuchsia-50 bg-fuchsia-50/30 flex items-center gap-2">
                        <LineChart className="w-4 h-4 text-blue-600" />
                        <h4 className="text-blue-600 font-bold text-[15px]">계절성</h4>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 font-medium mb-1.5">
                            <span>패턴 강도</span>
                            <span className="text-slate-800 font-bold">72%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '72%' }} />
                          </div>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 font-medium block mb-0.5">주기</span>
                          <span className="text-xs text-slate-800 font-bold">7일</span>
                        </div>
                      </div>
                    </div>

                    {/* 순환성 */}
                    <div className="bg-white rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden">
                      <div className="px-5 py-3 border-b border-fuchsia-50 bg-fuchsia-50/30 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-fuchsia-500" />
                        <h4 className="text-blue-600 font-bold text-[15px]">순환성</h4>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 font-medium mb-1.5">
                            <span>패턴 강도</span>
                            <span className="text-slate-800 font-bold">61%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '61%' }} />
                          </div>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 font-medium block mb-0.5">주기</span>
                          <span className="text-xs text-slate-800 font-bold">30일</span>
                        </div>
                      </div>
                    </div>

                    {/* 불규칙 */}
                    <div className="bg-white rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden">
                      <div className="px-5 py-3 border-b border-fuchsia-50 bg-fuchsia-50/30 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-fuchsia-500" />
                        <h4 className="text-blue-600 font-bold text-[15px]">불규칙</h4>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 font-medium mb-1.5">
                            <span>패턴 강도</span>
                            <span className="text-slate-800 font-bold">45%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }} />
                          </div>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 font-medium block mb-0.5">변화점</span>
                          <span className="text-xs text-slate-700 font-medium">2개 감지됨</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 우측: 이상 패턴 탐지 & 권장사항 */}
                <div className="flex flex-col gap-5">
                  
                  {/* 이상 패턴 탐지 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1.5 text-orange-500 font-bold text-[15px] mb-1">
                      <AlertTriangle className="w-4 h-4" /> 이상 패턴 탐지
                    </div>
                    
                    <div className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
                      <div className="p-5 pl-7 flex flex-col gap-5">
                        
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <h3 className="text-fuchsia-600 font-bold text-[15px] leading-tight">피크 시간 대비 시스템 성능 저하 감지</h3>
                          </div>
                          <span className="text-slate-600 text-[10px] font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded shadow-sm shrink-0">MEDIUM</span>
                        </div>

                        <div>
                          <p className="text-slate-500 text-[11px] font-medium mb-2">영향받는 메트릭</p>
                          <div className="flex gap-1.5">
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded shadow-sm border border-slate-200">시스템 응답시간</span>
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded shadow-sm border border-slate-200">CPU 사용률</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <p className="text-slate-500 text-[11px] font-medium">이상 점수</p>
                            <span className="text-slate-800 font-bold text-[15px]">2.1</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '40%' }} />
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  {/* 패턴 기반 권장사항 */}
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="bg-white rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden">
                      <div className="px-5 py-4 border-b border-fuchsia-50 bg-fuchsia-50/30 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-fuchsia-500" />
                        <h4 className="text-fuchsia-600 font-bold text-[16px]">패턴 기반 권장사항</h4>
                      </div>
                      <div className="p-5 flex flex-col gap-3">
                        
                        <div className="bg-[#f0f9ff] border border-blue-100 rounded-lg p-3 flex items-start gap-2.5">
                          <Search className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-[13px] font-bold leading-tight">강한 트렌드 패턴을 활용한 예측 모델 구축 권장</span>
                        </div>

                        <div className="bg-[#f0fdf4] border border-emerald-100 rounded-lg p-3 flex items-start gap-2.5">
                          <BarChart3 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-[13px] font-medium leading-tight">계절성 패턴을 고려한 리소스 배분 최적화</span>
                        </div>

                        <div className="bg-[#fffbeb] border border-amber-100 rounded-lg p-3 flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-[13px] font-medium leading-tight">이상 패턴에 대한 자동 알림 시스템 구축</span>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {activeTab === '융합' && (
            <div className="flex flex-col gap-4">
              
              {/* 타이틀 및 상단 버튼 */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-slate-800 font-bold text-[17px]">데이터 융합 네트워크</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> 네트워크 분석
                </button>
              </div>

              {/* 메인 2단 레이아웃 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* 좌측: 주요 엔티티 리스트 (넓은 비율 차지) */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="bg-fuchsia-50/30 rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden flex flex-col h-full">
                    <div className="px-5 py-3 border-b border-fuchsia-100 flex justify-between items-center bg-white/50">
                      <div className="flex items-center gap-2 text-fuchsia-600 font-bold text-[15px]">
                        <Share2 className="w-4 h-4" /> 주요 엔티티 (상위 5개)
                      </div>
                      <span className="text-slate-600 text-[11px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded shadow-sm font-bold">총 48개</span>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-3">
                      
                      {/* 엔티티 카드 1 */}
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">1</div>
                          <div>
                            <h4 className="text-slate-800 font-bold text-[15px] leading-tight mb-1">배선조립체</h4>
                            <span className="text-slate-500 text-[10px] font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">product</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-md border border-slate-100">
                            <span className="text-blue-600 font-bold text-lg leading-none mb-1">2</span>
                            <span className="text-slate-500 text-[11px]">연결 수</span>
                            <div className="w-full mt-2 h-1 bg-slate-200 rounded-full overflow-hidden flex items-center gap-1.5">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                            </div>
                            <span className="text-blue-500 text-[10px] font-bold mt-1 self-end">100%</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-md border border-slate-100">
                            <span className="text-orange-500 font-bold text-lg leading-none mb-1">0</span>
                            <span className="text-slate-500 text-[11px]">리스크 점수</span>
                          </div>
                        </div>
                      </div>

                      {/* 엔티티 카드 2 */}
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">2</div>
                          <div>
                            <h4 className="text-slate-800 font-bold text-[15px] leading-tight mb-1">배선조립체</h4>
                            <span className="text-slate-500 text-[10px] font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">product</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-md border border-slate-100">
                            <span className="text-blue-600 font-bold text-lg leading-none mb-1">2</span>
                            <span className="text-slate-500 text-[11px]">연결 수</span>
                            <div className="w-full mt-2 h-1 bg-slate-200 rounded-full overflow-hidden flex items-center gap-1.5">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                            </div>
                            <span className="text-blue-500 text-[10px] font-bold mt-1 self-end">100%</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-md border border-slate-100">
                            <span className="text-orange-500 font-bold text-lg leading-none mb-1">0</span>
                            <span className="text-slate-500 text-[11px]">리스크 점수</span>
                          </div>
                        </div>
                      </div>

                      {/* 엔티티 카드 3 */}
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">3</div>
                          <div>
                            <h4 className="text-slate-800 font-bold text-[15px] leading-tight mb-1">배선조립체</h4>
                            <span className="text-slate-500 text-[10px] font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">product</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-md border border-slate-100">
                            <span className="text-blue-600 font-bold text-lg leading-none mb-1">2</span>
                            <span className="text-slate-500 text-[11px]">연결 수</span>
                            <div className="w-full mt-2 h-1 bg-slate-200 rounded-full overflow-hidden flex items-center gap-1.5">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                            </div>
                            <span className="text-blue-500 text-[10px] font-bold mt-1 self-end">100%</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-md border border-slate-100">
                            <span className="text-orange-500 font-bold text-lg leading-none mb-1">0</span>
                            <span className="text-slate-500 text-[11px]">리스크 점수</span>
                          </div>
                        </div>
                      </div>

                      {/* 엔티티 카드 4 */}
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">4</div>
                          <div>
                            <h4 className="text-slate-800 font-bold text-[13px] leading-tight mb-1">D4H LOOSE LINK & PIN&BUSH GROUP WITH SEAL</h4>
                            <span className="text-slate-500 text-[10px] font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">product</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-md border border-slate-100">
                            <span className="text-blue-600 font-bold text-lg leading-none mb-1">1</span>
                            <span className="text-slate-500 text-[11px]">연결 수</span>
                            <div className="w-full mt-2 h-1 bg-slate-200 rounded-full overflow-hidden flex items-center gap-1.5">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }} />
                            </div>
                            <span className="text-blue-400 text-[10px] font-bold mt-1 self-end">50%</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-md border border-slate-100">
                            <span className="text-orange-500 font-bold text-lg leading-none mb-1">0</span>
                            <span className="text-slate-500 text-[11px]">리스크 점수</span>
                          </div>
                        </div>
                      </div>

                      {/* 엔티티 카드 5 */}
                      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">5</div>
                          <div>
                            <h4 className="text-slate-800 font-bold text-[13px] leading-tight mb-1">D4H LOOSE LINK & PIN&BUSH GROUP WITH SEAL</h4>
                            <span className="text-slate-500 text-[10px] font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">product</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-md border border-slate-100">
                            <span className="text-blue-600 font-bold text-lg leading-none mb-1">1</span>
                            <span className="text-slate-500 text-[11px]">연결 수</span>
                            <div className="w-full mt-2 h-1 bg-slate-200 rounded-full overflow-hidden flex items-center gap-1.5">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }} />
                            </div>
                            <span className="text-blue-400 text-[10px] font-bold mt-1 self-end">50%</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-md border border-slate-100">
                            <span className="text-orange-500 font-bold text-lg leading-none mb-1">0</span>
                            <span className="text-slate-500 text-[11px]">리스크 점수</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center py-2 text-slate-400 text-[11px] font-bold">
                        +43개의 추가 엔티티가 있습니다
                      </div>

                    </div>
                  </div>
                </div>

                {/* 우측: 인사이트 텍스트 요약 */}
                <div className="lg:col-span-7 flex flex-col h-full">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
                    <div className="px-5 py-4 border-b border-fuchsia-50 bg-fuchsia-50/30 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-fuchsia-500" />
                      <h4 className="text-fuchsia-600 font-bold text-[16px]">인사이트</h4>
                    </div>
                    
                    <div className="p-6 flex flex-col gap-4">
                      
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-[13px] text-slate-700 leading-relaxed font-medium shadow-sm">
                        네트워크는 product 중심으로 구성되어 있습니다 (42개, 87.5%).
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-[13px] text-slate-700 leading-relaxed font-medium shadow-sm">
                        주요 관계 유형은 product_related입니다 (4개 관계).
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-[13px] text-slate-700 leading-relaxed font-medium shadow-sm">
                        높은 데이터 품질로 신뢰할 수 있는 분석 결과를 제공합니다.
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-[13px] text-slate-700 leading-relaxed font-medium shadow-sm">
                        낮은 연결성으로 단순한 관계 구조를 가집니다.
                      </div>

                      <div className="mt-4">
                        <h5 className="font-bold text-slate-800 text-[15px] mb-3">주요 관계</h5>
                        <div className="flex flex-col gap-2">
                          
                          <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg text-[12px]">
                            <span className="font-bold text-slate-700">product_25002C001</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-bold text-slate-700">product_G2W002</span>
                            <span className="text-slate-400 font-medium ml-auto">(product_related, 30%)</span>
                          </div>

                          <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg text-[12px]">
                            <span className="font-bold text-slate-700">product_25002C001</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-bold text-slate-700">product_G2C001</span>
                            <span className="text-slate-400 font-medium ml-auto">(product_related, 30%)</span>
                          </div>

                          <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg text-[12px]">
                            <span className="font-bold text-slate-700">product_G2W002</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-bold text-slate-700">product_G2C001</span>
                            <span className="text-slate-400 font-medium ml-auto">(product_related, 30%)</span>
                          </div>

                          <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg text-[12px]">
                            <span className="font-bold text-slate-700">product_P-G0-D4HXXX-0-361</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-bold text-slate-700">product_P-G0-D4HXXX-0-111</span>
                            <span className="text-slate-400 font-medium ml-auto">(product_related, 30%)</span>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab !== '개요' && activeTab !== '예측' && activeTab !== '이상탐지' && activeTab !== '패턴' && activeTab !== '융합' && (
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
