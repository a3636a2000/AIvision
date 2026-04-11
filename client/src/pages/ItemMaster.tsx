import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import {
  Package, Search, Download, Plus, Trash2, Save,
  CheckCircle, XCircle, FileSpreadsheet, Layers,
  Info, Ruler, Warehouse, Factory as FactoryIcon,
  Settings2, Users, Truck, FileUp, FileDown, Printer, AlertTriangle, PackageSearch, Box, Play
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

  const handlePrint = () => {
    window.print();
  };

  const handleExcelInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx, .xls";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          
          if (data.length > 0) {
             let successCount = 0;
             for(let i=0; i<data.length; i++){
                 const row: any = data[i];
                 const newItem = {
                     ...EMPTY_ITEM,
                     useYn: row["사용"] === "Y" ? true : false,
                     bomYn: row["BOM"] === "Y" ? true : false,
                     itemType: row["품목구분"] || "제품",
                     acctCode: row["계정코드"] || "",
                     acctName: row["계정명"] || "",
                     itemCd: row["품목코드"] || `TEMP_${Date.now()}_${i}`,
                     itemName: row["품목명"] || `임시품목_${i}`,
                     std: row["규격"] || "",
                     drawNo: row["도번"] || "",
                     engName: row["영문명"] || "",
                     itemGroup: row["품목그룹"] || "",
                     baseUnit: row["기준단위"] || "EA",
                     convUnit: row["환산단위"] || "",
                     baseRatio: Number(row["기준비율"]) || 1,
                     convRatio: Number(row["환산비율"]) || 1,
                     bomUnit: row["BOM단위"] || "",
                     bomBaseRatio: Number(row["BOM기준비율"]) || 1,
                     bomRatio: Number(row["BOM비율"]) || 1,
                     warehouseCd: row["기본창고"] || "",
                     warehouseName: row["창고명"] || "",
                     procCd: row["공정코드"] || "",
                     procName: row["공정명"] || "",
                     equipCd: row["설비코드"] || "",
                     equipName: row["설비명"] || "",
                     prodLt: Number(row["생산L/T"]) || 0,
                     category: row["구분"] || "",
                     prodPlan: row["생산예정"] || "",
                     inOutType: row["사내/외"] || "사내",
                     supplyType: row["사급종류"] || "",
                     outsourceCd: row["외주처"] || "",
                     vendorName: row["거래처명"] || "",
                     properStock: Number(row["적정재고"]) || 0,
                     safetyStock: Number(row["안전재고"]) || 0,
                     initCarryQty: Number(row["초기이월수량"]) || 0,
                     initCarryAmt: Number(row["초기이월금액"]) || 0,
                     stdCost: Number(row["표준원가"]) || 0,
                 };
                 
                 const res = await fetch("/api/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newItem) });
                 if(res.ok) successCount++;
             }
             qc.invalidateQueries({ queryKey: ["/api/items"] });
             toast({ title: "엑셀 입력 성공", description: `${successCount}건의 데이터가 추가되었습니다.` });
          } else {
             toast({ variant: "destructive", title: "엑셀 입력 실패", description: "데이터가 없습니다." });
          }
        } catch (error) {
          toast({ variant: "destructive", title: "엑셀 입력 실패", description: "파일을 읽는 중 오류가 발생했습니다." });
        }
      };
      reader.readAsBinaryString(file);
    };
    input.click();
  };

  const handleExcelExport = () => {
    if (filtered.length === 0) {
      toast({ variant: "destructive", title: "엑셀 다운로드 실패", description: "다운로드할 데이터가 없습니다." });
      return;
    }
    const wsData = filtered.map((item, index) => ({
      "순번": index + 1,
      "사용": item.useYn ? "Y" : "N",
      "BOM": item.bomYn ? "Y" : "N",
      "품목구분": item.itemType,
      "계정코드": item.acctCode,
      "계정명": item.acctName,
      "품목코드": item.itemCd,
      "품목명": item.itemName,
      "규격": item.std,
      "도번": item.drawNo,
      "영문명": item.engName,
      "품목그룹": item.itemGroup,
      "기준단위": item.baseUnit,
      "환산단위": item.convUnit,
      "기준비율": item.baseRatio,
      "환산비율": item.convRatio,
      "BOM단위": item.bomUnit,
      "BOM기준비율": item.bomBaseRatio,
      "BOM비율": item.bomRatio,
      "기본창고": item.warehouseCd,
      "창고명": item.warehouseName,
      "공정코드": item.procCd,
      "공정명": item.procName,
      "설비코드": item.equipCd,
      "설비명": item.equipName,
      "생산L/T": item.prodLt,
      "구분": item.category,
      "생산예정": item.prodPlan,
      "사내/외": item.inOutType,
      "사급종류": item.supplyType,
      "외주처": item.outsourceCd,
      "거래처명": item.vendorName,
      "적정재고": item.properStock,
      "안전재고": item.safetyStock,
      "초기이월수량": item.initCarryQty,
      "초기이월금액": item.initCarryAmt,
      "표준원가": item.stdCost,
      "작업일": item.workDate,
      "작업ID": item.workId,
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    
    // Add auto-filter
    ws['!autofilter'] = { ref: `A1:AM${filtered.length + 1}` };
    
    XLSX.utils.book_append_sheet(wb, ws, "품목목록");
    XLSX.writeFile(wb, `품목마스터_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.xlsx`);
    toast({ title: "엑셀 다운로드", description: "엑셀 파일 다운로드가 완료되었습니다." });
  };

  const F = (field: keyof Omit<Item, "id">, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const inputCls = "h-9 px-3 text-sm bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors";
  const selectCls = `${inputCls} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-[right_8px_center] bg-no-repeat pr-6`;
  const labelCls = "text-xs text-slate-600 mb-1 block font-medium";
  const reqLabel = "text-xs text-rose-500 mb-1 block font-medium";

  const renderCell = (item: Item, col: typeof TABLE_COLS[0]) => {
    const v = item[col.key];
    if (col.key === "useYn") return v ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mx-auto print:text-black" /> : <XCircle className="w-3.5 h-3.5 text-slate-400 mx-auto print:text-black" />;
    if (col.key === "bomYn") return v ? <CheckCircle className="w-3.5 h-3.5 text-blue-500 mx-auto print:text-black" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block print:border-black print:border-solid" />;
    if (col.key === "itemCd") return <span className="text-blue-600 font-semibold print:text-black">{v as string}</span>;
    if (col.key === "itemName") return <span className="text-slate-800 print:text-black">{v as string}</span>;
    if (typeof v === "number") return <span className="text-slate-600 print:text-black">{v.toLocaleString()}</span>;
    return <span className="text-slate-600 print:text-black">{(v as string) || "-"}</span>;
  };

  return (
    <SmartFactoryWrapper>
      <Toaster />
        <style>{`
        @keyframes slide-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .card-animate { animation: slide-in .4s ease-out both; }
        @media print {
          @page { size: landscape; margin: 5mm; }
          body * { visibility: hidden; }
          .min-h-full, .min-h-full * { visibility: visible; }
          .min-h-full { position: absolute; left: 0; top: 0; width: 100%; height: auto; background: white !important; padding: 0 !important; margin: 0 !important; }
          button, .print\\:hidden, .overflow-x-auto, select, input { display: none !important; }
          .print-value { display: block !important; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000 !important; color: #000 !important; white-space: normal; padding: 2px !important; font-size: 8px !important; }
          th { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-weight: bold !important; text-align: center !important; font-size: 9px !important; }
          * { color: #000 !important; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
          label { display: block; margin-bottom: 2px; font-weight: bold; }
        }
      `}</style>
      
      <div className="flex flex-col absolute inset-0 bg-[#f8f9fc] p-2">

      {/* ─── 상단 검색 필터 바 ─── */}
      <div className="relative bg-white border border-indigo-100 rounded-xl px-4 py-3 mb-2 flex flex-wrap items-center gap-3 shrink-0 print:hidden z-10 shadow-sm">
        <div className="flex items-center gap-3 mr-4 print:hidden">
          <Package className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-indigo-900 font-bold text-lg tracking-tight">품목등록</h2>
            <p className="text-slate-500 text-[11px] mt-0.5">전체 자재 및 생산 제품 마스터 데이터 관리</p>
          </div>
        </div>
        <div className="flex items-center gap-2 print:hidden ml-auto">
          <label className="text-[10px] text-slate-500 font-medium">품목구분</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className={`${selectCls} w-20`}>
            {ITEM_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 print:hidden ml-1">
          <label className="text-[10px] text-slate-500 font-medium">품목명</label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
            <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="품목코드/품목명" className={`${inputCls} pl-6 w-36`} />
          </div>
        </div>
        <div className="flex items-center gap-2 print:hidden ml-1">
          <label className="text-[10px] text-slate-500 font-medium">규격</label>
          <input value={searchStd} onChange={e => setSearchStd(e.target.value)} placeholder="규격" className={`${inputCls} w-24`} />
        </div>
        <button onClick={handleExcelExport} className="h-8 px-3 text-xs rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-colors print:hidden ml-1 font-medium">
          <FileSpreadsheet className="w-3.5 h-3.5" /> 엑셀다운로드
        </button>
        <label className="flex items-center gap-1.5 text-[10px] text-slate-500 cursor-pointer print:hidden ml-1 font-medium">
          <input type="checkbox" checked={includeUnused} onChange={e => setIncludeUnused(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 text-blue-500 focus:ring-blue-500 focus:ring-1" />
          미사용포함
        </label>
      </div>

      <div className="flex flex-1 overflow-hidden gap-2 z-10">
          {/* 품목 목록 테이블 */}
          <div className="w-[350px] relative bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col shrink-0 card-animate" style={{ animationDelay: ".08s" }}>
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-bold text-indigo-900">품목 목록</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium border border-blue-200">{isLoading ? "로딩중..." : `${filtered.length}건`}</span>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-[11px] whitespace-nowrap">
                <thead className="sticky top-0 bg-white border-b border-slate-200">
                  <tr>
                    <th className="font-medium py-2.5 px-2 text-center w-10 text-slate-500">순번</th>
                    <th className="font-medium py-2.5 px-2 text-left text-slate-500">품목코드</th>
                    <th className="font-medium py-2.5 px-2 text-left text-slate-500">품목명</th>
                    <th className="font-medium py-2.5 px-2 text-center text-slate-500 w-10">사용</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr key={item.id}
                      className={`border-b border-slate-100 cursor-pointer transition-colors ${selectedId === item.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                      onClick={() => selectItem(item)}>
                      <td className="py-2 px-2 text-center text-slate-500">
                        {selectedId === item.id ? <Play className="w-2.5 h-2.5 text-blue-600 inline" fill="currentColor" /> : idx + 1}
                      </td>
                      <td className="py-2 px-2 font-mono text-blue-600">{item.itemCd}</td>
                      <td className="py-2 px-2 text-slate-800 truncate max-w-[150px]">{item.itemName}</td>
                      <td className="py-2 px-2 text-center">
                        {item.useYn ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <XCircle className="w-3.5 h-3.5 text-slate-300 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                  {!isLoading && filtered.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-10 text-slate-400">
                      검색 결과가 없습니다.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 하단 상세 폼 */}
          <div className="flex-1 relative bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col card-animate" style={{ animationDelay: ".16s" }}>
            <div className="px-4 pt-1.5 border-b border-slate-200 flex gap-0.5 shrink-0 bg-slate-50">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id ? "border-indigo-500 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

          <div className="p-4 flex-1 overflow-auto print:p-0 print:overflow-visible bg-white">
            {!selectedId && !isNew && !window.matchMedia("print").matches ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm print:hidden">
                <div className="text-center">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>상단 목록에서 품목을 선택하거나 신규 버튼을 눌러주세요</p>
                </div>
              </div>
            ) : activeTab === "basic" || window.matchMedia("print").matches ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2 print:grid-cols-4 print:gap-4 print:mt-4 print:pt-4 print:border-t print:border-black">
                <div><label className={`${reqLabel} print:font-bold print:mb-1 print:text-sm print:text-black`}>품목코드 *</label><input className={`${inputCls} w-full print:hidden`} value={form.itemCd} onChange={e => F("itemCd", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.itemCd}</div></div>
                <div><label className={`${reqLabel} print:font-bold print:mb-1 print:text-sm print:text-black`}>품목명 *</label><input className={`${inputCls} w-full print:hidden`} value={form.itemName} onChange={e => F("itemName", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.itemName}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>영문명</label><input className={`${inputCls} w-full print:hidden`} value={form.engName} onChange={e => F("engName", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.engName}</div></div>
                <div><label className={`${reqLabel} print:font-bold print:mb-1 print:text-sm print:text-black`}>품목구분 *</label>
                  <select className={`${selectCls} w-full print:hidden`} value={form.itemType} onChange={e => F("itemType", e.target.value)}>
                    {["제품","반제품","원자재","부자재"].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <div className="hidden print-value print:text-xs print:mt-1">{form.itemType}</div>
                </div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>품목그룹</label><input className={`${inputCls} w-full print:hidden`} value={form.itemGroup} onChange={e => F("itemGroup", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.itemGroup}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>규격</label><input className={`${inputCls} w-full print:hidden`} value={form.std} onChange={e => F("std", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.std}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>도면번호</label><input className={`${inputCls} w-full print:hidden`} value={form.drawNo} onChange={e => F("drawNo", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.drawNo}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>계정코드</label><input className={`${inputCls} w-full print:hidden`} value={form.acctCode} onChange={e => F("acctCode", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.acctCode}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>계정명</label><input className={`${inputCls} w-full print:hidden`} value={form.acctName} onChange={e => F("acctName", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.acctName}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>사용여부</label>
                  <select className={`${selectCls} w-full print:hidden`} value={form.useYn ? "Y" : "N"} onChange={e => F("useYn", e.target.value === "Y")}>
                    <option value="Y">사용</option><option value="N">미사용</option>
                  </select>
                  <div className="hidden print-value print:text-xs print:mt-1">{form.useYn ? "사용" : "미사용"}</div>
                </div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>BOM</label>
                  <select className={`${selectCls} w-full print:hidden`} value={form.bomYn ? "Y" : "N"} onChange={e => F("bomYn", e.target.value === "Y")}>
                    <option value="N">N</option><option value="Y">Y</option>
                  </select>
                  <div className="hidden print-value print:text-xs print:mt-1">{form.bomYn ? "Y" : "N"}</div>
                </div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>구분</label><input className={`${inputCls} w-full print:hidden`} value={form.category} onChange={e => F("category", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.category}</div></div>
              </div>
            ) : null}
            {(activeTab === "unit" || window.matchMedia("print").matches) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2 print:grid-cols-4 print:gap-4 print:mt-4 print:pt-4 print:border-t print:border-black">
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>기준단위</label><input className={`${inputCls} w-full print:hidden`} value={form.baseUnit} onChange={e => F("baseUnit", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.baseUnit}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>환산단위</label><input className={`${inputCls} w-full print:hidden`} value={form.convUnit} onChange={e => F("convUnit", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.convUnit}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>기준비율</label><input type="number" className={`${inputCls} w-full print:hidden`} value={form.baseRatio} onChange={e => F("baseRatio", Number(e.target.value))} /><div className="hidden print-value print:text-xs print:mt-1">{form.baseRatio}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>환산비율</label><input type="number" className={`${inputCls} w-full print:hidden`} value={form.convRatio} onChange={e => F("convRatio", Number(e.target.value))} /><div className="hidden print-value print:text-xs print:mt-1">{form.convRatio}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>BOM단위</label><input className={`${inputCls} w-full print:hidden`} value={form.bomUnit} onChange={e => F("bomUnit", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.bomUnit}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>BOM 기준비율</label><input type="number" className={`${inputCls} w-full print:hidden`} value={form.bomBaseRatio} onChange={e => F("bomBaseRatio", Number(e.target.value))} /><div className="hidden print-value print:text-xs print:mt-1">{form.bomBaseRatio}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>BOM비율</label><input type="number" className={`${inputCls} w-full print:hidden`} value={form.bomRatio} onChange={e => F("bomRatio", Number(e.target.value))} /><div className="hidden print-value print:text-xs print:mt-1">{form.bomRatio}</div></div>
              </div>
            )}
            
            {(activeTab === "stock" || window.matchMedia("print").matches) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2 print:grid-cols-4 print:gap-4 print:mt-4 print:pt-4 print:border-t print:border-black">
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>기본창고코드</label><input className={`${inputCls} w-full print:hidden`} value={form.warehouseCd} onChange={e => F("warehouseCd", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.warehouseCd}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>창고명</label><input className={`${inputCls} w-full print:hidden`} value={form.warehouseName} onChange={e => F("warehouseName", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.warehouseName}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>적정재고</label><input type="number" className={`${inputCls} w-full print:hidden`} value={form.properStock} onChange={e => F("properStock", Number(e.target.value))} /><div className="hidden print-value print:text-xs print:mt-1">{form.properStock}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>안전재고</label><input type="number" className={`${inputCls} w-full print:hidden`} value={form.safetyStock} onChange={e => F("safetyStock", Number(e.target.value))} /><div className="hidden print-value print:text-xs print:mt-1">{form.safetyStock}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>초기이월수량</label><input type="number" className={`${inputCls} w-full print:hidden`} value={form.initCarryQty} onChange={e => F("initCarryQty", Number(e.target.value))} /><div className="hidden print-value print:text-xs print:mt-1">{form.initCarryQty}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>초기이월금액</label><input type="number" className={`${inputCls} w-full print:hidden`} value={form.initCarryAmt} onChange={e => F("initCarryAmt", Number(e.target.value))} /><div className="hidden print-value print:text-xs print:mt-1">{form.initCarryAmt}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>표준원가</label><input type="number" className={`${inputCls} w-full print:hidden`} value={form.stdCost} onChange={e => F("stdCost", Number(e.target.value))} /><div className="hidden print-value print:text-xs print:mt-1">{form.stdCost}</div></div>
              </div>
            )}
            
            {(activeTab === "prod" || window.matchMedia("print").matches) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2 print:grid-cols-4 print:gap-4 print:mt-4 print:pt-4 print:border-t print:border-black">
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>공정코드</label><input className={`${inputCls} w-full print:hidden`} value={form.procCd} onChange={e => F("procCd", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.procCd}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>공정명</label><input className={`${inputCls} w-full print:hidden`} value={form.procName} onChange={e => F("procName", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.procName}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>설비코드</label><input className={`${inputCls} w-full print:hidden`} value={form.equipCd} onChange={e => F("equipCd", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.equipCd}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>설비명</label><input className={`${inputCls} w-full print:hidden`} value={form.equipName} onChange={e => F("equipName", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.equipName}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>생산L/T (일)</label><input type="number" className={`${inputCls} w-full print:hidden`} value={form.prodLt} onChange={e => F("prodLt", Number(e.target.value))} /><div className="hidden print-value print:text-xs print:mt-1">{form.prodLt}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>생산예정</label><input className={`${inputCls} w-full print:hidden`} value={form.prodPlan} onChange={e => F("prodPlan", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.prodPlan}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>사내/외</label>
                  <select className={`${selectCls} w-full print:hidden`} value={form.inOutType} onChange={e => F("inOutType", e.target.value)}>
                    <option value="사내">사내</option><option value="사외">사외</option>
                  </select>
                  <div className="hidden print-value print:text-xs print:mt-1">{form.inOutType}</div>
                </div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>사급종류</label><input className={`${inputCls} w-full print:hidden`} value={form.supplyType} onChange={e => F("supplyType", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.supplyType}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>외주처</label><input className={`${inputCls} w-full print:hidden`} value={form.outsourceCd} onChange={e => F("outsourceCd", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.outsourceCd}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>거래처명</label><input className={`${inputCls} w-full print:hidden`} value={form.vendorName} onChange={e => F("vendorName", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.vendorName}</div></div>
              </div>
            )}
            
            {(activeTab === "etc" || window.matchMedia("print").matches) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2 print:grid-cols-4 print:gap-4 print:mt-4 print:pt-4 print:border-t print:border-black">
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>작업일</label><input type="date" className={`${inputCls} w-full print:hidden`} value={form.workDate} onChange={e => F("workDate", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.workDate}</div></div>
                <div><label className={`${labelCls} print:font-bold print:mb-1 print:text-sm print:text-black`}>작업ID</label><input className={`${inputCls} w-full print:hidden`} value={form.workId} onChange={e => F("workId", e.target.value)} /><div className="hidden print-value print:text-xs print:mt-1">{form.workId}</div></div>
              </div>
            )}
            {!["basic", "unit", "stock", "prod", "etc"].includes(activeTab) && !window.matchMedia("print").matches && (
              <div className="flex items-center justify-center h-24 text-slate-400 text-sm print:hidden">
                <div className="text-center">
                  <Settings2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>{TABS.find(t => t.id === activeTab)?.label} — 준비 중</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </SmartFactoryWrapper>
  );
}
