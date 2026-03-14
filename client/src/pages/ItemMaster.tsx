import { useState } from "react";
import {
  Package, Search, Download, Plus, Trash2, Save,
  CheckCircle, XCircle, FileSpreadsheet, Layers, Settings2, Box,
  BarChart3, Users, Truck, Info, Ruler, Warehouse, Factory as FactoryIcon
} from "lucide-react";
import SmartFactoryWrapper from "@/components/SmartFactoryWrapper";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface ItemRecord {
  id: number;
  use: boolean;
  bom: boolean;
  itemType: string;
  acctCode: string;
  acctName: string;
  itemCd: string;
  itemName: string;
  engName: string;
  std: string;
  drawNo: string;
  itemGroup: string;
  hsCode: string;
  visible: boolean;
  lotMgmt: string;
  qcMgmt: string;
  warehouse: string;
}

const initialItems: ItemRecord[] = [
  { id: 1, use: true, bom: false, itemType: "제품", acctCode: "1310", acctName: "제품", itemCd: "25002C001", itemName: "배선조립체", engName: "", std: "-", drawNo: "", itemGroup: "완제품", hsCode: "", visible: true, lotMgmt: "미사용", qcMgmt: "미사용", warehouse: "공정창고" },
  { id: 2, use: true, bom: false, itemType: "제품", acctCode: "1310", acctName: "제품", itemCd: "P-GO-D4HKXX-O-111", itemName: "D4H LOOSE LINK & PIN&BUSH GROUP WITH SEAL", engName: "2q35r213", std: "KBJ(LUB)", drawNo: "", itemGroup: "완제품", hsCode: "", visible: true, lotMgmt: "미사용", qcMgmt: "미사용", warehouse: "완제품창고" },
  { id: 3, use: true, bom: false, itemType: "제품", acctCode: "1310", acctName: "제품", itemCd: "P-GO-D4HKXX-O-361", itemName: "D4H LOOSE LINK & PIN&BUSH GROUP WITH SEAL", engName: "", std: "KBJ(LUB)", drawNo: "", itemGroup: "완제품", hsCode: "", visible: true, lotMgmt: "미사용", qcMgmt: "미사용", warehouse: "완제품창고" },
  { id: 4, use: true, bom: false, itemType: "제품", acctCode: "1310", acctName: "제품", itemCd: "P-G235-SB2", itemName: "가드레일G235-SB2", engName: "", std: "W4000×H725mm", drawNo: "", itemGroup: "완제품", hsCode: "", visible: true, lotMgmt: "미사용", qcMgmt: "미사용", warehouse: "완제품창고" },
  { id: 5, use: true, bom: false, itemType: "반제품", acctCode: "1320", acctName: "반제품", itemCd: "W-BL-D4HKXX-O-100", itemName: "[D4H] T/BUSH [LUB] : 소재절단", engName: "", std: "SCR440(Φ58×116)", drawNo: "", itemGroup: "공정품", hsCode: "", visible: true, lotMgmt: "사용", qcMgmt: "사용", warehouse: "공정창고" },
  { id: 6, use: true, bom: false, itemType: "반제품", acctCode: "1320", acctName: "반제품", itemCd: "W-BL-D4HKXX-O-200", itemName: "[D4H] T/BUSH [LUB] : Through 가공", engName: "", std: "SCR440(Φ58×116)", drawNo: "", itemGroup: "공정품", hsCode: "", visible: true, lotMgmt: "사용", qcMgmt: "미사용", warehouse: "공정창고" },
];

const TABS = [
  { id: "basic", label: "기본정보", icon: Info },
  { id: "unit", label: "단위정보", icon: Ruler },
  { id: "stock", label: "재고정보", icon: Warehouse },
  { id: "prod", label: "생산정보", icon: FactoryIcon },
  { id: "etc", label: "기타정보", icon: Settings2 },
  { id: "emp", label: "사원별단가", icon: Users },
  { id: "vendor", label: "거래처별단가", icon: Truck },
];

const ITEM_TYPES = ["전체", "제품", "반제품", "원자재", "부자재"];

