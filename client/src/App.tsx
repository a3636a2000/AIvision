import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PdfConverter from './pages/PdfConverter'
import ImageEditor from './pages/ImageEditor'

// 정책/고객지원 페이지 — 자주 사용되지 않으므로 lazy 로드
const HelpCenter = lazy(() => import('./pages/HelpCenter'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))

// 채팅방 페이지
const ChatRoom = lazy(() => import('./pages/ChatRoom'))

// 동영상 만들기 페이지
const VideoMaker = lazy(() => import('./pages/VideoMaker'))

// 스마트팩토리 페이지
const SmartDashboard = lazy(() => import('./pages/SmartDashboard'))
const WorkResult = lazy(() => import('./pages/WorkResult'))
const VisionInspection = lazy(() => import('./pages/VisionInspection'))
const VisionSetupPage = lazy(() => import('./pages/VisionSetup'))
const ItemMaster = lazy(() => import('./pages/ItemMaster'))
const DefectTypeMaster = lazy(() => import('./pages/DefectTypeMaster'))

// AI 데이터분석 페이지
const DataAnalysisSetup = lazy(() => import('./pages/DataAnalysisSetup'))
const AiOntology = lazy(() => import('./pages/AiOntology'))
const AiPattern = lazy(() => import('./pages/AiPattern'))
const RealtimeInsight = lazy(() => import('./pages/RealtimeInsight'))

const VALID_PATHS = [
  '/',
  '/pdf-converter',
  '/image-editor',
  '/help-center',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
  '/chat',
  '/video-maker',
  '/sf-dashboard',
  '/sf-production',
  '/sf-vision',
  '/sf-vision-setup',
  '/sf-items',
  '/sf-defect-types',
  '/ai-data-setup',
  '/ai-ontology',
  '/ai-pattern',
  '/ai-insight',
]

function isValidPath(path: string) {
  return VALID_PATHS.includes(path)
}

const SF_PATHS = ['/sf-dashboard', '/sf-production', '/sf-vision', '/sf-vision-setup', '/sf-items', '/sf-defect-types']

/**
 * 스마트팩토리 페이지 로딩 스피너
 */
function SFLoading() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <div className="text-slate-500 text-sm">로딩 중...</div>
      </div>
    </div>
  )
}

/**
 * 페이지 매니저
 * display:none 방식으로 모든 페이지를 항상 마운트 상태로 유지
 */
