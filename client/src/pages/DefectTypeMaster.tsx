import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  Search, Plus, Trash2, Save,
  Layers, AlertTriangle, FileSpreadsheet,
  Settings2, Info, FileUp, FileDown, Printer, Play, Package, XCircle, Box
} from "lucide-react";

import SmartFactoryWrapper from "@/components/SmartFactoryWrapper";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

import { useAppStore, DefectType } from "../store/useAppStore";

interface InspectionRequest {
  id: number;
  requestDate: string;
  defectType: string;
  department: string;
  note: string;
  workDate: string;
  workId: string;
  requestNo: string;
  manager: string;
  items: InspectionItem[];
}

interface InspectionItem {
  id: number;
  itemCode: string;
  itemName: string;
  std: string;
  linkNo: string;
  resultNo: string;
  reqQty: number;
  unit: string;
  inspQty: number;
  defectQty: number;
  reqDate: string;
  inspStatus: string;
  defectName: string;
  actionNote: string;
  actionStatus: string;
  note: string;
  image?: string;
}

const EMPTY_REQUEST: Omit<InspectionRequest, "id"> = {
  requestDate: new Date().toISOString().split("T")[0],
  defectType: "",
  department: "",
  note: "",
  workDate: new Date().toISOString().replace('T', ' ').slice(0, 23),
  workId: "AI_BOT",
  requestNo: "",
  manager: "SYSTEM",
  items: [],
};

