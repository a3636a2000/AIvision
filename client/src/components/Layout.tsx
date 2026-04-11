import React, { ReactNode, useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Plus, Save, Trash2, Printer, FileSpreadsheet, FileUp, X, Home, PanelLeftClose, Globe, Bell, Download, Settings, MoreHorizontal, LayoutDashboard, FileText, Activity } from 'lucide-react'
import Sidebar from './Sidebar'
import FloatingChat from './FloatingChat'
import { useAppStore } from '../store/useAppStore'
import { cn } from '../lib/utils'

interface LayoutProps {
  children: ReactNode
}

  const MENU_LABELS: Record<string, string> = {
    '/': '메인 포털',
    '/pdf-converter': 'PDF 변환',
    '/image-editor': '편집',
    '/video-maker': '동영상',
    '/chat': '채팅',
    '/sf-dashboard': '스마트 대시보드',
    '/sf-production': '작업 실적 등록',
    '/sf-vision': 'AI 비전 모니터링',
    '/sf-defect-types': '검사 요청 등록',
    '/sf-vision-setup': 'AI 비전 검사 설정',
    '/sf-items': '품목등록',
    '/ai-data-setup': '데이터분석 설정',
    '/ai-ontology': 'AI 온톨로지 분석',
    '/ai-pattern': 'AI 온톨로지 관리',
    '/ai-insight': '실시간 인사이트 플랫폼',
    '/help-center': 'FAQ',
    '/privacy-policy': '개인정보',
    '/terms-of-service': '이용약관',
    '/cookie-policy': '쿠키정책',
  }

/**
 * 메인 레이아웃 (반응형)
 */
