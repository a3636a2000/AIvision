import React, { useState } from 'react'
import SmartFactoryWrapper from '@/components/SmartFactoryWrapper'
import {
  Database, Zap, ShieldCheck, Share2, Clock, 
  Eye, Grid, Network, Cpu, FileSearch, CheckCircle2,
  RefreshCw, Trash2, Activity, Play, Square, Settings2,
  AlertTriangle, ArrowUpRight, Check
} from 'lucide-react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts'

export default function AiPattern() {
  const [activeTab, setActiveTab] = useState('개요')

  // 테이블 성장 추이 차트 데이터
  const growthData = [
    { name: '1월', total: 40, vectorized: 35, relations: 80 },
    { name: '2월', total: 45, vectorized: 40, relations: 80 },
    { name: '3월', total: 55, vectorized: 42, relations: 80 },
    { name: '4월', total: 60, vectorized: 45, relations: 78 },
    { name: '5월', total: 68, vectorized: 50, relations: 90 },
    { name: '6월', total: 65, vectorized: 48, relations: 85 },
    { name: '7월', total: 72, vectorized: 55, relations: 105 },
    { name: '8월', total: 65, vectorized: 58, relations: 100 },
    { name: '9월', total: 68, vectorized: 58, relations: 95 },
    { name: '10월', total: 68, vectorized: 58, relations: 125 },
    { name: '11월', total: 70, vectorized: 60, relations: 122 },
    { name: '12월', total: 80, vectorized: 65, relations: 128 },
  ]

  // 관계 유형 분포 파이 차트 데이터
  const relationData = [
    { name: 'Foreign Key', value: 45, color: '#a855f7' },
    { name: 'Naming Pattern', value: 30, color: '#06b6d4' },
    { name: 'Data Match', value: 15, color: '#f59e0b' },
    { name: 'Inferred', value: 10, color: '#10b981' },
  ]

  const tabs = [
    { id: '개요', icon: Eye },
    { id: '테이블', icon: Grid },
    { id: '관계 매퍼', icon: Network },
    { id: 'AI', icon: Cpu },
    { id: '리니지', icon: Share2 },
    { id: '품질', icon: ShieldCheck },
  ]

  return (
    <SmartFactoryWrapper>
      <div className="flex flex-col absolute inset-0 bg-[#f8f9fc] overflow-y-auto">
        
        {/* 상단 헤더 영역 */}
        <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-indigo-900 tracking-tight">AI 온톨로지 관리</h1>
              <p className="text-slate-500 text-[13px] mt-0.5">실시간 데이터 통합 및 지능형 AI 온톨로지 관리</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 mr-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                캐시: 16초 전
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                스트림 활성
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                소스: 활성
              </div>
            </div>
            
            <button className="h-9 px-3 flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors">
              <Square className="w-3.5 h-3.5 fill-current" /> 스트림 정지
            </button>
            <button className="h-9 px-3 flex items-center gap-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
              <Activity className="w-4 h-4" /> 수동모드
            </button>
            <button className="h-9 px-3 flex items-center gap-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
              <RefreshCw className="w-4 h-4" /> 강제 새로고침
            </button>
            <button className="h-9 px-3 flex items-center gap-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
              <Trash2 className="w-4 h-4" /> 캐시 초기화
            </button>
          </div>
        </div>

        {/* 5개 스코어 카드 영역 */}
        <div className="p-4 lg:p-6 pb-2 shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-28 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">1</div>
                <span className="text-slate-700 font-bold text-sm">총 테이블</span>
              </div>
              <div className="flex-1 flex bg-[#f0f7ff] relative overflow-hidden">
                <div className="w-12 h-full flex items-end pb-3 pl-3 opacity-30">
                  <Database className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-blue-600 tracking-tight">10</span>
                  </div>
                  <span className="text-slate-500 text-sm font-semibold">개</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-28 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500"></div>
              <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 font-bold text-[10px]">2</div>
                <span className="text-slate-700 font-bold text-sm">적재 완료</span>
              </div>
              <div className="flex-1 flex bg-[#fdf5fc] relative overflow-hidden">
                <div className="w-12 h-full flex items-end pb-3 pl-3 opacity-30">
                  <Zap className="w-8 h-8 text-fuchsia-500" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-fuchsia-600 tracking-tight">7</span>
                  </div>
                  <span className="text-slate-500 text-sm font-semibold">개</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-28 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400"></div>
              <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[10px]">3</div>
                <span className="text-slate-700 font-bold text-sm">품질 점수</span>
              </div>
              <div className="flex-1 flex bg-[#fefce8] relative overflow-hidden">
                <div className="w-12 h-full flex items-end pb-3 pl-3 opacity-30">
                  <ShieldCheck className="w-8 h-8 text-amber-500" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-emerald-600 tracking-tight">90.5%</span>
                  </div>
                  <span className="text-slate-500 text-sm font-semibold">평균</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-28 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
              <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[10px]">4</div>
                <span className="text-slate-700 font-bold text-sm">관계</span>
              </div>
              <div className="flex-1 flex bg-[#fff7ed] relative overflow-hidden">
                <div className="w-12 h-full flex items-end pb-3 pl-3 opacity-30">
                  <Network className="w-8 h-8 text-orange-500" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-orange-600 tracking-tight">8</span>
                  </div>
                  <span className="text-slate-500 text-sm font-semibold">개</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-28 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-teal-400"></div>
              <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-[10px]">5</div>
                <span className="text-slate-700 font-bold text-sm">캐시 주기</span>
              </div>
              <div className="flex-1 flex bg-[#f0fdfa] relative overflow-hidden">
                <div className="w-12 h-full flex items-end pb-3 pl-3 opacity-30">
                  <Clock className="w-8 h-8 text-teal-500" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-teal-600 tracking-tight">15</span>
                  </div>
                  <span className="text-slate-500 text-sm font-semibold">분</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="px-4 lg:px-6 shrink-0 mt-2">
          <div className="flex justify-center border-b border-slate-200 bg-slate-50/50 pt-2 rounded-t-xl mx-auto w-full max-w-4xl">
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

        {/* 탭 컨텐츠 (개요) */}
        <div className="flex-1 p-4 lg:p-6 lg:pt-4">
          {activeTab === '개요' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              
              {/* 시스템 현황 */}
              <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden flex flex-col">
                <div className="px-4 py-3 flex items-center gap-2 border-b border-indigo-50 bg-indigo-50/30">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-[15px] font-bold text-indigo-600">시스템 현황</h2>
                </div>
                <div className="p-5 flex flex-col gap-6 flex-1">
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-800 font-bold text-sm">적재 진행률</span>
                      <span className="text-blue-600 font-black text-lg">70%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 w-full"></div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">마지막 동기화</span>
                    <span className="text-slate-800 font-semibold text-sm">2026. 4. 4. 오후 1:49:19</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">평균 품질 점수</span>
                    <span className="text-emerald-600 font-bold text-sm">90.5%</span>
                  </div>
                  
                </div>
              </div>

              {/* 주의사항 */}
              <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden flex flex-col">
                <div className="px-4 py-3 flex items-center gap-2 border-b border-amber-50 bg-amber-50/30">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h2 className="text-[15px] font-bold text-amber-600">주의사항</h2>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  
                  <div className="bg-[#fffdf7] border border-amber-200 rounded-lg p-4 flex items-center justify-between hover:bg-amber-50 transition-colors cursor-pointer">
                    <div>
                      <h3 className="text-slate-800 font-bold text-[15px]">반품 마스터</h3>
                      <p className="text-slate-500 text-xs mt-1">데이터 품질 점검 필요</p>
                    </div>
                    <div className="px-2.5 py-1 bg-white border border-amber-300 rounded-full text-amber-600 font-bold text-xs shadow-sm">
                      79.8%
                    </div>
                  </div>

                </div>
              </div>

              {/* 테이블 성장 추이 */}
              <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden flex flex-col">
                <div className="px-4 py-3 flex items-center gap-2 border-b border-purple-50 bg-purple-50/30">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <h2 className="text-[15px] font-bold text-purple-600">테이블 성장 추이</h2>
                </div>
                <div className="px-5 pt-3 pb-1">
                  <p className="text-slate-400 text-xs leading-relaxed">
                    원본 테이블 수, 적재된 테이블 수, 관계 수의 변화 추이를 시계열로 표시합니다. 시간에 따른 AI 온톨로지 확장 패턴을 확인할 수 있습니다.
                  </p>
                </div>
                <div className="p-2 flex-1 min-h-[220px] pb-4 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                      />
                      <Legend 
                        iconType="circle" 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                        layout="vertical" verticalAlign="middle" align="right"
                        payload={[
                          { value: '전체 테이블', type: 'square', color: '#a855f7' },
                          { value: '적재됨', type: 'square', color: '#06b6d4' },
                          { value: '관계', type: 'square', color: '#f59e0b' },
                        ]}
                      />
                      <Line type="monotone" dataKey="relations" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} name="관계" />
                      <Line type="monotone" dataKey="total" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: '#a855f7', strokeWidth: 2, stroke: '#fff' }} name="전체 테이블" />
                      <Line type="monotone" dataKey="vectorized" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }} name="적재됨" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 관계 유형 분포 */}
              <div className="bg-white rounded-xl shadow-sm border border-fuchsia-100 overflow-hidden flex flex-col">
                <div className="px-4 py-3 flex items-center gap-2 border-b border-fuchsia-50 bg-fuchsia-50/30">
                  <Network className="w-4 h-4 text-fuchsia-500" />
                  <h2 className="text-[15px] font-bold text-fuchsia-600">관계 유형 분포</h2>
                </div>
                <div className="px-5 pt-3 pb-1">
                  <p className="text-slate-400 text-xs leading-relaxed">
                    테이블 간 관계를 유형별로 분류하여 표시합니다. Foreign Key, Naming Pattern, Data Match, Inferred 등 각 관계 유형의 비율을 확인할 수 있습니다.
                  </p>
                </div>
                <div className="p-2 flex-1 min-h-[220px] pb-4 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={relationData}
                        cx="40%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {relationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ fontSize: '11px', lineHeight: '24px' }}
                        payload={relationData.map((item) => ({
                          id: item.name,
                          type: 'circle',
                          value: `${item.name} (${item.value}개)`,
                          color: item.color
                        }))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {activeTab !== '개요' && (
            <div className="flex-1 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 h-full min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Settings2 className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-800 font-bold text-lg mb-1">{activeTab} 화면</h3>
                <p className="text-slate-500 text-sm">해당 탭의 기능은 준비 중입니다.</p>
              </div>
            </div>
          )}
        </div>

        {/* 상태 표시줄 */}
        <div className="bg-white border-t border-slate-200 px-4 py-2 shrink-0 flex items-center gap-3 relative z-10">
          <Activity className="w-4 h-4 text-blue-600" />
          <span className="text-slate-800 font-bold text-[13px]">실시간 이벤트 스트림 & 데이터 소스 현황</span>
          <span className="px-1.5 py-0.5 bg-emerald-500 text-white font-bold text-[10px] rounded">LIVE</span>
        </div>

        {/* 플로팅 액션 버튼 */}
        <div className="fixed bottom-12 right-8 z-50">
          <button className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 group">
            <Zap className="w-5 h-5 fill-current" />
          </button>
        </div>

      </div>
    </SmartFactoryWrapper>
  )
}