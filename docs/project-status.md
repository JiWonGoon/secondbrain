# SecondBrain - 프로젝트 진행 상태

**마지막 업데이트**: 2026-08-19  
**현재 세션**: Session 2  
**전체 진행도**: 40% (Phase 1-4 + UI/UX 개선 완료)

---

## 📊 현재 Phase

### 🟢 Phase 1: 프로젝트 초기 설정 - **✅ 완료**
- 완료: 2026-08-19
- 커밋: `7c6c95c`

### 🟢 Phase 2: Authentication - **✅ 완료**
- 완료: 2026-08-19
- 커밋: `aaa5375`
- 구현: 로그인/회원가입, Protected Routes, 세션 관리

### 🟢 Phase 3: Database & RLS - **✅ 완료**
- 완료: 2026-08-19
- 커밋: `c57dbd3`
- 구현: nodes/relations 테이블, RLS, 9개 Index, CRUD 액션

### 🟢 Phase 4: Inbox / Quick Capture - **✅ 완료**
- 완료: 2026-08-19
- 커밋: `e553c76`
- 구현: Quick Capture, Node 카드, Inbox 페이지, 상태 관리

### 🟢 UI/UX 개선 - **✅ 완료**
- 완료: 2026-08-19
- 커밋: `00aa027`, `0f5519c`
- 구현: 날짜/시간 표시, 다크모드/라이트모드 토글

### 🟡 Phase 5: Node CRUD - **⏳ 진행 예정**
- 상태: 준비 중
- 다음: Node Detail 페이지부터 시작

---

## ✅ 완료된 결정 사항

### 데이터 모델 (확정)
- **Node 타입**: 8가지 (task, note, book, place, study, project, idea, person)
- **Relation 타입**: 6가지 (related_to, requires, inspired_by, part_of, derived_from, recommended)
- **상태**: CaptureStatus (inbox, processed), NodeStatus (타입별)
- **우선순위**: low, medium, high, urgent

### 기술 스택 확정
- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript (strict 모드)
- **스타일링**: Tailwind CSS 3.4 + 다크모드 (light/dark/system)
- **폼 처리**: React Hook Form + Zod
- **상태 관리**: Zustand (localStorage 저장)
- **백엔드**: Next.js Server Actions
- **데이터베이스**: PostgreSQL via Supabase
- **인증**: Supabase Auth (email/password)
- **아이콘**: lucide-react
- **배포**: Vercel

### 프로젝트 구조 확정
```
app/
  ├── (auth)/              # 인증 관련 (미구현)
  ├── dashboard/           # 대시보드 (미구현)
  └── (기타)

components/
  ├── ui/                  # shadcn/ui 컴포넌트
  ├── layout/
  ├── nodes/
  ├── inbox/
  ├── search/
  └── dashboard/

lib/
  ├── supabase/           # 설정됨
  ├── actions/            # 미구현
  └── utils/

types/
  └── index.ts            # 설정됨
```

### 아키텍처 패턴 (확정)
- **Server Actions**: lib/actions/에서 인증, Node CRUD, Relation CRUD 처리
- **Zustand 스토어**: 글로벌 상태 (nodes, theme)
- **클라이언트 컴포넌트**: React 훅 및 상태 관리
- **ThemeProvider**: 클라이언트 프로바이더 패턴

### 보안 (확정)
- **RLS 정책**: user_id 기반 데이터 격리
- **Protected Routes**: Middleware로 미인증 사용자 차단
- **Service Role Key**: 서버에서만 사용

### 성능 (확정)
- **Database Index**: 9개 (user_id, type, status, capture_status, created_at, updated_at, due_date, user_type, user_from_node, user_to_node)
- **기본 검색**: PostgreSQL ILIKE
- **Pagination**: 미래 구현 예정

---

## ❓ 결정되지 않은 사항

### Phase 5 관련 (Node Detail UI)

#### 1. Node Detail 페이지 레이아웃
- **옵션**:
  - A) 풀 페이지 상세 보기
  - B) 모달 팝업
  - C) 사이드 패널
- **결정 필요**: 구현 시 결정

#### 2. 관련 항목 표시 방식
- **옵션**:
  - A) 카드 그리드
  - B) 리스트 형식
  - C) 그래프 시각화
- **현재 계획**: A 또는 B (그래프는 나중에)
- **결정 필요**: Phase 5 시작 시

#### 3. Relation 추가/삭제 UI
- **옵션**:
  - A) 모달 창
  - B) 인라인 입력
  - C) 드래그 & 드롭
- **현재 계획**: A (모달)
- **결정 필요**: Phase 5에서 결정

### Phase 6-9 관련

#### 검색/필터 위치
- 헤더 vs 사이드바

#### Dashboard 콘텐츠
- "오늘 할 일" 계산 방식
- "최근 항목" 개수

---

## 🔄 남은 작업

### Phase 5 - Node CRUD (우선순위: 높음)
- [ ] Node Detail 페이지 (`/nodes/[id]/page.tsx`)
- [ ] Node Edit 기능
- [ ] Node Delete 기능 (확인 모달)
- [ ] Relation 추가 UI
- [ ] Relation 삭제 UI

### Phase 6 - Search & Filter (우선순위: 중간)
- [ ] 검색 기능 (PostgreSQL ILIKE)
- [ ] Type 필터
- [ ] Status 필터
- [ ] Tag 필터
- [ ] Priority 필터
- [ ] Due Date 필터

### Phase 7 - Explore (우선순위: 중간)
- [ ] 전체 항목 탐색 페이지
- [ ] 타입별 필터
- [ ] 통계/집계

