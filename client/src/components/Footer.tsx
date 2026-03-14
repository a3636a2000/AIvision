import { Award } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 w-full shrink-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold text-sm sm:text-base">
              한국품질재단 AI 스마트팩토리 실습
            </span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} KFQ (Korea Foundation for Quality). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
