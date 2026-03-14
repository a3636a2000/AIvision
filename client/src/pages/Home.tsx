import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  ScanLine,
  Move,
  Upload,
  Type,
  Download,
  ArrowRight,
  ArrowDown,
  Eraser,
  Ruler,
  Video,
  ExternalLink,
  BookOpen,
  LayoutDashboard,
  Factory,
  Eye,
  BarChart2,
  Award,
  Cpu,
} from 'lucide-react'
import Footer from '../components/Footer'

const Home = () => {
  const navigate = useNavigate()

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
        navigate('/pdf-converter', { state: { file } })
      }
    },
    [navigate]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleFileSelect = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) navigate('/pdf-converter', { state: { file } })
    }
    input.click()
  }, [navigate])

  const workflowSteps = [
    { icon: Upload,    text: '데이터 업로드' },
    { icon: Eraser,    text: '전처리·정제' },
    { icon: ScanLine,  text: 'AI 분석·인식' },
    { icon: BarChart2, text: '시각화·리포트' },
    { icon: Download,  text: '결과 다운로드' },
  ]

  // 제조 AI 스마트팩토리 실습 메뉴
  const sfCards = [
    {
      icon: LayoutDashboard,
      title: '통합 대시보드',
      desc: '생산 라인 KPI, 불량률 Pareto 차트, 실시간 품질 현황을 한눈에 모니터링',
      path: '/sf-dashboard',
      gradient: 'from-blue-600 to-cyan-500',
      badge: '실시간',
    },
    {
      icon: Factory,
      title: '작업실적 등록',
      desc: 'MES 바코드/QR 스캔으로 공정별 생산 실적·불량 수량을 빠르게 등록·관리',
      path: '/sf-production',
      gradient: 'from-emerald-500 to-teal-500',
      badge: 'MES 연동',
    },
    {
      icon: Eye,
      title: 'AI 비전 검사',
      desc: '실시간 웹캠 AI 불량 감지, 신뢰도 스코어, 이미지 캡처 히스토리 로그',
      path: '/sf-vision',
      gradient: 'from-violet-500 to-purple-600',
      badge: 'AI 검사',
    },
  ]

  // AI 문서 편집 도구
  const toolCards = [
    {
      icon: FileText,
      title: 'PDF 변환 & 워터마크 제거',
      items: ['PDF/이미지를 고해상도 슬라이드로 변환', '워터마크 자동 감지 및 제거', '이미지·PDF·PPT 다양한 형식 다운로드'],
      path: '/pdf-converter',
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      icon: Type,
      title: 'AI 한글 텍스트 복원',
      items: ['깨진 한글 영역 선택 → AI OCR 자동 인식', '원본 폰트 크기·두께 측정 후 자연스럽게 교체', '편집 결과를 이미지·PDF에 바로 반영'],
      path: '/image-editor',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Move,
      title: '이미지 조각 이동',
      items: ['선택 영역의 이미지를 드래그로 이동', '8개 핸들로 선택 영역 크기 조절', 'Ctrl+Z로 실행 취소'],
      path: '/image-editor',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Ruler,
      title: '정밀 편집 도구',
      items: ['원본 글자 높이·획 두께 픽셀 단위 측정', '폰트 크기 슬라이더 + 볼드 토글', 'Ctrl+마우스 휠로 이미지 확대/축소'],
      path: '/image-editor',
      gradient: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="flex-1 overflow-auto bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── 헤더 ── */}
        <div className="text-center mb-8 sm:mb-12">
          {/* 기관 배지 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3 sm:mb-4">
            <Award className="w-3.5 h-3.5" />
            한국 품질재단 (KFQ) 공식 실습 플랫폼
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            제조 AI 데이터분석
            <span className="text-blue-400 ml-2">스마트팩토리 실습</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            AI 비전 불량 검사 · MES 작업실적 관리 · 생산 대시보드부터
            PDF 문서 편집·AI 동영상 제작까지 통합 실습 환경을 제공합니다
          </p>

          {/* 통계 뱃지 */}
          <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
            {[
              { label: '실습 모듈', value: '6개' },
              { label: 'AI 기능', value: '10+' },
              { label: '스마트팩토리', value: '3종' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 rounded-lg border border-gray-700/40">
                <span className="text-blue-400 font-bold text-sm">{stat.value}</span>
                <span className="text-gray-500 text-xs">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 제조 AI 스마트팩토리 실습 섹션 ── */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center shrink-0">
              <Cpu className="w-3 h-3 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
              스마트팩토리 실습 모듈
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sfCards.map((card) => (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="w-full bg-gray-900/60 border border-gray-800/60 rounded-xl p-4 sm:p-5 text-left hover:border-blue-500/40 hover:bg-blue-500/5 active:bg-gray-800/40 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium text-sm">{card.title}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-medium shrink-0">
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── 데이터 흐름 ── */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-4 text-center">
            제조 AI 데이터 처리 흐름
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            {workflowSteps.map((step, i, arr) => (
              <React.Fragment key={step.text}>
                <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-4 py-2.5 w-full sm:w-auto justify-center">
                  <step.icon className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-gray-300 text-sm whitespace-nowrap">{step.text}</span>
                </div>
                {i < arr.length - 1 && (
                  <>
                    <ArrowDown className="w-4 h-4 text-gray-600 shrink-0 sm:hidden" />
                    <ArrowRight className="w-4 h-4 text-gray-600 shrink-0 hidden sm:block" />
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── PDF 업로드 드롭존 ── */}
        <div
          className="mb-8 sm:mb-12 cursor-pointer group"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleFileSelect}
        >
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-700/60 p-5 sm:p-7 hover:border-blue-500/40 active:border-blue-500/50 transition-all duration-300">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-gray-300 font-medium text-sm sm:text-base mb-1">
                  PDF 또는 이미지 파일을 드래그하거나 클릭하세요
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  PDF 업로드 → 워터마크 제거 → 한글 OCR 복원 → 편집 → 다운로드
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI 문서 편집 도구 ── */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-4 sm:mb-5 text-center">
            AI 문서 편집 도구
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolCards.map((card) => (
              <button
                key={card.title}
                onClick={() => navigate(card.path)}
                className="w-full bg-gray-900/60 border border-gray-800/60 rounded-xl p-4 sm:p-6 text-left hover:border-gray-700 active:bg-gray-800/40 transition-all group"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm sm:text-base mb-1 sm:mb-1.5">{card.title}</h3>
                    <ul className="space-y-1">
                      {card.items.map((item) => (
                        <li key={item} className="text-gray-500 text-xs flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── 외부 서비스 & 동영상 ── */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-4 sm:mb-5 text-center">
            서비스 바로가기
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://notebooklm.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/60 border border-gray-800/60 rounded-xl p-4 sm:p-5 hover:border-blue-500/40 hover:bg-blue-500/5 active:bg-gray-800/40 transition-all group flex items-center gap-3 sm:gap-4"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium text-sm sm:text-base">Google NotebookLM</h3>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors shrink-0" />
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  AI 기반 노트북으로 자료 정리 → PDF 내보내기 후 동영상 스튜디오에 활용
                </p>
              </div>
            </a>

            <button
              onClick={() => navigate('/video-maker')}
              className="w-full bg-gray-900/60 border border-gray-800/60 rounded-xl p-4 sm:p-5 text-left hover:border-indigo-500/40 hover:bg-indigo-500/5 active:bg-gray-800/40 transition-all group flex items-center gap-3 sm:gap-4"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm sm:text-base">AI 동영상 스튜디오</h3>
                <p className="text-gray-500 text-xs mt-1">
                  PDF·이미지·영상 → AI 나레이션 + TTS 음성 → WebM/PPTX 내보내기
                </p>
              </div>
            </button>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default Home
