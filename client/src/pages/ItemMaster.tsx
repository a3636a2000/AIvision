import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package, Search, Download, Plus, Trash2, Save,
  CheckCircle, XCircle, FileSpreadsheet, Layers,
  Info, Ruler, Warehouse, Factory as FactoryIcon,
  Settings2, Users, Truck, RotateCcw
} from "lucide-react";
import SmartFactoryWrapper from "@/components/SmartFactoryWrapper";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Item {
  id: number;
  useYn: boolean;
  bomYn: boolean;
  itemType: string;
  acctCode: string;
  acctName: string;
  itemCd: string;
  itemName: string;
  std: string;
  drawNo: string;
  engName: string;
  itemGroup: string;
  baseUnit: string;
  convUnit: string;
  baseRatio: number;
  convRatio: number;
  bomUnit: string;
  bomBaseRatio: number;
  bomRatio: number;
  warehouseCd: string;
  warehouseName: string;
  procCd: string;
  procName: string;
  equipCd: string;
  equipName: string;
  prodLt: number;
  category: string;
  prodPlan: string;
  inOutType: string;
  supplyType: string;
  outsourceCd: string;
  vendorName: string;
  properStock: number;
  safetyStock: number;
  initCarryQty: number;
  initCarryAmt: number;
  stdCost: number;
  workDate: string;
  workId: string;
}

const EMPTY_ITEM: Omit<Item, "id"> = {
  useYn: true, bomYn: false, itemType: "제품", acctCode: "1310", acctName: "제품",
  itemCd: "", itemName: "", std: "", drawNo: "", engName: "",
  itemGroup: "", baseUnit: "EA", convUnit: "", baseRatio: 1, convRatio: 1,
  bomUnit: "", bomBaseRatio: 1, bomRatio: 1,
  warehouseCd: "", warehouseName: "", procCd: "", procName: "",
  equipCd: "", equipName: "", prodLt: 0, category: "", prodPlan: "",
  inOutType: "사내", supplyType: "", outsourceCd: "", vendorName: "",
  properStock: 0, safetyStock: 0, initCarryQty: 0, initCarryAmt: 0,
  stdCost: 0, workDate: new Date().toISOString().split("T")[0], workId: "",
};

const ITEM_TYPES = ["전체", "제품", "반제품", "원자재", "부자재"];

const TABS = [
  { id: "basic", label: "기본정보", icon: Info },
  { id: "unit", label: "단위정보", icon: Ruler },
  { id: "stock", label: "재고정보", icon: Warehouse },
  { id: "prod", label: "생산정보", icon: FactoryIcon },
  { id: "etc", label: "기타정보", icon: Settings2 },
  { id: "emp", label: "사원별단가", icon: Users },
  { id: "vendor", label: "거래처별단가", icon: Truck },
];

const TABLE_COLS: { key: keyof Item; label: string; w?: string }[] = [
  { key: "useYn", label: "사용", w: "w-10" },
  { key: "bomYn", label: "BOM", w: "w-10" },
  { key: "itemType", label: "품목구분" },
  { key: "acctCode", label: "계정코드" },
  { key: "acctName", label: "계정명" },
  { key: "itemCd", label: "품목코드", w: "min-w-[140px]" },
  { key: "itemName", label: "품목명", w: "min-w-[180px]" },
  { key: "std", label: "규격" },
  { key: "drawNo", label: "도번" },
  { key: "engName", label: "영문명" },
  { key: "itemGroup", label: "품목그룹" },
  { key: "baseUnit", label: "기준단위" },
  { key: "convUnit", label: "환산단위" },
  { key: "baseRatio", label: "기준비율" },
  { key: "convRatio", label: "환산비율" },
  { key: "bomUnit", label: "BOM단위" },
  { key: "bomBaseRatio", label: "기준비율" },
  { key: "bomRatio", label: "BOM비율" },
  { key: "warehouseCd", label: "기본창고" },
  { key: "warehouseName", label: "창고명" },
  { key: "procCd", label: "공정코드" },
  { key: "procName", label: "공정명" },
  { key: "equipCd", label: "설비코드" },
  { key: "equipName", label: "설비명" },
  { key: "prodLt", label: "생산L/T" },
  { key: "category", label: "구분" },
  { key: "prodPlan", label: "생산예정" },
  { key: "inOutType", label: "사내/외" },
  { key: "supplyType", label: "사급종류" },
  { key: "outsourceCd", label: "외주처" },
  { key: "vendorName", label: "거래처명" },
  { key: "properStock", label: "적정재고" },
  { key: "safetyStock", label: "안전재고" },
  { key: "initCarryQty", label: "초기이월수량" },
  { key: "initCarryAmt", label: "초기이월금액" },
  { key: "stdCost", label: "표준원가" },
  { key: "workDate", label: "작업일" },
  { key: "workId", label: "작업ID" },
];