### Phase 8 - Dashboard (우선순위: 중간)
- [ ] 오늘 할 일
- [ ] 예정된 할 일
- [ ] 최근 추가한 항목
- [ ] 최근 수정한 항목
- [ ] 진행 중인 프로젝트

### Phase 9 - AI Integration (우선순위: 낮음)
- [ ] 자동 분류
- [ ] 제목 제안
- [ ] Summary 생성
- [ ] Tag 추천
- [ ] 관련 항목 후보

### Phase 10 이후 (Future)
- [ ] Graph View
- [ ] Semantic Search + pgvector
- [ ] 복잡한 AI 자동화
- [ ] 외부 서비스 연동
- [ ] 모바일 네이티브 앱

---

## 🚀 다음 세션에서 시작할 작업

### Phase 5 - Node CRUD (즉시 시작 가능)

#### 1. Node Detail 페이지
```
파일: /app/nodes/[id]/page.tsx
구현:
- getNode 액션으로 데이터 로드
- NodeCard와 유사한 스타일
- 상세 정보 표시
- 관련 항목 표시 (getRelations)
- 수정/삭제 버튼
```

#### 2. Node Edit 기능
```
파일: /app/nodes/[id]/edit/page.tsx (또는 모달)
구현:
- updateNode 액션 연결
- 제목, 내용, 태그, 상태 수정
- 성공/에러 메시지
```

#### 3. Node Delete 기능
```
구현:
- 삭제 확인 모달
- deleteNode 액션 연결
- 삭제 후 Inbox로 리다이렉트
```

#### 4. Relation UI
```
구현:
- 관련 항목 추가 모달
- createRelation 액션 연결
- Relation 삭제 버튼
- deleteRelation 액션 연결
```

### 체크리스트
- [ ] Node Detail 페이지 구현
- [ ] Node Edit 기능 구현
- [ ] Node Delete 기능 구현
- [ ] Relation UI 구현
- [ ] 전체 CRUD 흐름 테스트
- [ ] 다크모드에서 UI 확인
- [ ] 모바일 UX 확인

---

## 📝 주요 노트

### 개발 환경
- **개발 서버**: `npm run dev` (Port 3004-3006, 3000 점유 시 대체 포트 사용)
- **빌드**: `npm run build` (성공 확인됨)
- **타입 검사**: `npm run typecheck` (오류 없음)
- **린팅**: `npm run lint` (오류 없음)

### 테마 토글 (최신 구현)
- **저장소**: Zustand + localStorage
- **테마**: light, dark, system 3가지
- **구현**: ThemeProvider로 클라이언트 감싸기
- **스타일**: Tailwind dark: 클래스 및 data-theme 속성

### 알려진 이슈
- **포트 점유**: 포트 3000 자주 점유, 3004-3006 사용 중
- **해결**: Windows 작업 관리자에서 node 프로세스 종료 후 `npm run dev` 재시작
- **Node 타입**: 현재 모든 항목이 "note" 타입으로 생성 (Quick Capture 때문, Phase 5에서 개선)
- **Supabase RLS**: 모든 쿼리가 user_id로 필터링됨 (보안 ✅)

### CLAUDE.md 준수 사항
- ✅ MVP 범위 내 기능만 구현
- ✅ 가장 작은 변경으로 요구사항 만족
- ✅ 기존 코드 최대 재사용
- ✅ 모바일 UX 함께 고려
- ✅ 각 단계 완료 후 다음 진행
- ✅ 타입 체크, 린트 통과

---

## 📌 중요 파일 경로

| 파일 | 경로 | 용도 |
|------|------|------|
| 환경변수 | `.env.local` | Supabase 설정 |
| 타입 정의 | `types/node.ts`, `types/auth.ts` | Node/Relation/Auth 타입 |
| 인증 액션 | `lib/actions/auth.ts` | signUp, signIn, signOut |
| Node CRUD | `lib/actions/node.ts` | createNode, listNodes, updateNode, deleteNode |
| Relation CRUD | `lib/actions/relation.ts` | createRelation, getRelations, deleteRelation |
| 상태 관리 | `lib/stores/nodeStore.ts`, `lib/stores/themeStore.ts` | 글로벌 상태 |
| Supabase | `lib/supabase/` | 클라이언트, 서버, 미들웨어 |
| 컴포넌트 | `components/` | QuickCapture, NodeCard, ThemeToggle, ThemeProvider |
| 페이지 | `app/` | 인증, 대시보드, Inbox 페이지 |
| DB Migration | `supabase/migrations/20260819_create_nodes_and_relations.sql` | DB 스키마 |

---

## 🎯 최종 상태

| 항목 | 상태 |
|------|------|
| **Phase 1** | ✅ 완료 |
| **Phase 2** | ✅ 완료 |
| **Phase 3** | ✅ 완료 |
| **Phase 4** | ✅ 완료 |
| **UI/UX 개선** | ✅ 완료 |
| **Phase 5** | ⏳ 준비 중 |
| **전체 진행도** | 🟢 **40% (Phase 1-4 + UI/UX 완료)** |

---

## 📈 GitHub 커밋 히스토리

```
0f5519c - 테마 토글 기능 수정
00aa027 - UI/UX 개선사항 적용 (날짜/시간, 다크모드)
e553c76 - Phase 4 - Inbox / Quick Capture 완료
c57dbd3 - Phase 3 - Database & RLS 완료
aaa5375 - Phase 2 - Authentication 완료
7c6c95c - Phase 1 - 프로젝트 초기 설정 완료
```

---

**다음 세션에서 Phase 5 - Node CRUD를 시작할 준비가 완료되었습니다!** 🚀
