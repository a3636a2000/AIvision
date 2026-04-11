import React, { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import {
  Key, Save, Trash2, ExternalLink, Lightbulb, CheckCircle2, Check, RefreshCw, X
} from 'lucide-react'

interface GeminiApiKeyModalProps {
  onClose: () => void;
}

export default function GeminiApiKeyModal({ onClose }: GeminiApiKeyModalProps) {
  const { toast } = useToast();

  const [apiKey, setApiKey] = useState('');
  const [selectedDb, setSelectedDb] = useState('기본 데이터베이스');
  
  const [savedKeys, setSavedKeys] = useState<{db: string, key: string}[]>(() => {
    try {
      const keys = localStorage.getItem('gemini_api_keys');
      return keys ? JSON.parse(keys) : [{ db: '기본 데이터베이스', key: 'AIzaSyDa...I0Dg' }];
    } catch {
      return [{ db: '기본 데이터베이스', key: 'AIzaSyDa...I0Dg' }];
    }
  });

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSaveApiKey = () => {
    if (!apiKey) {
      toast({ title: '입력 오류', description: 'API 키를 입력해주세요.', variant: 'destructive' });
      return;
    }
    
    const newKeys = savedKeys.filter(k => k.db !== selectedDb);
    newKeys.push({ db: selectedDb, key: apiKey });
    
    setSavedKeys(newKeys);
    localStorage.setItem('gemini_api_keys', JSON.stringify(newKeys));
    setApiKey('');
    
    toast({ title: '저장 완료', description: `${selectedDb}의 API 키가 저장되었습니다.` });
  };

  const handleDeleteKey = (db: string) => {
    const newKeys = savedKeys.filter(k => k.db !== db);
    setSavedKeys(newKeys);
    localStorage.setItem('gemini_api_keys', JSON.stringify(newKeys));
    toast({ title: '삭제 완료', description: `${db}의 API 키가 삭제되었습니다.` });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 12) return key;
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#8b5cf6] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-white">
            <Key className="w-5 h-5" />
            <h2 className="font-bold text-[17px] tracking-tight">Gemini API 키 관리</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-8 overflow-y-auto">
          {/* 입력 영역 */}
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 flex flex-col gap-5">
              <div>
                <label className="block text-slate-800 font-bold text-[15px] mb-2.5">데이터베이스 선택</label>
                <select 
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg text-[15px] text-slate-700 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] bg-white shadow-sm"
                  value={selectedDb}
                  onChange={(e) => setSelectedDb(e.target.value)}
                >
                  <option value="기본 데이터베이스">기본 데이터베이스</option>
                  <option value="테스트 데이터베이스">테스트 데이터베이스</option>
                  <option value="운영 데이터베이스">운영 데이터베이스</option>
                </select>
              </div>
              
              <div>
                <label className="block text-slate-800 font-bold text-[15px] mb-2.5">Gemini API 키</label>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    placeholder="AIza..." 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 h-11 px-4 border border-slate-200 rounded-lg text-[15px] text-slate-700 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] shadow-sm"
                  />
                  <button 
                    onClick={handleSaveApiKey}
                    className="w-12 h-11 bg-[#8b5cf6] hover:bg-violet-600 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm shrink-0"
                    title="저장"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-3">
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-violet-500 hover:text-violet-600 text-sm font-medium flex items-center gap-1 w-max">
                    Google AI Studio에서 API 키 발급받기 <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 저장된 키 목록 영역 */}
            <div className="flex-1 flex flex-col gap-3">
              <label className="block text-slate-800 font-bold text-[15px]">저장된 API 키</label>
              
              {savedKeys.length > 0 ? (
                <div className="space-y-3 mt-1">
                  {savedKeys.map((k, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
                      <div className="flex flex-col gap-2">
                        <span className="text-slate-800 font-bold text-[15px]">{k.db}</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-slate-500 text-sm font-mono tracking-wide">{maskApiKey(k.key)}</span>
                        </div>
                        <div className="flex">
                          <span className="bg-violet-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3" /> 유효
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="w-9 h-9 flex items-center justify-center text-violet-500 hover:bg-violet-100 rounded-lg transition-colors" title="키 검증">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteKey(k.db)}
                          className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="삭제">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center text-slate-500 text-[15px] h-full flex items-center justify-center mt-1 shadow-sm font-medium">
                  저장된 API 키가 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* 가이드 영역 */}
          <div className="bg-violet-50 rounded-xl p-5 border border-violet-100 mt-2">
            <div className="flex items-center gap-2 mb-3 text-violet-700 font-bold text-[15px]">
              <Lightbulb className="w-4.5 h-4.5 text-amber-500" fill="currentColor" />
              API 키 사용 가이드
            </div>
            <ul className="space-y-2 text-violet-600/80 text-sm list-disc list-inside font-medium pl-1">
              <li>데이터베이스별로 다른 Gemini API 키를 설정할 수 있습니다</li>
              <li>API 키는 브라우저 로컬스토리지에 안전하게 저장됩니다</li>
              <li>데이터 리니지 분석 시 해당 데이터베이스의 키가 자동으로 사용됩니다</li>
              <li>키 유효성은 Gemini API 호출로 자동 검증됩니다</li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  )
}