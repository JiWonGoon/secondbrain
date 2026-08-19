export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            SecondBrain
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            생각나는 것을 빠르게 저장하고,
            <br />
            시스템이 정리하고 연결해주는 개인용 Life OS
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-blue-400 text-2xl mb-2">📝</div>
              <h3 className="font-semibold text-white mb-2">빠른 입력</h3>
              <p className="text-slate-300 text-sm">
                생각나는 것을 분류 없이 바로 저장하고 편집
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-purple-400 text-2xl mb-2">🔍</div>
              <h3 className="font-semibold text-white mb-2">검색 & 필터</h3>
              <p className="text-slate-300 text-sm">
                타입, 상태, 태그, 우선순위로 검색
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-green-400 text-2xl mb-2">🔗</div>
              <h3 className="font-semibold text-white mb-2">항목 연결</h3>
              <p className="text-slate-300 text-sm">
                관련된 항목끼리 관계를 만들고 추적
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/login"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
            >
              로그인
            </a>
            <a
              href="/auth/signup"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              회원가입
            </a>
          </div>

          <p className="text-slate-400 text-sm mt-8">
            당신의 모든 생각을 한곳에 저장하세요
          </p>
        </div>
      </div>
    </main>
  )
}
