import React, { useState } from 'react'
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
  Package,
  AlertTriangle,
  Settings,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Activity
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useAppStore } from '../store/useAppStore'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const hasPptResult = useAppStore((s) => s.slidesData.length > 0)
  const setShowPptPreview = useAppStore((s) => s.setShowPptPreview)
  const { isSidebarOpen, toggleSidebar } = useAppStore()

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    sf: true, // 기본적으로 스마트팩토리 그룹 열림
    aiData: true,
    main: true
  })

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // AI 데이터분석
  const aiDataItems = [
    { icon: Settings,        label: '데이터베이스 설정', path: '/ai-data-setup' },
    { icon: LayoutDashboard, label: 'AI 온톨로지 분석', path: '/ai-ontology' },
    { icon: FileText,        label: 'AI 온톨로지 관리', path: '/ai-pattern' },
    { icon: Activity,        label: '실시간 인사이트 플랫폼', path: '/ai-insight' },
  ]

  // 메인 서비스 아이템들
  const mainItems = [
    { icon: FileText,     label: 'PDF 변환', path: '/pdf-converter' },
    { icon: Image,        label: '이미지 편집', path: '/image-editor' },
    { icon: Video,        label: '동영상 제작', path: '/video-maker' },
    { icon: MessageSquare,label: '채팅',     path: '/chat' },
  ]

  // 스마트팩토리 하위 메뉴들
  const sfItems = [
    { icon: LayoutDashboard, label: '스마트 대시보드', path: '/sf-dashboard' },
    { icon: Factory,         label: '작업 실적 등록', path: '/sf-production' },
    { icon: Eye,             label: 'AI 비전 모니터링', path: '/sf-vision' },
    { icon: Settings,        label: 'AI 비전 검사 설정', path: '/sf-vision-setup' },
    { icon: AlertTriangle,   label: '검사 요청 등록', path: '/sf-defect-types' },
    { icon: Package,         label: '품목등록', path: '/sf-items' },
  ]

  // 시스템/고객지원
  const supportItems = [
    { icon: HelpCircle, label: 'FAQ',     path: '/help-center' },
    { icon: Shield,     label: '개인정보', path: '/privacy-policy' },
    { icon: FileCheck,  label: '이용약관', path: '/terms-of-service' },
    { icon: Cookie,     label: '쿠키정책', path: '/cookie-policy' },
  ]

  const renderMenuItem = (item: { icon: React.ElementType; label: string; path: string }, isSub = false) => {
    const isActive = location.pathname === item.path
    return (
      <button
        key={item.path}
        onClick={() => {
          if (!isSidebarOpen) toggleSidebar()
          navigate(item.path)
        }}
        className={cn(
          'flex items-center transition-all relative w-full text-left',
          isSidebarOpen ? (isSub ? 'h-9 px-8 text-[13px] gap-3' : 'h-10 px-4 text-sm gap-3') : 'h-10 justify-center px-0',
          isActive
            ? 'bg-blue-50 text-blue-600 font-medium'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
        )}
        title={!isSidebarOpen ? item.label : undefined}
      >
        {!isSub ? (
          <item.icon className="w-[18px] h-[18px] shrink-0 opacity-80" />
        ) : (
          isSidebarOpen ? <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
        )}
        {isSidebarOpen && <span className="flex-1 truncate">{item.label}</span>}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-blue-600 rounded-r-full" />
        )}
      </button>
    )
  }

  const renderGroup = (key: string, label: string, items: any[], defaultIcon: React.ElementType) => {
    const isExpanded = expandedMenus[key]
    const hasActiveChild = items.some(i => i.path === location.pathname)
    
    return (
      <div className="flex flex-col">
        <button 
          onClick={() => isSidebarOpen ? toggleMenu(key) : toggleSidebar()}
          className={cn(
            "flex items-center h-10 w-full text-left text-sm transition-colors",
            isSidebarOpen ? "px-4 gap-3" : "justify-center px-0",
            hasActiveChild && !isExpanded ? "text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
          title={!isSidebarOpen ? label : undefined}
        >
          <defaultIcon className="w-[18px] h-[18px] shrink-0 opacity-80" />
          {isSidebarOpen && <span className="flex-1 truncate">{label}</span>}
          {isSidebarOpen && (isExpanded ? (
            <ChevronDown className="w-4 h-4 shrink-0 opacity-60" />
          ) : (
            <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
          ))}
        </button>
        
        {isExpanded && isSidebarOpen && (
          <div className="flex flex-col pb-1">
            {items.map(item => renderMenuItem(item, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("h-full bg-white border-r border-slate-200 flex flex-col shrink-0 text-slate-600 shadow-sm z-20 transition-all duration-300", isSidebarOpen ? "w-[240px]" : "w-[64px]")}>
      
      {/* ─── 상단 네비게이션 헤더 ─── */}
      <div className={cn("h-12 flex items-center border-b border-slate-200 shrink-0", isSidebarOpen ? "justify-between px-4" : "justify-center px-0")}>
        {isSidebarOpen && <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Navigation</span>}
        <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-600 transition-colors" title={isSidebarOpen ? "사이드바 닫기" : "사이드바 열기"}>
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
        {/* 그룹 메뉴들 */}
        {renderGroup('sf', '스마트팩토리', sfItems, Factory)}
        {renderGroup('aiData', 'AI 데이터분석', aiDataItems, LayoutDashboard)}
        {renderGroup('main', '기본서비스', mainItems, LayoutDashboard)}
        {renderGroup('support', '시스템', supportItems, Settings)}
      </div>

      {/* 하단 카피라이트 */}
      <div className={cn("h-12 border-t border-slate-200 flex items-center shrink-0 bg-slate-50", isSidebarOpen ? "px-4" : "justify-center px-0")}>
        <div className={cn("bg-blue-600 rounded-sm flex items-center justify-center font-bold text-white", isSidebarOpen ? "w-4 h-4 text-[8px] mr-2" : "w-6 h-6 text-[10px]")}>AI</div>
        {isSidebarOpen && <span className="text-[10px] text-slate-400">© 2026 AI SMART FACTORY</span>}
      </div>
      
    </div>
  )
}

export default Sidebar