function PageManager() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  // lazy 로드 페이지: 최초 방문 후 마운트 유지 (display:none 방식)
  const [videoMakerLoaded, setVideoMakerLoaded] = useState(false)
  const [chatRoomLoaded, setChatRoomLoaded] = useState(false)
  const [sfDashboardLoaded, setSfDashboardLoaded] = useState(false)
  const [sfProductionLoaded, setSfProductionLoaded] = useState(false)
  const [sfVisionLoaded, setSfVisionLoaded] = useState(false)
  const [sfVisionSetupLoaded, setSfVisionSetupLoaded] = useState(false)
  const [sfItemsLoaded, setSfItemsLoaded] = useState(false)
  const [sfDefectTypesLoaded, setSfDefectTypesLoaded] = useState(false)

  const [aiDataSetupLoaded, setAiDataSetupLoaded] = useState(false)
  const [aiOntologyLoaded, setAiOntologyLoaded] = useState(false)
  const [aiPatternLoaded, setAiPatternLoaded] = useState(false)
  const [aiInsightLoaded, setAiInsightLoaded] = useState(false)

  useEffect(() => {
    if (path === '/video-maker') setVideoMakerLoaded(true)
    if (path === '/chat') setChatRoomLoaded(true)
    if (path === '/sf-dashboard') setSfDashboardLoaded(true)
    if (path === '/sf-production') setSfProductionLoaded(true)
    if (path === '/sf-vision') setSfVisionLoaded(true)
    if (path === '/sf-vision-setup') setSfVisionSetupLoaded(true)
    if (path === '/sf-items') setSfItemsLoaded(true)
    if (path === '/sf-defect-types') setSfDefectTypesLoaded(true)
    if (path === '/ai-data-setup') setAiDataSetupLoaded(true)
    if (path === '/ai-ontology') setAiOntologyLoaded(true)
    if (path === '/ai-pattern') setAiPatternLoaded(true)
    if (path === '/ai-insight') setAiInsightLoaded(true)
  }, [path])

  // 유효하지 않은 경로 → 홈으로 리다이렉트
  useEffect(() => {
    if (!isValidPath(path)) {
      navigate('/', { replace: true })
    }
  }, [path, navigate])

  return (
    <>
      <div
        className="flex-1 flex-col min-h-0 overflow-hidden"
        style={{ display: path === '/' ? 'flex' : 'none' }}
      >
        <Home />
      </div>
      <div
        className="flex-1 flex-col overflow-hidden"
        style={{ display: path === '/pdf-converter' ? 'flex' : 'none' }}
      >
        <PdfConverter />
      </div>
      <div
        className="flex-1 flex-col min-h-0 overflow-hidden"
        style={{ display: path === '/image-editor' ? 'flex' : 'none' }}
      >
        <ImageEditor />
      </div>

      {/* 정책/고객지원 페이지 — lazy 로드, 해당 경로일 때만 렌더링 */}
      {['/help-center', '/privacy-policy', '/terms-of-service', '/cookie-policy'].includes(path) && (
        <div className="flex-1 flex-col min-h-0 overflow-auto" style={{ display: 'flex' }}>
          <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="text-gray-400 text-sm">로딩 중...</div></div>}>
            {path === '/help-center' && <HelpCenter />}
            {path === '/privacy-policy' && <PrivacyPolicy />}
            {path === '/terms-of-service' && <TermsOfService />}
            {path === '/cookie-policy' && <CookiePolicy />}
          </Suspense>
        </div>
      )}

      {/* 채팅방 페이지 — 최초 방문 후 마운트 유지 */}
      {chatRoomLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/chat' ? 'flex' : 'none' }}>
          <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="text-gray-400 text-sm">로딩 중...</div></div>}>
            <ChatRoom />
          </Suspense>
        </div>
      )}

      {/* 동영상 만들기 페이지 — 최초 방문 후 마운트 유지 */}
      {videoMakerLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/video-maker' ? 'flex' : 'none' }}>
          <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="text-gray-400 text-sm">로딩 중...</div></div>}>
            <VideoMaker />
          </Suspense>
        </div>
      )}

      {/* ─── 스마트팩토리 페이지 ─── */}
      {sfDashboardLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/sf-dashboard' ? 'flex' : 'none' }}>
          <Suspense fallback={<SFLoading />}>
            <SmartDashboard />
          </Suspense>
        </div>
      )}

      {sfProductionLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/sf-production' ? 'flex' : 'none' }}>
          <Suspense fallback={<SFLoading />}>
            <WorkResult />
          </Suspense>
        </div>
      )}

      {sfVisionLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/sf-vision' ? 'flex' : 'none' }}>
          <Suspense fallback={<SFLoading />}>
            <VisionInspection />
          </Suspense>
        </div>
      )}

      {sfVisionSetupLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/sf-vision-setup' ? 'flex' : 'none' }}>
          <Suspense fallback={<SFLoading />}>
            <VisionSetupPage />
          </Suspense>
        </div>
      )}

      {sfItemsLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/sf-items' ? 'flex' : 'none' }}>
          <Suspense fallback={<SFLoading />}>
            <ItemMaster />
          </Suspense>
        </div>
      )}

      {sfDefectTypesLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/sf-defect-types' ? 'flex' : 'none' }}>
          <Suspense fallback={<SFLoading />}>
            <DefectTypeMaster />
          </Suspense>
        </div>
      )}

      {/* ─── AI 데이터분석 페이지 ─── */}
      {aiDataSetupLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/ai-data-setup' ? 'flex' : 'none' }}>
          <Suspense fallback={<SFLoading />}>
            <DataAnalysisSetup />
          </Suspense>
        </div>
      )}

      {aiOntologyLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/ai-ontology' ? 'flex' : 'none' }}>
          <Suspense fallback={<SFLoading />}>
            <AiOntology />
          </Suspense>
        </div>
      )}

      {aiPatternLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/ai-pattern' ? 'flex' : 'none' }}>
          <Suspense fallback={<SFLoading />}>
            <AiPattern />
          </Suspense>
        </div>
      )}

      {aiInsightLoaded && (
        <div className="flex-1 flex-col min-h-0 overflow-hidden" style={{ display: path === '/ai-insight' ? 'flex' : 'none' }}>
          <Suspense fallback={<SFLoading />}>
            <RealtimeInsight />
          </Suspense>
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Layout>
        <PageManager />
      </Layout>
    </BrowserRouter>
  )
}

export default App
