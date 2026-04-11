import { create } from 'zustand'
import type { SlideData } from '../types/slide'

export interface DefectType {
  id: number;
  groupCode: string;
  groupName: string;
  typeCode: string;
  typeName: string;
  note: string;
}

export const INITIAL_DEFECTS: DefectType[] = [
  { id: 1, groupCode: "L01", groupName: "외주불량", typeCode: "007", typeName: "찍힘불량", note: "" },
  { id: 2, groupCode: "L01", groupName: "외주불량", typeCode: "O01", typeName: "가공불량", note: "" },
  { id: 3, groupCode: "L01", groupName: "외주불량", typeCode: "O02", typeName: "단조불량", note: "" },
  { id: 4, groupCode: "L01", groupName: "외주불량", typeCode: "O03", typeName: "크랙불량", note: "" },
  { id: 5, groupCode: "L01", groupName: "외주불량", typeCode: "O04", typeName: "시편폐기", note: "" },
  { id: 6, groupCode: "L01", groupName: "외주불량", typeCode: "O05", typeName: "고주파 크랙", note: "" },
  { id: 7, groupCode: "L01", groupName: "외주불량", typeCode: "O06", typeName: "열처리 불량", note: "" },
  { id: 8, groupCode: "L01", groupName: "외주불량", typeCode: "O08", typeName: "절단불량", note: "" },
  { id: 9, groupCode: "L01", groupName: "외주불량", typeCode: "O09", typeName: "소재크랙", note: "" },
  { id: 10, groupCode: "L01", groupName: "외주불량", typeCode: "O10", typeName: "소재불량", note: "" },
  { id: 11, groupCode: "L01", groupName: "외주불량", typeCode: "O11", typeName: "소재흑피", note: "" },
  { id: 12, groupCode: "L01", groupName: "외주불량", typeCode: "O12", typeName: "세팅불량", note: "" },
  { id: 13, groupCode: "L02", groupName: "가공불량", typeCode: "P01", typeName: "가공불량(셋팅)", note: "" },
  { id: 14, groupCode: "L02", groupName: "가공불량", typeCode: "P02", typeName: "가공불량(양면삭)", note: "" },
  { id: 15, groupCode: "L02", groupName: "가공불량", typeCode: "P03", typeName: "가공불량(보링)", note: "" },
  { id: 16, groupCode: "L02", groupName: "가공불량", typeCode: "P04", typeName: "가공불량(드릴)", note: "" },
  { id: 17, groupCode: "L02", groupName: "가공불량", typeCode: "P05", typeName: "가공불량(좌삭)", note: "" },
  { id: 18, groupCode: "L02", groupName: "가공불량", typeCode: "P06", typeName: "조립불량", note: "" },
  { id: 19, groupCode: "L02", groupName: "가공불량", typeCode: "P07", typeName: "외관불량(형상)", note: "" },
  { id: 20, groupCode: "L02", groupName: "가공불량", typeCode: "P08", typeName: "연마불량", note: "" },
  { id: 21, groupCode: "L02", groupName: "가공불량", typeCode: "P09", typeName: "찍힘불량", note: "" },
  { id: 22, groupCode: "L02", groupName: "가공불량", typeCode: "P10", typeName: "버핑불량", note: "" },
  { id: 23, groupCode: "L02", groupName: "가공불량", typeCode: "P11", typeName: "가공불량(와이어커팅)", note: "" },
  { id: 24, groupCode: "L03", groupName: "열처리불량", typeCode: "H01", typeName: "고주파 시편", note: "" },
  { id: 25, groupCode: "L03", groupName: "열처리불량", typeCode: "H02", typeName: "고주파 크랙", note: "" },
  { id: 26, groupCode: "L03", groupName: "열처리불량", typeCode: "H03", typeName: "열처리 셋팅불량", note: "" },
  { id: 27, groupCode: "L03", groupName: "열처리불량", typeCode: "H04", typeName: "소재크랙", note: "" },
  { id: 28, groupCode: "L03", groupName: "열처리불량", typeCode: "H05", typeName: "스프레이켄칭크랙", note: "" },
  { id: 29, groupCode: "L05", groupName: "소재부족", typeCode: "A01", typeName: "소재부족", note: "" },
];

export interface VisionSetupData {
  inspectionInterval: number;
  confidenceThreshold: number;
  department: string;
  itemName: string;
  selectedDefects: string[];
  autoSave: boolean;
  autoSaveInterval: number;
  autoSaveType: string;
}

interface AppState {
  // PDF 변환 페이지 데이터
  pages: ConvertedPage[]
  setPages: (pages: ConvertedPage[]) => void
  updatePageDataUrl: (pageNumber: number, dataUrl: string) => void

  // 이미지 편집기로 전달할 페이지 번호
  editingPageNumber: number | null
  setEditingPageNumber: (num: number | null) => void

  // PPT 분석 결과 (Sidebar ↔ PdfConverter 공유)
  slidesData: SlideData[]
  setSlidesData: (data: SlideData[]) => void
  showPptPreview: boolean
  setShowPptPreview: (show: boolean) => void

  // AI 비전 설정 데이터
  visionSetupData: VisionSetupData
  setVisionSetupData: (data: VisionSetupData) => void
  
  // 불량유형 마스터 데이터 공유
  defectTypes: DefectType[]
  setDefectTypes: (data: DefectType[]) => void

  // 탭 관련 상태 추가
  tabs: { id: string; label: string }[]
  activeTab: string
  addTab: (tab: { id: string; label: string }) => void
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void

  // 사이드바 상태
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  pages: [],
  setPages: (pages) => set({ pages }),
  updatePageDataUrl: (pageNumber, dataUrl) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.pageNumber === pageNumber ? { ...p, dataUrl } : p
      ),
    })),

  editingPageNumber: null,
  setEditingPageNumber: (num) => set({ editingPageNumber: num }),

  slidesData: [],
  setSlidesData: (data) => set({ slidesData: data }),
  showPptPreview: false,
  setShowPptPreview: (show) => set({ showPptPreview: show }),

  visionSetupData: {
    inspectionInterval: 2,
    confidenceThreshold: 90,
    department: '관리부',
    itemName: 'D4H LOOSE LINK & PIN&BUSH GROUP WITH SEAL',
    selectedDefects: [],
    autoSave: false,
    autoSaveInterval: 60,
    autoSaveType: '',
  },
  setVisionSetupData: (data) => set({ visionSetupData: data }),
  
  defectTypes: INITIAL_DEFECTS,
  setDefectTypes: (data) => set({ defectTypes: data }),

  tabs: [],
  activeTab: '/',
  addTab: (tab) => set((state) => {
    const existingIndex = state.tabs.findIndex((t) => t.id === tab.id);
    if (existingIndex >= 0) {
      if (state.tabs[existingIndex].label !== tab.label) {
        const newTabs = [...state.tabs];
        newTabs[existingIndex] = { ...newTabs[existingIndex], label: tab.label };
        return { tabs: newTabs };
      }
      return state;
    }
    return { tabs: [...state.tabs, tab] };
  }),
  removeTab: (id) => set((state) => {
    const newTabs = state.tabs.filter((t) => t.id !== id);
    return { tabs: newTabs };
  }),
  setActiveTab: (id) => set({ activeTab: id }),

  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}))