export default function ItemMasterPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<ItemRecord[]>(initialItems);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [searchText, setSearchText] = useState("");
  const [searchStd, setSearchStd] = useState("");
  const [filterType, setFilterType] = useState("전체");
  const [includeUnused, setIncludeUnused] = useState(false);

  const selected = items.find(i => i.id === selectedId) ?? null;

  const filtered = items.filter(item => {
    if (!includeUnused && !item.use) return false;
    if (filterType !== "전체" && item.itemType !== filterType) return false;
    if (searchText && !item.itemCd.toLowerCase().includes(searchText.toLowerCase()) && !item.itemName.toLowerCase().includes(searchText.toLowerCase())) return false;
    if (searchStd && !item.std.toLowerCase().includes(searchStd.toLowerCase())) return false;
    return true;
  });

  const handleSelect = (id: number) => setSelectedId(id);

  const handleFieldChange = (field: keyof ItemRecord, value: any) => {
    if (!selectedId) return;
    setItems(prev => prev.map(item => item.id === selectedId ? { ...item, [field]: value } : item));
  };

  const handleAdd = () => {
    const newId = Math.max(...items.map(i => i.id), 0) + 1;
    const newItem: ItemRecord = {
      id: newId, use: true, bom: false, itemType: "제품", acctCode: "1310", acctName: "제품",
      itemCd: "", itemName: "", engName: "", std: "", drawNo: "", itemGroup: "",
      hsCode: "", visible: true, lotMgmt: "미사용", qcMgmt: "미사용", warehouse: "",
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newId);
    toast({ title: "신규 품목 추가", description: "하단 폼에서 정보를 입력해주세요." });
  };

  const handleDelete = () => {
    if (!selectedId) return;
    if (!confirm("선택한 품목을 삭제하시겠습니까?")) return;
    setItems(prev => prev.filter(i => i.id !== selectedId));
    setSelectedId(null);
    toast({ title: "삭제 완료" });
  };

  const handleSave = () => {
    if (!selected) { toast({ variant: "destructive", title: "오류", description: "품목을 선택해주세요." }); return; }
    if (!selected.itemCd || !selected.itemName) { toast({ variant: "destructive", title: "오류", description: "품목코드와 품목명은 필수입니다." }); return; }
    toast({ title: "저장 완료", description: `${selected.itemCd} - ${selected.itemName}` });
  };

  const inputCls = "h-7 px-2 text-xs bg-slate-800/80 border border-white/10 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500";
  const selectCls = `${inputCls} appearance-none cursor-pointer`;
  const labelCls = "text-[10px] text-slate-400 mb-1 block font-medium";
  const reqLabelCls = "text-[10px] text-rose-400 mb-1 block font-medium";

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

          <div className="flex items-center gap-2">
            <label className="text-[10px] text-slate-400">품목구분</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className={`${selectCls} w-20`}>
              {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <label className="text-[10px] text-slate-400">품목명</label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
              <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="품목코드/품목명" className={`${inputCls} pl-6 w-40`} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <label className="text-[10px] text-slate-400">규격</label>
            <input value={searchStd} onChange={e => setSearchStd(e.target.value)} placeholder="규격" className={`${inputCls} w-24`} />
          </div>

          <button className="h-7 px-3 text-xs rounded-md bg-cyan-600 text-white hover:bg-cyan-500 shadow-md shadow-cyan-600/20 flex items-center gap-1 transition-colors">
            <FileSpreadsheet className="w-3 h-3" /> 엑셀다운로드
          </button>

          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer ml-1">
            <input type="checkbox" checked={includeUnused} onChange={e => setIncludeUnused(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-white/20 bg-slate-800 text-violet-500 focus:ring-violet-500 focus:ring-1" />
            미사용포함
          </label>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={handleAdd} className="h-7 px-3 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3" /> 신규
            </button>
            <button onClick={handleSave} className="h-7 px-3 text-xs rounded-md bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-600/30 flex items-center gap-1 transition-colors">
              <Save className="w-3 h-3" /> 저장
            </button>
            <button onClick={handleDelete} disabled={!selectedId}
              className="h-7 px-3 text-xs rounded-md bg-rose-600/80 text-white hover:bg-rose-500 flex items-center gap-1 transition-colors disabled:opacity-30">
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
            <span className="text-[10px] text-slate-500">{filtered.length}건</span>
          </div>
          <div className="overflow-auto max-h-[260px]">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-800/90 border-b border-white/5">
                <tr>
                  <th className="w-10 text-center px-2 py-2 text-slate-400 font-medium">순번</th>
                  <th className="w-10 text-center px-2 py-2 text-slate-400 font-medium">사용</th>
                  <th className="w-10 text-center px-2 py-2 text-slate-400 font-medium">BOM</th>
                  <th className="px-2 py-2 text-left text-slate-400 font-medium">품목구분</th>
                  <th className="px-2 py-2 text-left text-slate-400 font-medium">계정코드</th>
                  <th className="px-2 py-2 text-left text-slate-400 font-medium">계정명</th>
                  <th className="px-2 py-2 text-left text-slate-400 font-medium min-w-[160px]">품목코드</th>
                  <th className="px-2 py-2 text-left text-slate-400 font-medium min-w-[200px]">품목명</th>
                  <th className="px-2 py-2 text-left text-slate-400 font-medium">규격</th>
                  <th className="px-2 py-2 text-left text-slate-400 font-medium">도번</th>
                  <th className="px-2 py-2 text-left text-slate-400 font-medium">영문명</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={item.id}
                    className={`border-b border-white/5 cursor-pointer transition-colors ${selectedId === item.id ? 'bg-violet-500/20' : 'hover:bg-white/5'}`}
                    onClick={() => handleSelect(item.id)}>
                    <td className="text-center px-2 py-2 text-slate-500">{idx + 1}</td>
                    <td className="text-center px-2 py-2">
                      {item.use ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mx-auto" /> : <XCircle className="w-3.5 h-3.5 text-slate-600 mx-auto" />}
                    </td>
                    <td className="text-center px-2 py-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block" />
                    </td>
                    <td className="px-2 py-2 text-slate-300">{item.itemType}</td>
                    <td className="px-2 py-2 text-slate-400">{item.acctCode}</td>
                    <td className="px-2 py-2 text-slate-300">{item.acctName}</td>
                    <td className="px-2 py-2 text-violet-400 font-semibold">{item.itemCd}</td>
                    <td className="px-2 py-2 text-cyan-300">{item.itemName}</td>
                    <td className="px-2 py-2 text-slate-300">{item.std}</td>
                    <td className="px-2 py-2 text-slate-400">{item.drawNo || "-"}</td>
                    <td className="px-2 py-2 text-slate-400">{item.engName || "-"}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={11} className="text-center py-12 text-slate-600">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    검색 결과가 없습니다
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 하단 상세 폼 */}
        <div className="relative glass rounded-xl overflow-hidden flex-1 card-animate flex flex-col" style={{ animationDelay: ".16s" }}>
          {/* 선택 안내 또는 탭 */}
          <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-white">
                {selected ? `${selected.itemCd} - ${selected.itemName || "품목을 선택하세요"}` : "품목을 선택하세요"}
              </span>
            </div>
          </div>

          {/* 탭 */}
          <div className="px-4 pt-2 border-b border-white/5 flex gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium rounded-t-lg border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-violet-500 text-violet-400 bg-violet-500/10"
                    : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}>
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* 폼 내용 */}
          <div className="p-4 flex-1 overflow-auto">
            {!selected ? (
              <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                <div className="text-center">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p>상단 목록에서 품목을 선택하거나 신규 버튼을 눌러주세요</p>
                </div>
              </div>
            ) : activeTab === "basic" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                <div>
                  <label className={reqLabelCls}>품목코드 *</label>
                  <div className="flex gap-1">
                    <input className={`${inputCls} flex-1`} value={selected.itemCd} onChange={e => handleFieldChange("itemCd", e.target.value)} />
                    <button className="h-7 w-7 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center justify-center transition-colors">
                      <Search className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className={reqLabelCls}>품목명 *</label>
                  <input className={`${inputCls} w-full`} value={selected.itemName} onChange={e => handleFieldChange("itemName", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>영문명</label>
                  <input className={`${inputCls} w-full`} value={selected.engName} onChange={e => handleFieldChange("engName", e.target.value)} />
                </div>
                <div>
                  <label className={reqLabelCls}>품목구분 *</label>
                  <select className={`${selectCls} w-full`} value={selected.itemType} onChange={e => handleFieldChange("itemType", e.target.value)}>
                    {["제품", "반제품", "원자재", "부자재"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>품목그룹</label>
                  <select className={`${selectCls} w-full`} value={selected.itemGroup} onChange={e => handleFieldChange("itemGroup", e.target.value)}>
                    <option value="">선택</option>
                    {["완제품", "공정품", "부품", "소모품"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>규격</label>
                  <input className={`${inputCls} w-full`} value={selected.std} onChange={e => handleFieldChange("std", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>도면번호</label>
                  <input className={`${inputCls} w-full`} value={selected.drawNo} onChange={e => handleFieldChange("drawNo", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>HS코드</label>
                  <input className={`${inputCls} w-full`} value={selected.hsCode} onChange={e => handleFieldChange("hsCode", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>표시여부</label>
                  <select className={`${selectCls} w-full`} value={selected.visible ? "표시" : "비표시"} onChange={e => handleFieldChange("visible", e.target.value === "표시")}>
                    <option value="표시">표시</option>
                    <option value="비표시">비표시</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>LOT관리</label>
                  <select className={`${selectCls} w-full`} value={selected.lotMgmt} onChange={e => handleFieldChange("lotMgmt", e.target.value)}>
                    <option value="미사용">미사용</option>
                    <option value="사용">사용</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>QC관리</label>
                  <select className={`${selectCls} w-full`} value={selected.qcMgmt} onChange={e => handleFieldChange("qcMgmt", e.target.value)}>
                    <option value="미사용">미사용</option>
                    <option value="사용">사용</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>계정코드</label>
                  <div className="flex gap-1">
                    <input className={`${inputCls} flex-1`} value={selected.acctCode} onChange={e => handleFieldChange("acctCode", e.target.value)} />
                    <button className="h-7 w-7 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center justify-center transition-colors">
                      <Search className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>기본창고</label>
                  <div className="flex gap-1">
                    <input className={`${inputCls} flex-1`} value={selected.warehouse} onChange={e => handleFieldChange("warehouse", e.target.value)} />
                    <button className="h-7 w-7 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-white/10 flex items-center justify-center transition-colors">
                      <Search className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-slate-600 text-sm">
                <div className="text-center">
                  <Settings2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>{TABS.find(t => t.id === activeTab)?.label} 탭 (실습용 준비 중)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SmartFactoryWrapper>
  );
}