export default function ItemMasterPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Item, "id">>(EMPTY_ITEM);
  const [activeTab, setActiveTab] = useState("basic");
  const [searchText, setSearchText] = useState("");
  const [searchStd, setSearchStd] = useState("");
  const [filterType, setFilterType] = useState("전체");
  const [includeUnused, setIncludeUnused] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["/api/items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("조회 실패");
      return res.json();
    },
  });

  const filtered = items.filter(item => {
    if (!includeUnused && !item.useYn) return false;
    if (filterType !== "전체" && item.itemType !== filterType) return false;
    if (searchText && !item.itemCd?.toLowerCase().includes(searchText.toLowerCase()) && !item.itemName?.toLowerCase().includes(searchText.toLowerCase())) return false;
    if (searchStd && !item.std?.toLowerCase().includes(searchStd.toLowerCase())) return false;
    return true;
  });

  const selectItem = useCallback((item: Item) => {
    setSelectedId(item.id);
    setIsNew(false);
    const { id: _, ...rest } = item as any;
    setForm(rest);
  }, []);

  const handleNew = () => {
    setSelectedId(null);
    setIsNew(true);
    setForm({ ...EMPTY_ITEM, workDate: new Date().toISOString().split("T")[0] });
    setActiveTab("basic");
    toast({ title: "신규 품목", description: "하단 폼에서 정보를 입력 후 저장하세요." });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const url = isNew ? "/api/items" : `/api/items/${selectedId}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || "저장 실패"); }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "저장 완료", description: `${form.itemCd} - ${form.itemName}` });
      qc.invalidateQueries({ queryKey: ["/api/items"] });
      if (isNew && data.data?.id) { setSelectedId(data.data.id); setIsNew(false); }
    },
    onError: (err: Error) => toast({ variant: "destructive", title: "저장 실패", description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/items/${selectedId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "삭제 완료" });
      qc.invalidateQueries({ queryKey: ["/api/items"] });
      setSelectedId(null); setIsNew(false); setForm(EMPTY_ITEM);
    },
    onError: (err: Error) => toast({ variant: "destructive", title: "삭제 실패", description: err.message }),
  });

  const handleSave = () => {
    if (!form.itemCd || !form.itemName) { toast({ variant: "destructive", title: "오류", description: "품목코드와 품목명은 필수입니다." }); return; }
    saveMutation.mutate();
  };

  const handleDelete = () => {
    if (!selectedId) return;
    if (!confirm("선택한 품목을 삭제하시겠습니까?")) return;
    deleteMutation.mutate();
  };

  const F = (field: keyof Omit<Item, "id">, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const inputCls = "h-7 px-2 text-xs bg-slate-800/80 border border-white/10 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500";
  const selectCls = `${inputCls} appearance-none cursor-pointer`;
  const labelCls = "text-[10px] text-slate-400 mb-0.5 block font-medium truncate";
  const reqLabel = "text-[10px] text-rose-400 mb-0.5 block font-medium";

  const renderCell = (item: Item, col: typeof TABLE_COLS[0]) => {
    const v = item[col.key];
    if (col.key === "useYn") return v ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mx-auto" /> : <XCircle className="w-3.5 h-3.5 text-slate-600 mx-auto" />;
    if (col.key === "bomYn") return v ? <CheckCircle className="w-3.5 h-3.5 text-cyan-400 mx-auto" /> : <span className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block" />;
    if (col.key === "itemCd") return <span className="text-violet-400 font-semibold">{v}</span>;
    if (col.key === "itemName") return <span className="text-cyan-300">{v}</span>;
    if (typeof v === "number") return <span className="text-slate-300">{v.toLocaleString()}</span>;
    return <span className="text-slate-300">{v || "-"}</span>;
  };

  return (
    <SmartFactoryWrapper>
      <Toaster />
      <style>{`
        @keyframes slide-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-glow { 0%,100%{opacity:.3} 50%{opacity:.7} }
        .card-animate { animation: slide-in .4s ease-out both; }
        .glass { backdrop-filter:blur(12px); background:rgba(15,23,42,.6); border:1px solid rgba(255,255,255,.08); }
        .glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

      <div className="min-h-full flex flex-col text-sm relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 -m-4 lg:-m-5 p-4 lg:p-5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-20 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl glow" />
          <div className="absolute bottom-16 right-10 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl glow" style={{ animationDelay: "1.5s" }} />
        </div>

        {/* 툴바 */}
        <div className="relative glass rounded-xl p-3 mb-3 card-animate flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 border-r border-white/10 pr-3 mr-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">품목등록</span>
          </div>
          <div className="flex items-center gap-1">
            <label className="text-[10px] text-slate-400">품목구분</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className={`${selectCls} w-20`}>
              {ITEM_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <label className="text-[10px] text-slate-400">품목명</label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
              <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="품목코드/품목명" className={`${inputCls} pl-6 w-36`} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <label className="text-[10px] text-slate-400">규격</label>
            <input value={searchStd} onChange={e => setSearchStd(e.target.value)} placeholder="규격" className={`${inputCls} w-24`} />
          </div>
          <button className="h-7 px-2.5 text-xs rounded-md bg-cyan-600 text-white hover:bg-cyan-500 shadow-md shadow-cyan-600/20 flex items-center gap-1 transition-colors">
            <FileSpreadsheet className="w-3 h-3" /> 엑셀다운로드
          </button>
          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
            <input type="checkbox" checked={includeUnused} onChange={e => setIncludeUnused(e.target.checked)} className="w-3.5 h-3.5 rounded border-white/20 bg-slate-800 text-violet-500 focus:ring-violet-500 focus:ring-1" />
            미사용포함
          </label>
          <div className="flex items-center gap-1.5 ml-auto">
            <button onClick={() => qc.invalidateQueries({ queryKey: ["/api/items"] })} className="h-7 px-2.5 text-xs rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3 h-3" /> 조회
            </button>
            <button onClick={handleNew} className="h-7 px-2.5 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3" /> 신규
            </button>
            <button onClick={handleSave} disabled={saveMutation.isPending} className="h-7 px-2.5 text-xs rounded-md bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-600/30 flex items-center gap-1 transition-colors disabled:opacity-50">
              <Save className="w-3 h-3" /> {saveMutation.isPending ? "저장중..." : "저장"}
            </button>
            <button onClick={handleDelete} disabled={!selectedId || deleteMutation.isPending} className="h-7 px-2.5 text-xs rounded-md bg-rose-600/80 text-white hover:bg-rose-500 flex items-center gap-1 transition-colors disabled:opacity-30">
              <Trash2 className="w-3 h-3" /> 삭제
            </button>
          </div>
        </div>

        {/* 품목 목록 테이블 */}
        <div className="relative glass rounded-xl overflow-hidden mb-3 card-animate" style={{ animationDelay: ".08s" }}>
          <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-semibold text-white">품목 목록</span>
            </div>
            <span className="text-[10px] text-slate-500">{isLoading ? "로딩중..." : `${filtered.length}건`}</span>
          </div>
          <div className="overflow-auto max-h-[230px]">
            <table className="w-full text-[11px] whitespace-nowrap">
              <thead className="sticky top-0 bg-slate-800/95 border-b border-white/5 z-10">
                <tr>
                  <th className="w-10 text-center px-1.5 py-2 text-slate-400 font-medium">순번</th>
                  {TABLE_COLS.map(col => (
                    <th key={col.key} className={`px-1.5 py-2 text-left text-slate-400 font-medium ${col.w || ""}`}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={item.id}
                    className={`border-b border-white/5 cursor-pointer transition-colors ${selectedId === item.id ? 'bg-violet-500/20' : 'hover:bg-white/5'}`}
                    onClick={() => selectItem(item)}>
                    <td className="text-center px-1.5 py-1.5 text-slate-500">{idx + 1}</td>
                    {TABLE_COLS.map(col => (
                      <td key={col.key} className={`px-1.5 py-1.5 ${col.key === "useYn" || col.key === "bomYn" ? "text-center" : ""}`}>
                        {renderCell(item, col)}
                      </td>
                    ))}
                  </tr>
                ))}
                {!isLoading && filtered.length === 0 && (
                  <tr><td colSpan={TABLE_COLS.length + 1} className="text-center py-10 text-slate-600">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    {items.length === 0 ? "등록된 품목이 없습니다. 신규 버튼을 눌러 추가하세요." : "검색 결과가 없습니다."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 하단 상세 폼 */}
        <div className="relative glass rounded-xl overflow-hidden flex-1 card-animate flex flex-col" style={{ animationDelay: ".16s" }}>
          <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-white">
              {isNew ? "신규 품목 등록" : selectedId ? `${form.itemCd || "품목코드"} — ${form.itemName || "품목명"}` : "품목을 선택하세요"}
            </span>
          </div>

          <div className="px-4 pt-1.5 border-b border-white/5 flex gap-0.5 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium rounded-t-md border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "border-violet-500 text-violet-400 bg-violet-500/10" : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}>
                <tab.icon className="w-3 h-3" />{tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 flex-1 overflow-auto">
            {!selectedId && !isNew ? (
              <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                <div className="text-center">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p>상단 목록에서 품목을 선택하거나 신규 버튼을 눌러주세요</p>
                </div>
              </div>
            ) : activeTab === "basic" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2">
                <div><label className={reqLabel}>품목코드 *</label><input className={`${inputCls} w-full`} value={form.itemCd} onChange={e => F("itemCd", e.target.value)} /></div>
                <div><label className={reqLabel}>품목명 *</label><input className={`${inputCls} w-full`} value={form.itemName} onChange={e => F("itemName", e.target.value)} /></div>
                <div><label className={labelCls}>영문명</label><input className={`${inputCls} w-full`} value={form.engName} onChange={e => F("engName", e.target.value)} /></div>
                <div><label className={reqLabel}>품목구분 *</label>
                  <select className={`${selectCls} w-full`} value={form.itemType} onChange={e => F("itemType", e.target.value)}>
                    {["제품","반제품","원자재","부자재"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>품목그룹</label><input className={`${inputCls} w-full`} value={form.itemGroup} onChange={e => F("itemGroup", e.target.value)} /></div>
                <div><label className={labelCls}>규격</label><input className={`${inputCls} w-full`} value={form.std} onChange={e => F("std", e.target.value)} /></div>
                <div><label className={labelCls}>도면번호</label><input className={`${inputCls} w-full`} value={form.drawNo} onChange={e => F("drawNo", e.target.value)} /></div>
                <div><label className={labelCls}>계정코드</label><input className={`${inputCls} w-full`} value={form.acctCode} onChange={e => F("acctCode", e.target.value)} /></div>
                <div><label className={labelCls}>계정명</label><input className={`${inputCls} w-full`} value={form.acctName} onChange={e => F("acctName", e.target.value)} /></div>
                <div><label className={labelCls}>사용여부</label>
                  <select className={`${selectCls} w-full`} value={form.useYn ? "Y" : "N"} onChange={e => F("useYn", e.target.value === "Y")}>
                    <option value="Y">사용</option><option value="N">미사용</option>
                  </select>
                </div>
                <div><label className={labelCls}>BOM</label>
                  <select className={`${selectCls} w-full`} value={form.bomYn ? "Y" : "N"} onChange={e => F("bomYn", e.target.value === "Y")}>
                    <option value="N">N</option><option value="Y">Y</option>
                  </select>
                </div>
                <div><label className={labelCls}>구분</label><input className={`${inputCls} w-full`} value={form.category} onChange={e => F("category", e.target.value)} /></div>
              </div>
            ) : activeTab === "unit" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2">
                <div><label className={labelCls}>기준단위</label><input className={`${inputCls} w-full`} value={form.baseUnit} onChange={e => F("baseUnit", e.target.value)} /></div>
                <div><label className={labelCls}>환산단위</label><input className={`${inputCls} w-full`} value={form.convUnit} onChange={e => F("convUnit", e.target.value)} /></div>
                <div><label className={labelCls}>기준비율</label><input type="number" className={`${inputCls} w-full`} value={form.baseRatio} onChange={e => F("baseRatio", Number(e.target.value))} /></div>
                <div><label className={labelCls}>환산비율</label><input type="number" className={`${inputCls} w-full`} value={form.convRatio} onChange={e => F("convRatio", Number(e.target.value))} /></div>
                <div><label className={labelCls}>BOM단위</label><input className={`${inputCls} w-full`} value={form.bomUnit} onChange={e => F("bomUnit", e.target.value)} /></div>
                <div><label className={labelCls}>BOM 기준비율</label><input type="number" className={`${inputCls} w-full`} value={form.bomBaseRatio} onChange={e => F("bomBaseRatio", Number(e.target.value))} /></div>
                <div><label className={labelCls}>BOM비율</label><input type="number" className={`${inputCls} w-full`} value={form.bomRatio} onChange={e => F("bomRatio", Number(e.target.value))} /></div>
              </div>
            ) : activeTab === "stock" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2">
                <div><label className={labelCls}>기본창고코드</label><input className={`${inputCls} w-full`} value={form.warehouseCd} onChange={e => F("warehouseCd", e.target.value)} /></div>
                <div><label className={labelCls}>창고명</label><input className={`${inputCls} w-full`} value={form.warehouseName} onChange={e => F("warehouseName", e.target.value)} /></div>
                <div><label className={labelCls}>적정재고</label><input type="number" className={`${inputCls} w-full`} value={form.properStock} onChange={e => F("properStock", Number(e.target.value))} /></div>
                <div><label className={labelCls}>안전재고</label><input type="number" className={`${inputCls} w-full`} value={form.safetyStock} onChange={e => F("safetyStock", Number(e.target.value))} /></div>
                <div><label className={labelCls}>초기이월수량</label><input type="number" className={`${inputCls} w-full`} value={form.initCarryQty} onChange={e => F("initCarryQty", Number(e.target.value))} /></div>
                <div><label className={labelCls}>초기이월금액</label><input type="number" className={`${inputCls} w-full`} value={form.initCarryAmt} onChange={e => F("initCarryAmt", Number(e.target.value))} /></div>
                <div><label className={labelCls}>표준원가</label><input type="number" className={`${inputCls} w-full`} value={form.stdCost} onChange={e => F("stdCost", Number(e.target.value))} /></div>
              </div>
            ) : activeTab === "prod" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2">
                <div><label className={labelCls}>공정코드</label><input className={`${inputCls} w-full`} value={form.procCd} onChange={e => F("procCd", e.target.value)} /></div>
                <div><label className={labelCls}>공정명</label><input className={`${inputCls} w-full`} value={form.procName} onChange={e => F("procName", e.target.value)} /></div>
                <div><label className={labelCls}>설비코드</label><input className={`${inputCls} w-full`} value={form.equipCd} onChange={e => F("equipCd", e.target.value)} /></div>
                <div><label className={labelCls}>설비명</label><input className={`${inputCls} w-full`} value={form.equipName} onChange={e => F("equipName", e.target.value)} /></div>
                <div><label className={labelCls}>생산L/T (일)</label><input type="number" className={`${inputCls} w-full`} value={form.prodLt} onChange={e => F("prodLt", Number(e.target.value))} /></div>
                <div><label className={labelCls}>생산예정</label><input className={`${inputCls} w-full`} value={form.prodPlan} onChange={e => F("prodPlan", e.target.value)} /></div>
                <div><label className={labelCls}>사내/외</label>
                  <select className={`${selectCls} w-full`} value={form.inOutType} onChange={e => F("inOutType", e.target.value)}>
                    <option value="사내">사내</option><option value="사외">사외</option>
                  </select>
                </div>
                <div><label className={labelCls}>사급종류</label><input className={`${inputCls} w-full`} value={form.supplyType} onChange={e => F("supplyType", e.target.value)} /></div>
                <div><label className={labelCls}>외주처</label><input className={`${inputCls} w-full`} value={form.outsourceCd} onChange={e => F("outsourceCd", e.target.value)} /></div>
                <div><label className={labelCls}>거래처명</label><input className={`${inputCls} w-full`} value={form.vendorName} onChange={e => F("vendorName", e.target.value)} /></div>
              </div>
            ) : activeTab === "etc" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2">
                <div><label className={labelCls}>작업일</label><input type="date" className={`${inputCls} w-full`} value={form.workDate} onChange={e => F("workDate", e.target.value)} /></div>
                <div><label className={labelCls}>작업ID</label><input className={`${inputCls} w-full`} value={form.workId} onChange={e => F("workId", e.target.value)} /></div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-slate-600 text-sm">
                <div className="text-center">
                  <Settings2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>{TABS.find(t => t.id === activeTab)?.label} — 준비 중</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SmartFactoryWrapper>
  );
}
