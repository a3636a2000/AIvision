import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  FileText,
  Image,
  HelpCircle,
  Shield,
  FileCheck,
  Cookie,
  MessageSquare,
  Presentation,
  Video,
  LayoutDashboard,
  Factory,
  Eye,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useAppStore } from '../store/useAppStore'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const hasPptResult = useAppStore((s) => s.slidesData.length > 0)
  const setShowPptPreview = useAppStore((s) => s.setShowPptPreview)

  // 메인 메뉴
  const mainMenuItems = [
    { icon: Home,         label: '홈',       path: '/' },
    { icon: FileText,     label: 'PDF 변환', path: '/pdf-converter' },
    { icon: Image,        label: '편집',     path: '/image-editor' },
    { icon: Video,        label: '동영상',   path: '/video-maker' },
    { icon: MessageSquare,label: '채팅',     path: '/chat' },
  ]

  // 스마트팩토리 메뉴 (메인 메뉴 바로 아래)
  const sfMenuItems = [
    { icon: LayoutDashboard, label: '대시보드',    path: '/sf-dashboard' },
    { icon: Factory,         label: '작업실적',    path: '/sf-production' },
    { icon: Eye,             label: 'AI 비전',     path: '/sf-vision' },
  ]

  // 고객지원
  const supportItems = [
    { icon: HelpCircle, label: 'FAQ',     path: '/help-center' },
    { icon: Shield,     label: '개인정보', path: '/privacy-policy' },
    { icon: FileCheck,  label: '이용약관', path: '/terms-of-service' },
    { icon: Cookie,     label: '쿠키정책', path: '/cookie-policy' },
  ]

  const renderMenuBtn = (item: { icon: React.ElementType; label: string; path: string }, isSf = false) => {
    const isActive = location.pathname === item.path
    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all group relative',
          isActive
            ? isSf
              ? 'bg-blue-700 text-white shadow-lg shadow-blue-900/40'
              : 'bg-gray-800 text-white'
            : isSf
              ? 'text-blue-400/70 hover:text-blue-300 hover:bg-blue-900/30'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
        )}
        title={item.label}
      >
        <item.icon className="w-5 h-5" />
        {isActive && isSf && (
          <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-400 rounded-r-full" />
        )}
        <span className={cn(
          'absolute left-full ml-3 px-2.5 py-1.5 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50',
          isSf
            ? 'bg-blue-900 border border-blue-700/50'
            : 'bg-gray-800 border border-gray-700/50'
        )}>
          {item.label}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* ─── 데스크탑 사이드바 ─── */}
      <div className="hidden md:flex w-14 h-full bg-gray-950 border-r border-gray-800/50 flex-col items-center py-3 shrink-0">

        {/* 로고 */}
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-lg overflow-hidden mb-4 hover:opacity-90 transition-opacity shrink-0"
          title="한국 품질재단 제조AI 스마트팩토리 실습"
        >
          <img src="/images/icon-192.png" alt="로고" className="w-full h-full object-cover" />
        </button>

        <div className="flex flex-col gap-1 flex-1">
          {/* 메인 메뉴 */}
          {mainMenuItems.map((item) => renderMenuBtn(item, false))}

          {/* PPT 결과 아이콘 */}
          <button
            onClick={() => { setShowPptPreview(true); navigate('/pdf-converter') }}
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-all group relative',
              hasPptResult
                ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
                : 'text-gray-700 cursor-default'
            )}
            title="PPT 결과"
            disabled={!hasPptResult}
          >
            <Presentation className="w-5 h-5" />
            {hasPptResult && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />}
            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-gray-700/50 z-50">
              {hasPptResult ? 'PPT 결과 보기' : 'PPT 결과 없음'}
            </span>
          </button>

          {/* 구분선 */}
          <div className="w-6 border-t border-gray-700/40 my-1.5 mx-auto" />

          {/* 스마트팩토리 메뉴 */}
          {sfMenuItems.map((item) => renderMenuBtn(item, true))}
        </div>

        {/* 고객지원 (하단) */}
        <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-gray-800/50">
          {supportItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all group relative text-gray-600 hover:text-gray-400 hover:bg-gray-800/50"
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-gray-700/50 z-50">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ─── 모바일 하단 네비게이션 ─── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-gray-950 border-t border-gray-800/50 flex items-center justify-around z-50 overflow-x-auto px-1">
        {mainMenuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all shrink-0',
                isActive ? 'text-blue-400' : 'text-gray-500 active:text-gray-300'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          )
        })}

        {/* 구분 */}
        <div className="w-px h-6 bg-gray-700/50 shrink-0" />

        {/* 스마트팩토리 (모바일) */}
        {sfMenuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all shrink-0',
                isActive ? 'text-blue-400' : 'text-blue-500/50 active:text-blue-300'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          )
        })}

        {/* PPT (모바일) */}
        {hasPptResult && (
          <button
            onClick={() => { setShowPptPreview(true); navigate('/pdf-converter') }}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-orange-400 relative shrink-0"
          >
            <Presentation className="w-5 h-5" />
            <span className="text-[9px] font-medium">PPT</span>
            <span className="absolute top-0.5 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
        )}
      </div>
    </>
  )
}

export default Sidebar
