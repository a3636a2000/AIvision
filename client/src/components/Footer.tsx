import { Award, User, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white text-slate-800 border-t border-slate-200 py-6 w-full shrink-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-slate-800 font-bold text-sm sm:text-base">
              한국품질재단 AI 스마트팩토리 실습
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 font-medium text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              정현민
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-500" />
              010-9211-8484
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              a3636a200@gmail.com
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            &copy; {new Date().getFullYear()} KFQ (Korea Foundation for Quality). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
