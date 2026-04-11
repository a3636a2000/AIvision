import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload,
  Download,
  ArrowRight,
  ArrowDown,
  ScanLine,
  Eraser,
  LayoutDashboard,
  Factory,
  Eye,
  Package,
  BarChart2,
  Award,
  Cpu,
  Settings,
  FileText,
  Image,
  Video,
  MessageSquare,
  Database,
  AppWindow,
  Activity,
} from 'lucide-react'
import Footer from '../components/Footer'

import heroBg from '../assets/hero-bg-2.mp4'

const Home = () => {
  const navigate = useNavigate()

  const workflowSteps = [
    { icon: Upload,    text: '데이터 업로드' },
    { icon: Eraser,    text: '전처리·정제' },
    { icon: ScanLine,  text: 'AI 분석·인식' },
    { icon: BarChart2, text: '시각화·리포트' },
    { icon: Download,  text: '결과 다운로드' },
  ]

  const sfCards = [
    {
      icon: LayoutDashboard,
      title: '스마트 대시보드',
      desc: '생산 라인 KPI, 불량률 Pareto 차트, 실시간 품질 현황을 한눈에 모니터링',
      path: '/sf-dashboard',
      gradient: 'from-blue-600 to-cyan-500',
      badge: '실시간',
    },
    {
      icon: Factory,
      title: '작업 실적 등록',
      desc: 'MES 바코드/QR 스캔으로 공정별 생산 실적·불량 수량을 빠르게 등록·관리',
      path: '/sf-production',
      gradient: 'from-emerald-500 to-teal-500',
      badge: 'MES 연동',
    },
    {
      icon: Eye,
      title: 'AI 비전 모니터링',
      desc: '실시간 웹캠 AI 불량 감지, 신뢰도 스코어, 이미지 캡처 히스토리 로그',
      path: '/sf-vision',
      gradient: 'from-violet-500 to-purple-600',
      badge: 'AI 검사',
    },
    {
      icon: Settings,
      title: 'AI 비전 검사 설정',
      desc: '딥러닝 모델 학습 및 하드웨어 비전 장비 연동 설정',
      path: '/sf-vision-setup',
      gradient: 'from-pink-500 to-rose-500',
      badge: '설정',
    },
    {
      icon: Package,
      title: '검사 요청 등록',
      desc: '품목에 대한 검사 요청 등록 및 AI 비전 자동 불량 판별 등록',
      path: '/sf-defect-types',
      gradient: 'from-amber-500 to-orange-500',
      badge: '기준정보',
    },
    {
      icon: Package,
      title: '품목등록',
      desc: '스마트팩토리에서 사용할 제품 및 자재의 기준 정보 관리',
      path: '/sf-items',
      gradient: 'from-indigo-500 to-blue-600',
      badge: '마스터',
    },
  ]

  const aiDataCards = [
    {
      icon: Settings,
      title: '데이터베이스 설정',
      desc: '모든 테이블 데이터의 백터화 파이프라인(TF-IDF/임베딩) 설정 및 관리',
      path: '/ai-data-setup',
      gradient: 'from-fuchsia-500 to-pink-500',
      badge: '데이터',
    },
    {
      icon: LayoutDashboard,
      title: 'AI 온톨로지 분석',
      desc: '데이터 간의 관계 및 의미를 분석하는 지식 그래프 모델링',
      path: '/ai-ontology',
      gradient: 'from-blue-500 to-indigo-500',
      badge: '분석',
    },
    {
      icon: FileText,
      title: 'AI 온톨로지 관리',
      desc: '빅데이터 기반의 유사 패턴 탐색 및 상관관계 매칭 알고리즘',
      path: '/ai-pattern',
      gradient: 'from-teal-500 to-emerald-500',
      badge: '알고리즘',
    },
    {
      icon: Activity,
      title: '실시간 인사이트 플랫폼',
      desc: '실시간 데이터 수집 및 AI 모델을 활용한 예측, 이상 탐지, 패턴 분석 제공',
      path: '/ai-insight',
      gradient: 'from-indigo-500 to-purple-600',
      badge: 'LIVE',
    },
  ]

  const basicCards = [
    {
      icon: FileText,
      title: 'PDF 변환',
      desc: '문서 파일을 PDF로 변환하거나 PDF를 이미지/텍스트로 추출',
      path: '/pdf-converter',
      gradient: 'from-rose-500 to-red-500',
      badge: '유틸',
    },
    {
      icon: Image,
      title: '이미지 편집',
      desc: '이미지 자르기, 필터 적용, 색상 조정 등 간편한 이미지 편집기',
      path: '/image-editor',
      gradient: 'from-orange-400 to-amber-500',
      badge: '유틸',
    },
    {
      icon: Video,
      title: '동영상 제작',
      desc: '이미지와 텍스트를 활용한 AI 기반 숏폼 동영상 자동 생성',
      path: '/video-maker',
      gradient: 'from-cyan-500 to-blue-500',
      badge: '유틸',
    },
    {
      icon: MessageSquare,
      title: '채팅',
      desc: '실시간 소통을 위한 사내 협업 메신저 및 알림 채널',
      path: '/chat',
      gradient: 'from-emerald-400 to-green-500',
      badge: '협업',
    },
  ]

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      {/* ── 헤더 (백그라운드 애니메이션 적용 - 전체 너비) ── */}
      <div className="relative w-full overflow-hidden bg-slate-900">
        {/* 백그라운드 애니메이션 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video 
            src={heroBg} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-80"
          />
          {/* 어두운 오버레이 및 하단 자연스러운 그라데이션 (화이트톤으로 페이드아웃) */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 pt-20 pb-32 sm:pt-28 sm:pb-40 max-w-5xl mx-auto">
          {/* 기관 배지 */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-6 shadow-sm backdrop-blur-md">
            <Award className="w-3.5 h-3.5 opacity-80" />
            한국 품질재단 (KFQ) 공식 실습 플랫폼
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg leading-tight">
            제조 AI 데이터분석
            <br />
            <span className="text-blue-400">스마트팩토리 실습</span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-12 font-medium drop-shadow">
            AI 비전 불량 검사 · MES 작업실적 관리 · 생산 대시보드부터
            <br className="hidden sm:block" />
            PDF 문서 편집·AI 동영상 제작까지 통합 실습 환경을 제공합니다
          </p>

          {/* 통계 뱃지 */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            {[
              { label: '실습 모듈', value: '13개' },
              { label: 'AI 기능', value: '10+' },
              { label: '스마트팩토리', value: '4종' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl transition-transform hover:-translate-y-1">
                <span className="text-blue-400 font-black text-2xl sm:text-3xl mb-1.5 drop-shadow-md">{stat.value}</span>
                <span className="text-slate-300 text-xs sm:text-sm font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-20 -mt-10">

        {/* ── 스마트팩토리 실습 모듈 섹션 ── */}
        <div className="mb-8 sm:mb-12 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100 fill-mode-both">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 border border-blue-200">
              <Factory className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wider">
              스마트팩토리 실습 모듈
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sfCards.map((card) => (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-4 sm:p-5 text-left hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50 active:bg-slate-50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-slate-800 font-bold text-sm">{card.title}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-600 font-semibold shrink-0">
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">{card.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── AI 데이터분석 섹션 ── */}
        <div className="mb-8 sm:mb-12 animate-in slide-in-from-bottom-6 fade-in duration-500 delay-200 fill-mode-both">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 border border-blue-200">
              <Database className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wider">
              AI 데이터분석
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiDataCards.map((card) => (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-4 sm:p-5 text-left hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50 active:bg-slate-50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-slate-800 font-bold text-sm">{card.title}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-600 font-semibold shrink-0">
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">{card.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── 기본서비스 섹션 ── */}
        <div className="mb-8 sm:mb-12 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-300 fill-mode-both">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 border border-blue-200">
              <AppWindow className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-blue-700 uppercase tracking-wider">
              기본서비스
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {basicCards.map((card) => (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-4 sm:p-5 text-left hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50 active:bg-slate-50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-slate-800 font-bold text-sm">{card.title}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-semibold shrink-0">
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">{card.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── 데이터 흐름 ── */}
        <div className="mb-8 sm:mb-12 animate-in slide-in-from-bottom-10 fade-in duration-500 delay-500 fill-mode-both">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
            제조 AI 데이터 처리 흐름
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            {workflowSteps.map((step, i, arr) => (
              <React.Fragment key={step.text}>
                <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-lg px-4 py-2.5 w-full sm:w-auto justify-center font-medium">
                  <step.icon className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-slate-700 text-sm whitespace-nowrap">{step.text}</span>
                </div>
                {i < arr.length - 1 && (
                  <>
                    <ArrowDown className="w-4 h-4 text-slate-300 shrink-0 sm:hidden" />
                    <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:block" />
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default Home