const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { tabs, activeTab, addTab, removeTab, setActiveTab, isSidebarOpen } = useAppStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // 모든 메뉴 아이템들
  const allMenus = [
    { label: '스마트 대시보드', path: '/sf-dashboard' },
    { label: '작업 실적 등록', path: '/sf-production' },
    { label: 'AI 비전 모니터링', path: '/sf-vision' },
    { label: '검사 요청 등록', path: '/sf-defect-types' },
    { label: 'AI 비전 검사 설정', path: '/sf-vision-setup' },
    { label: '품목등록', path: '/sf-items' },
    { label: '데이터분석 설정', path: '/ai-data-setup' },
    { label: 'AI 온톨로지 분석', path: '/ai-ontology' },
    { label: 'AI 온톨로지 관리', path: '/ai-pattern' },
    { label: '실시간 인사이트 플랫폼', path: '/ai-insight' },
    { label: 'PDF 변환', path: '/pdf-converter' },
    { label: '이미지 편집', path: '/image-editor' },
    { label: '동영상 제작', path: '/video-maker' },
    { label: '채팅', path: '/chat' },
  ]

  const filteredMenus = allMenus.filter(menu => 
    menu.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Ctrl+K 단축키 및 외부 클릭 감지
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('menu-search-input')?.focus()
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 탭 변경 흐름 단방향화: 라우터(location) -> 스토어(tabs, activeTab)
  useEffect(() => {
    const path = location.pathname
    if (MENU_LABELS[path]) {
      addTab({ id: path, label: MENU_LABELS[path] })
      setActiveTab(path)
    }
  }, [location.pathname, addTab, setActiveTab])

  // 탭 클릭: 라우터 이동만 처리
  const handleTabClick = (id: string) => {
    if (activeTab !== id) {
      navigate(id)
    }
  }

  // 탭 닫기
  const handleTabClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const currentIndex = tabs.findIndex(t => t.id === id)
    
    // 활성화된 탭을 닫을 때 다음 이동 경로 계산
    if (activeTab === id) {
      if (tabs.length === 1) {
        navigate('/')
      } else {
        const nextTab = tabs[currentIndex - 1] || tabs[currentIndex + 1]
        navigate(nextTab.id)
      }
    }
    
    // setTimeout을 이용해 라우팅 변경이 시작된 후 탭 상태를 제거 (깜빡임 완화)
    setTimeout(() => {
      removeTab(id)
    }, 0)
  }

  const isHome = location.pathname === '/'

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-slate-50 font-sans">
      {/* ─── 상단 헤더 ─── */}
      {!isHome && (
      <header className="h-14 bg-white text-slate-800 border-b border-slate-200 flex items-center shrink-0 z-20">
        
        {/* 헤더 좌측 (사이드바 너비와 동일하게 맞춤) */}
        <div className={cn("flex items-center shrink-0 bg-white h-full border-r border-slate-200 transition-all duration-300", isSidebarOpen ? "w-[240px] px-4 gap-3" : "w-[64px] justify-center px-0")}>
          <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-blue-500 transition-colors shrink-0" onClick={() => navigate('/')}>AI</div>
          {isSidebarOpen && (
          <div className="cursor-pointer truncate" onClick={() => navigate('/')}>
            <div className="text-sm font-bold text-slate-800 leading-tight tracking-wide">한국품질재단</div>
            <div className="text-[10px] text-slate-500 leading-none mt-0.5">AI스마트팩토리</div>
          </div>
          )}
        </div>
        
        {/* 헤더 중앙 (검색창) */}
        <div className="flex-1 flex max-w-3xl px-6 items-center">
           <div className="relative w-[400px]" ref={searchRef}>
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               id="menu-search-input"
               type="text" 
               placeholder="메뉴 검색..." 
               value={searchQuery}
               onChange={(e) => {
                 setSearchQuery(e.target.value)
                 setIsSearchOpen(true)
               }}
               onFocus={() => setIsSearchOpen(true)}
               className="w-full bg-slate-50 border border-slate-200 rounded-full h-9 pl-10 pr-16 text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400" 
             />
             <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white pointer-events-none">
               Ctrl+K
             </div>
             
             {/* 검색 결과 드롭다운 */}
             {isSearchOpen && searchQuery && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
                 {filteredMenus.length > 0 ? (
                   <ul className="max-h-64 overflow-y-auto py-1">
                     {filteredMenus.map((menu) => (
                       <li key={menu.path}>
                         <button
                           onClick={() => {
                             navigate(menu.path)
                             setIsSearchOpen(false)
                             setSearchQuery('')
                           }}
                           className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
                         >
                           <Search className="w-3.5 h-3.5 opacity-50" />
                           {menu.label}
                         </button>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <div className="px-4 py-3 text-sm text-slate-500 text-center">
                     검색 결과가 없습니다.
                   </div>
                 )}
               </div>
             )}
           </div>
        </div>
        
        <div className="flex items-center gap-4 shrink-0 px-4 ml-auto">
          <button className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 px-3 py-1.5 rounded">
            <Globe className="w-4 h-4" /> 한국어
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img src="https://ui-avatars.com/api/?name=Admin&background=eff6ff&color=2563eb" alt="Profile" className="w-7 h-7 rounded-full" />
            <span className="text-sm font-medium text-slate-700">관리자</span>
          </div>
        </div>
      </header>
      )}

      {/* 헤더 아래 영역: 사이드바 + 메인 컨테이너 */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 데스크탑 사이드바 (좌측 고정, 헤더 아래부터 끝까지 꽉 채움) */}
        {!isHome && (
        <div className="hidden md:flex h-full z-20 shrink-0">
           <Sidebar />
        </div>
        )}

        {/* 우측 메인 컨테이너 */}
        <div className={cn("flex-1 flex flex-col min-w-0 relative", isHome ? "bg-gray-950" : "bg-slate-50")}>

          {/* ─── 공통 액션 바 ─── */}
          {!isHome && (
          <div className="h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-2 shrink-0 z-10 w-full relative">
            <button className="flex items-center gap-1.5 h-8 px-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
              <Search className="w-4 h-4" /> 조회 <span className="text-[10px] text-slate-400 ml-1">(Ctrl+F)</span>
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button className="flex items-center gap-1.5 h-8 px-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
              <Plus className="w-4 h-4" /> 신규 <span className="text-[10px] text-slate-400 ml-1">(Ctrl+A)</span>
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
              <Save className="w-4 h-4" /> 저장 <span className="text-[10px] text-slate-400 ml-1">(Ctrl+S)</span>
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
              <Trash2 className="w-4 h-4" /> 삭제 <span className="text-[10px] text-slate-400 ml-1">(Ctrl+D)</span>
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button className="flex items-center gap-1.5 h-8 px-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
              <Printer className="w-4 h-4" /> 인쇄 <span className="text-[10px] text-slate-400 ml-1">(Ctrl+P)</span>
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors border border-emerald-200">
              <FileSpreadsheet className="w-4 h-4" /> 엑셀변환 <span className="text-[10px] text-emerald-400 ml-1">(Ctrl+E)</span>
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
              <FileUp className="w-4 h-4" /> 엑셀입력 <span className="text-[10px] text-slate-400 ml-1">(Ctrl+H)</span>
            </button>
          </div>
          )}

          {/* ─── 탭 바 ─── */}
          {!isHome && (
          <div className="h-10 mt-1 flex items-center px-2 bg-transparent overflow-x-auto shrink-0 z-10 w-full relative">
            <button 
              onClick={() => navigate('/sf-dashboard')}
              className="flex items-center justify-center w-10 h-9 mr-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded-t-lg transition-colors border border-transparent border-b-0 shrink-0"
            >
              <Home className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-300 mx-1 shrink-0" />
            
            <div className="flex items-end flex-1 overflow-x-auto gap-1 px-1 h-full pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <div
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={cn(
                      "group flex items-center gap-2 px-3 py-[7px] border rounded-t-md cursor-pointer text-[13px] min-w-max transition-colors relative h-full",
                      isActive 
                        ? "bg-white border-slate-200 border-b-transparent text-blue-600 font-medium z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]" 
                        : "bg-white/50 border-transparent text-slate-600 hover:bg-white/80 border-b-slate-200"
                    )}
                    style={{ marginBottom: isActive ? '-1px' : '0' }}
                  >
                    {tab.id === '/sf-vision-setup' && <Settings className="w-3.5 h-3.5 text-blue-500" />}
                    {tab.id === '/sf-items' && <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />}
                    {tab.id === '/ai-data-setup' && <Settings className="w-3.5 h-3.5 text-slate-500" />}
                    {tab.id === '/ai-ontology' && <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />}
                    {tab.id === '/ai-pattern' && <FileText className="w-3.5 h-3.5 text-emerald-600" />}
                    {tab.id === '/ai-insight' && <Activity className="w-3.5 h-3.5 text-indigo-500" />}
                    {tab.label}
                    {tabs.length > 1 && (
                      <button 
                        onClick={(e) => handleTabClose(e, tab.id)}
                        className={cn(
                          "ml-1 p-0.5 rounded-sm hover:bg-slate-200 transition-colors",
                          isActive ? "text-slate-400 hover:text-slate-600" : "text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            
            <button className="flex items-center justify-center w-8 h-8 ml-auto text-slate-500 hover:bg-white rounded transition-colors shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          )}

          {/* 메인 콘텐츠 영역 */}
          <main className={cn("flex-1 flex flex-col overflow-auto relative z-0", isHome ? "p-0" : "bg-slate-50 p-0")}>
            {children}
          </main>
        </div>
      </div>
      
      {/* 플로팅 실시간 채팅 */}
      <FloatingChat />
    </div>
  )
}

export default Layout