export default function InspectionRequestPage() {
  const { toast } = useToast();
  
  const defectTypes = useAppStore(s => s.defectTypes) || [];
  
  const [requests, setRequests] = useState<InspectionRequest[]>([
    {
      id: 1,
      requestDate: "2026-03-21",
      defectType: "사내생산[A]",
      department: "C01",
      note: "",
      workDate: "2026-03-21 18:04:09.7105",
      workId: "AI_BOT",
      requestNo: "3565451731",
      manager: "SYSTEM",
      items: [
        {
          id: 1,
          itemCode: "P-00-D4HXX-0-361",
          itemName: "D4H LOOSE LINK & PIN&BUSH GROUP WITH SEAL",
          std: "KBJ(LUB)",
          linkNo: "",
          resultNo: "",
          reqQty: 1,
          unit: "PCS",
          inspQty: 1,
          defectQty: 1,
          reqDate: "2026-03-21",
          inspStatus: "요청",
          defectName: "가공불량(양면삭)",
          actionNote: "",
          actionStatus: "",
          note: "AI 감지: 가공불량(양면삭) (100.0%)",
          image: "/images/defect_sample.png" // 예시 이미지
        }
      ]
    },
    {
      id: 2,
      requestDate: "2025-12-04",
      defectType: "입고불량[H]",
      department: "C01",
      note: "",
      workDate: "2025-12-04 10:00:00",
      workId: "USER1",
      requestNo: "202512040001",
      manager: "ADMIN",
      items: []
    }
  ]);

  const [selectedId, setSelectedId] = useState<number | null>(requests[0]?.id || null);
  const [form, setForm] = useState<Omit<InspectionRequest, "id">>(requests[0] || EMPTY_REQUEST);
  const [searchDate, setSearchDate] = useState("2026-03-21");
  const [searchType, setSearchType] = useState("전체");
  const [isNew, setIsNew] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // info, items

  // 품목 모달 상태
  const [showItemModal, setShowItemModal] = useState(false);

  const filtered = requests.filter(req => {
    // if (req.requestDate !== searchDate) return false;
    if (searchType !== "전체" && req.defectType !== searchType) return false;
    return true;
  });

  const selectRequest = useCallback((req: InspectionRequest) => {
    setSelectedId(req.id);
    setIsNew(false);
    const { id: _, ...rest } = req;
    setForm(rest);
  }, []);

  const handleNew = () => {
    setSelectedId(null);
    setIsNew(true);
    
    // 신규 번호 생성 로직 (YYYYMMDD + 랜덤)
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
    const randomNo = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const newReqNo = `${dateStr}${randomNo}`;
    
    setForm({ 
      ...EMPTY_REQUEST, 
      requestNo: newReqNo,
      requestDate: today.toISOString().split("T")[0],
      workDate: today.toISOString().replace('T', ' ').slice(0, 23)
    });
    setActiveTab("info");
    toast({ title: "신규 등록", description: "새로운 검사요청 정보가 생성되었습니다." });
  };

  const handleSave = () => {
    if (!form.requestNo || !form.defectType) {
      toast({ variant: "destructive", title: "오류", description: "필수 항목을 입력하세요." });
      return;
    }

    if (isNew) {
      const newId = requests.length > 0 ? Math.max(...requests.map(i => i.id)) + 1 : 1;
      const newReq = { id: newId, ...form };
      setRequests([newReq, ...requests]);
      setSelectedId(newId);
      setIsNew(false);
      toast({ title: "저장 완료", description: "새로운 검사요청이 등록되었습니다." });
    } else {
      setRequests(requests.map(req => req.id === selectedId ? { id: req.id, ...form } : req));
      toast({ title: "수정 완료", description: "검사요청 정보가 수정되었습니다." });
    }
  };

  // AI 비전 검사 시뮬레이션 (품목 추가 시)
  const handleItemSelect = (itemCode: string, itemName: string, std: string) => {
    setShowItemModal(false);
    
    // AI 비전 검사 로직 시뮬레이션
    toast({
      title: "AI 비전 검사 진행 중",
      description: "카메라를 통해 실시간 불량 판독을 시작합니다...",
    });
    
    setTimeout(() => {
      // 랜덤 불량 유형 선택
      const sampleDefects = ["가공불량(양면삭)", "찍힘불량", "크랙불량", "소재불량"];
      const randomDefect = sampleDefects[Math.floor(Math.random() * sampleDefects.length)];
      const confidence = (Math.random() * 10 + 90).toFixed(1); // 90~100%
      
      const newItem: InspectionItem = {
        id: Date.now(),
        itemCode,
        itemName,
        std,
        linkNo: "",
        resultNo: "",
        reqQty: 1,
        unit: "PCS",
        inspQty: 1,
        defectQty: 1,
        reqDate: form.requestDate,
        inspStatus: "요청",
        defectName: randomDefect,
        actionNote: "",
        actionStatus: "",
        note: `AI 감지: ${randomDefect} (${confidence}%)`,
        image: "/images/defect_sample.png" // AI 캡처 가상 이미지
      };
      
      setForm(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
      
      setActiveTab("items");
      
      toast({
        title: "AI 분석 완료",
        description: `${randomDefect}이(가) ${confidence}% 확률로 감지되어 자동 등록되었습니다.`,
        variant: "destructive"
      });
    }, 1500);
  };

  const handleDeleteItem = (itemId: number) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateForm = (field: keyof Omit<InspectionRequest, "id">, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const inputCls = "h-9 px-3 text-sm bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors";
  const selectCls = `${inputCls} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-[right_8px_center] bg-no-repeat pr-6`;
  const labelCls = "text-xs text-slate-600 mb-1 block font-medium";
  const reqLabel = "text-xs text-rose-500 mb-1 block font-medium";

  return (
    <SmartFactoryWrapper>
      <div className="flex flex-col absolute inset-0 bg-[#f8f9fc] p-2">
        <Toaster />
        <style>{`
          @keyframes slide-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
          .card-animate { animation: slide-in .4s ease-out both; }
        `}</style>
      
      {/* ─── 상단 검색 필터 바 ─── */}
      <div className="relative bg-white border border-indigo-100 rounded-xl px-4 py-3 mb-2 flex flex-wrap items-center gap-3 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-indigo-900 font-bold text-lg tracking-tight">검사 요청 등록</h2>
            <p className="text-slate-500 text-[11px] mt-0.5">품목에 대한 검사 요청 등록 및 AI 비전 자동 불량 판별 내역</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-[10px] text-slate-500 font-medium">요청일자</label>
          <input 
            type="date" 
            value={searchDate} 
            onChange={(e) => setSearchDate(e.target.value)} 
            className={`${inputCls} w-32`}
          />
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          <label className="flex items-center gap-1.5 text-[10px] text-slate-500 cursor-pointer font-medium">
            <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-500 focus:ring-blue-500 focus:ring-1" defaultChecked />
            전체
          </label>
          
          <label className="text-[10px] text-slate-500 ml-2 font-medium">검사요청등록</label>
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)} 
            className={`${selectCls} w-32`}
          >
            <option value="전체">전체</option>
            <option value="사내생산[A]">사내생산[A]</option>
            <option value="입고불량[H]">입고불량[H]</option>
            <option value="공정불량[P]">공정불량[P]</option>
          </select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden gap-2 z-10">
            {/* ─── 좌측 리스트 ─── */}
        <div className="w-[350px] relative bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col shrink-0 card-animate" style={{ animationDelay: ".08s" }}>
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
              <span className="text-indigo-900 text-sm font-bold">요청 목록</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium border border-blue-200">
              {filtered.length}건
            </span>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px] whitespace-nowrap">
              <thead className="sticky top-0 bg-white border-b border-slate-200">
                <tr>
                  <th className="font-medium py-2.5 px-2 text-center w-10 text-slate-500">순번</th>
                  <th className="font-medium py-2.5 px-2 w-8"><input type="checkbox" className="rounded border-slate-300 text-blue-500 focus:ring-blue-500" /></th>
                  <th className="font-medium py-2.5 px-2 text-left text-slate-500">검사요청유형</th>
                  <th className="font-medium py-2.5 px-2 text-left text-slate-500">요청번호</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req, idx) => (
                  <tr 
                    key={req.id} 
                    onClick={() => selectRequest(req)}
                    className={`border-b border-slate-100 cursor-pointer transition-colors ${selectedId === req.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-2 px-2 text-center text-slate-500">
                      {selectedId === req.id ? <Play className="w-2.5 h-2.5 text-blue-600 inline" fill="currentColor" /> : idx + 1}
                    </td>
                    <td className="py-2 px-2"><input type="checkbox" className="rounded border-slate-300 text-blue-500 focus:ring-blue-500" /></td>
                    <td className="py-2 px-2 text-slate-800">{req.defectType}</td>
                    <td className="py-2 px-2 text-slate-600 font-mono text-[11px]">{req.requestNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── 우측 상세 폼 ─── */}
        <div className="flex-1 relative bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col card-animate" style={{ animationDelay: ".16s" }}>
          {/* 탭 헤더 */}
          <div className="px-4 pt-1.5 border-b border-slate-200 flex gap-0.5 shrink-0 bg-slate-50">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'info' ? 'border-indigo-500 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
            >
              요청정보
            </button>
            <button 
              onClick={() => setActiveTab('items')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'items' ? 'border-indigo-500 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
            >
              요청품목 <span className="bg-indigo-100 text-indigo-600 border border-indigo-200 px-1.5 py-0.5 rounded-full text-xs leading-none">{form.items.length}</span>
            </button>
            <button className="px-3 py-2 text-indigo-500 hover:text-indigo-600 hover:bg-slate-100 rounded-t border-b-2 border-transparent transition-colors ml-1">
              <Plus className="w-5 h-5" onClick={() => setShowItemModal(true)} />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-auto bg-white">
            {activeTab === 'info' ? (
              // 요청정보 탭 콘텐츠
              <div className="max-w-4xl grid grid-cols-1 gap-y-4">
                <div className="flex items-center">
                  <label className={`${labelCls} w-24 shrink-0 mb-0 mt-2`}>요청일자</label>
                  <div className="flex-1 flex gap-4">
                    <div className="relative w-64">
                      <input 
                        type="date" 
                        value={form.requestDate} 
                        onChange={(e) => updateForm("requestDate", e.target.value)}
                        className={`${inputCls} w-full`} 
                      />
                    </div>
                    <div className="flex items-center w-full max-w-[400px]">
                      <label className={`${reqLabel} w-20 shrink-0 mb-0 mt-2`}>요청번호</label>
                      <input 
                        type="text" 
                        value={form.requestNo} 
                        readOnly
                        className={`${inputCls} flex-1 bg-slate-50 text-slate-500`} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center border-t border-slate-100 pt-4">
                  <label className={`${reqLabel} w-24 shrink-0 mb-0 mt-2`}>검사요청유형</label>
                  <div className="flex-1 flex gap-4">
                    <select 
                      value={form.defectType} 
                      onChange={(e) => updateForm("defectType", e.target.value)}
                      className={`${selectCls} w-64`}
                    >
                      <option value="">선택하세요</option>
                      <option value="사내생산[A]">사내생산[A]</option>
                      <option value="입고불량[H]">입고불량[H]</option>
                      <option value="공정불량[P]">공정불량[P]</option>
                    </select>
                    <div className="flex items-center w-full max-w-[400px]">
                      <label className={`${labelCls} w-20 shrink-0 mb-0 mt-2`}>담당자</label>
                      <div className="flex flex-1 gap-1">
                        <input type="text" value={form.manager} readOnly className={`${inputCls} w-24 bg-slate-50 text-slate-500`} />
                        <button className="w-7 h-7 flex items-center justify-center bg-white border border-slate-300 rounded hover:bg-slate-50 shrink-0 transition-colors">
                          <Search className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                        <input type="text" className={`${inputCls} flex-1 bg-slate-50`} readOnly />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className={`${labelCls} w-24 shrink-0 mb-0 mt-2`}>부서</label>
                  <div className="flex flex-1 gap-1 max-w-[252px]">
                    <input type="text" value={form.department} onChange={e => updateForm("department", e.target.value)} className={`${inputCls} w-24`} />
                    <button className="w-7 h-7 flex items-center justify-center bg-white border border-slate-300 rounded hover:bg-slate-50 shrink-0 transition-colors">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <input type="text" className={`${inputCls} flex-1 bg-slate-50`} readOnly />
                  </div>
                </div>

                <div className="flex items-start border-t border-slate-100 pt-4">
                  <label className={`${labelCls} w-24 shrink-0 mt-2`}>비고</label>
                  <textarea 
                    value={form.note} 
                    onChange={e => updateForm("note", e.target.value)}
                    className="w-full max-w-[800px] h-20 p-2 text-xs bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center border-t border-slate-100 pt-4">
                  <label className={`${labelCls} w-24 shrink-0 mb-0 mt-2`}>작업일자</label>
                  <div className="flex-1 flex gap-4">
                    <input type="text" value={form.workDate} readOnly className={`${inputCls} w-64 bg-slate-50 text-slate-500`} />
                    <div className="flex items-center w-full max-w-[400px]">
                      <label className={`${labelCls} w-20 shrink-0 mb-0 mt-2`}>작업ID</label>
                      <input type="text" value={form.workId} readOnly className={`${inputCls} flex-1 bg-slate-50 text-slate-500`} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 요청품목 탭 콘텐츠 (AI 비전 자동 입력 폼)
              <div className="flex flex-col h-full">
                {form.items.length > 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 shadow-sm relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 max-w-[90%]">
                      <div className="flex items-center gap-2 col-span-2">
                        <label className={`${reqLabel} w-20 shrink-0 mb-0 mt-1`}>품목코드</label>
                        <div className="flex items-center gap-1 flex-1 max-w-xl">
                          <input type="text" value={form.items[0].itemCode} className={`${inputCls} w-36`} readOnly />
                          <button className="w-7 h-7 bg-white border border-slate-300 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center shrink-0 transition-colors">
                            <Search className="w-3.5 h-3.5" />
                          </button>
                          <input type="text" value={form.items[0].itemName} className={`${inputCls} flex-1`} readOnly />
                        </div>
                        <label className={`${labelCls} w-10 text-center mb-0 mt-1`}>규격</label>
                        <input type="text" value={form.items[0].std} className={`${inputCls} w-24 bg-slate-50 text-slate-500`} readOnly />
                        <label className={`${labelCls} w-10 text-center mb-0 mt-1`}>단위</label>
                        <input type="text" value={form.items[0].unit} className={`${inputCls} w-16 bg-slate-50 text-center text-slate-500`} readOnly />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className={`${labelCls} w-20 shrink-0 mb-0 mt-1`}>요청수량</label>
                        <input type="number" value={form.items[0].reqQty} className={`${inputCls} w-24 text-right`} />
                        
                        <label className={`${labelCls} w-16 text-center shrink-0 mb-0 mt-1`}>검사수량</label>
                        <input type="number" value={form.items[0].inspQty} className={`${inputCls} w-24 text-right bg-slate-50 text-slate-500`} readOnly />
                        
                        <label className={`${reqLabel} w-16 text-center shrink-0 mb-0 mt-1`}>불량수량</label>
                        <input type="number" value={form.items[0].defectQty} className={`${inputCls} w-24 text-right text-rose-600 font-bold bg-rose-50 border-rose-200`} readOnly />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <label className={`${labelCls} w-20 shrink-0 mb-0 mt-1`}>완료요청일</label>
                        <input type="date" value={form.items[0].reqDate} className={`${inputCls} w-32`} />
                      </div>

                      <div className="flex items-center gap-2 col-span-2">
                        <label className={`${labelCls} w-20 shrink-0 mb-0 mt-1`}>검사상태</label>
                        <select value={form.items[0].inspStatus} className={`${selectCls} w-24`}>
                          <option value="요청">요청</option>
                          <option value="완료">완료</option>
                        </select>
                        
                        <div className="flex items-center gap-1.5 ml-2 text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">{form.items[0].defectName}</span>
                        </div>
                        
                        <label className={`${labelCls} w-16 text-center shrink-0 mb-0 mt-1`}>조치의견</label>
                        <input type="text" value={form.items[0].actionNote} placeholder="조치의견" className={`${inputCls} flex-1`} />
                        
                        <label className={`${labelCls} w-16 text-center shrink-0 mb-0 mt-1`}>조치상태</label>
                        <input type="text" value={form.items[0].actionStatus} className={`${inputCls} w-24 bg-slate-50 text-slate-500`} readOnly />
                      </div>

                      <div className="flex items-center gap-2 col-span-2">
                        <label className={`${labelCls} w-20 shrink-0 mb-0 mt-1`}>연동번호</label>
                        <input type="text" value={form.items[0].linkNo} className={`${inputCls} w-32`} />
                        
                        <label className={`${labelCls} w-10 text-center shrink-0 mb-0 mt-1`}>비고</label>
                        <input type="text" value={form.items[0].note} className={`${inputCls} flex-1 bg-amber-50 text-amber-600 border-amber-200 font-medium`} />
                      </div>

                      <div className="flex items-start gap-2 col-span-2 mt-2">
                        <label className={`${labelCls} w-20 shrink-0 pt-1`}>이미지</label>
                        <div className="flex gap-4">
                          <div className="w-32 h-24 bg-white border border-slate-200 rounded overflow-hidden flex flex-col items-center justify-center relative group">
                            {form.items[0].image ? (
                              <>
                                <div className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold z-10 shadow">AI DETECTED</div>
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center relative">
                                  <div className="absolute inset-0 border-2 border-rose-500 m-4 rounded opacity-80" />
                                  <span className="text-rose-600 text-xs font-bold font-mono tracking-wider">{form.items[0].defectName}</span>
                                </div>
                              </>
                            ) : (
                              <span className="text-xs text-slate-400">img</span>
                            )}
                          </div>
                          <div className="flex flex-col justify-end gap-2">
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium text-left transition-colors">파일 선택</button>
                            <span className="text-[10px] text-slate-500">선택된 파일 없음</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-300 border-dashed rounded-lg p-8 mb-4 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 border border-slate-200 shadow-sm">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-sm mb-1 font-medium">선택된 요청품목이 없습니다.</p>
                    <p className="text-slate-500 text-xs mb-4">우측 상단의 '+' 버튼을 눌러 품목을 추가하고 AI 비전 검사를 진행하세요.</p>
                    <button 
                      onClick={() => setShowItemModal(true)}
                      className="px-4 py-2 bg-blue-50 border border-blue-200 rounded text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors shadow-sm"
                    >
                      품목 추가하기
                    </button>
                  </div>
                )}

                {/* 품목 목록 테이블 */}
                <div className="flex-1 flex flex-col mt-2">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-800 text-sm">품목 목록</span>
                    <span className="text-blue-600 font-bold bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded text-xs">{form.items.length}건</span>
                    <span className="text-[11px] text-slate-500 ml-2">※ Enter로 품목 추가</span>
                  </div>
                  
                  <div className="flex-1 bg-white border border-slate-200 rounded overflow-hidden flex flex-col">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="py-2.5 px-2 text-center w-10 font-medium">삭제</th>
                          <th className="py-2.5 px-2 text-center w-10 font-medium">순번</th>
                          <th className="py-2.5 px-2 text-center w-12 font-medium">Img</th>
                          <th className="py-2.5 px-2 font-medium w-40">품목코드</th>
                          <th className="py-2.5 px-2 font-medium">품목명</th>
                          <th className="py-2.5 px-2 font-medium w-32">규격</th>
                          <th className="py-2.5 px-2 font-medium w-32">연동번호</th>
                          <th className="py-2.5 px-2 font-medium w-32">결과번호</th>
                          <th className="py-2.5 px-2 text-right font-medium w-20">요청수량</th>
                          <th className="py-2.5 px-2 text-center font-medium w-16">단위</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.items.map((item, idx) => (
                          <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-2 text-center">
                              <button onClick={() => handleDeleteItem(item.id)} className="text-rose-500 hover:text-rose-600 transition-colors">
                                <Trash2 className="w-3.5 h-3.5 mx-auto" />
                              </button>
                            </td>
                            <td className="py-2 px-2 text-center text-slate-500 flex items-center justify-center gap-1">
                              <Play className="w-2.5 h-2.5 text-blue-500" fill="currentColor" /> {idx + 1}
                            </td>
                            <td className="py-2 px-2 text-center">
                              {item.image ? <div className="w-4 h-4 bg-blue-100 text-blue-600 rounded flex items-center justify-center mx-auto text-[8px] border border-blue-200">Pic</div> : "-"}
                            </td>
                            <td className="py-2 px-2 font-mono text-blue-600">{item.itemCode}</td>
                            <td className="py-2 px-2 text-slate-800 truncate max-w-[200px]">{item.itemName}</td>
                            <td className="py-2 px-2 text-slate-600">{item.std}</td>
                            <td className="py-2 px-2 text-slate-600">{item.linkNo}</td>
                            <td className="py-2 px-2 text-slate-600">{item.resultNo}</td>
                            <td className="py-2 px-2 text-right font-medium text-slate-700">{item.reqQty}</td>
                            <td className="py-2 px-2 text-center text-slate-500">{item.unit}</td>
                          </tr>
                        ))}
                        {form.items.length === 0 && (
                          <tr>
                            <td colSpan={10} className="py-8 text-center text-slate-500">등록된 품목이 없습니다.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 품목 선택 모달 */}
      {showItemModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" /> 품목 검색 및 AI 검사
              </h3>
              <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-white border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="품목명 또는 코드로 검색..." className="w-full h-9 pl-9 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" autoFocus />
              </div>
            </div>
            <div className="max-h-[300px] overflow-auto bg-white">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 sticky top-0 text-slate-500 text-xs border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-4 font-medium w-32">품목코드</th>
                    <th className="py-2 px-4 font-medium">품목명</th>
                    <th className="py-2 px-4 font-medium w-24 text-center">동작</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 group transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-blue-600">P-00-D4HXX-0-361</td>
                    <td className="py-3 px-4 font-medium text-slate-700 group-hover:text-slate-900 transition-colors">D4H LOOSE LINK & PIN&BUSH GROUP WITH SEAL</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleItemSelect("P-00-D4HXX-0-361", "D4H LOOSE LINK & PIN&BUSH GROUP WITH SEAL", "KBJ(LUB)")}
                        className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded transition-all shadow-sm"
                      >
                        선택 & AI검사
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 group transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-blue-600">P-01-A123-B</td>
                    <td className="py-3 px-4 font-medium text-slate-700 group-hover:text-slate-900 transition-colors">CATERPILLAR TRACK CHAIN ASSEMBLY</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleItemSelect("P-01-A123-B", "CATERPILLAR TRACK CHAIN ASSEMBLY", "STD")}
                        className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded transition-all shadow-sm"
                      >
                        선택 & AI검사
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 group transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-blue-600">M-99-ZZZZ-9</td>
                    <td className="py-3 px-4 font-medium text-slate-700 group-hover:text-slate-900 transition-colors">EXCAVATOR BUCKET TOOTH ADAPTER</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleItemSelect("M-99-ZZZZ-9", "EXCAVATOR BUCKET TOOTH ADAPTER", "HEAVY")}
                        className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded transition-all shadow-sm"
                      >
                        선택 & AI검사
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
              <span>품목을 선택하면 자동으로 AI 비전 검사가 시뮬레이션 됩니다.</span>
              <button onClick={() => setShowItemModal(false)} className="px-4 py-1.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-700 transition-colors">닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </SmartFactoryWrapper>
  );
}

