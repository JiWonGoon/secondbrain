export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">SecondBrain</h1>
        <p className="text-lg text-muted-foreground mb-8">
          개인의 생각, 계획, 지식을 한곳에 저장하고 정리하는 Life OS
        </p>
        <div className="space-x-4">
          <a
            href="/auth/login"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            로그인
          </a>
          <a
            href="/auth/signup"
            className="inline-block px-6 py-2 border border-border rounded-md hover:bg-secondary"
          >
            회원가입
          </a>
        </div>
      </div>
    </main>
  )
}
