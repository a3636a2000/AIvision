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
]

function isValidPath(path: string) {
  return VALID_PATHS.includes(path)
}

const SF_PATHS = ['/sf-dashboard', '/sf-production', '/sf-vision']

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

  useEffect(() => {
    if (path === '/video-maker') setVideoMakerLoaded(true)
    if (path === '/chat') setChatRoomLoaded(true)
    if (path === '/sf-dashboard') setSfDashboardLoaded(true)
    if (path === '/sf-production') setSfProductionLoaded(true)
    if (path === '/sf-vision') setSfVisionLoaded(true)
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
