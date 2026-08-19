# Life OS / Second Brain

## 0. Claude Code 작업 원칙

이 파일은 이 프로젝트의 제품 요구사항, 아키텍처 원칙, 개발 규칙을 정의한다.

### 매우 중요

현재 프로젝트는 **MVP 개발 단계**다.

문서에서 `향후`, `Later`, `Phase 2 이후`, `Future` 등으로 표시된 기능은 사용자가 명시적으로 요청하지 않는 한 구현하지 않는다.

항상 다음 원칙을 따른다.

1. 현재 프로젝트 상태를 먼저 확인한다.
2. CLAUDE.md의 요구사항을 먼저 확인한다.
3. 가장 작은 변경으로 요구사항을 만족시키는 방법을 선택한다.
4. 기존 코드와 패턴을 최대한 재사용한다.
5. 필요 이상의 abstraction을 만들지 않는다.
6. 필요 이상의 dependency를 추가하지 않는다.
7. MVP 범위를 임의로 확장하지 않는다.
8. 사용자 데이터를 삭제하거나 임의로 변경하지 않는다.
9. DB schema 변경 시 migration을 고려한다.
10. 보안과 사용자 데이터 격리를 항상 우선한다.
11. 모바일 UX를 항상 함께 고려한다.
12. 구현 후 가능한 범위에서 lint, typecheck, test를 실행한다.
13. 각 단계의 작업이 완료가 되면 "작업이 완료 되었습니다."를 표시해주고 다음 단계로 넘어가지 않는다.

---

# 1. 프로젝트 개요

이 프로젝트는 개인의 삶과 생각을 한곳에 저장하고 정리하는 개인용 **Life OS / Second Brain** 웹 애플리케이션이다.

사용자는 다음과 같은 다양한 정보를 빠르게 입력할 수 있다.

- 해야 할 일 (Task)
- 기억해야 할 내용 (Note)
- 읽어야 할 책 (Book)
- 가봐야 할 곳 (Place)
- 공부해야 할 것 (Study)
- 진행 중인 프로젝트 (Project)
- 앞으로 해보고 싶은 것 (Idea)
- 사람 (Person)

이 앱의 핵심 철학은 다음과 같다.

> 사용자는 생각나는 것을 최대한 쉽게 입력하고,
> 시스템과 AI가 그것을 정리하고 서로 연결한다.

사용자가 처음부터 복잡한 폴더 구조나 카테고리를 고민할 필요가 없어야 한다.

단순한 Todo 앱이나 메모 앱을 만드는 것이 아니라,
개인의 생각, 계획, 지식, 관심사, 프로젝트, 행동을 서로 연결하는 개인용 운영체제를 만드는 것이 목표다.

---

# 2. 핵심 사용자 경험

사용자는 자연어로 무엇이든 입력할 수 있다.

예:

- "내년에 일본에서 한 달 정도 살아보고 싶다."
- "다음 달에 건강검진 예약해야 한다."
- "AI Agent 공부해야 한다."
- "이 책 읽어봐야겠다."
- "도쿄 가면 팀랩 가보기."
- "좋은 포트폴리오 사례 찾아보기."
- "언젠가 스페인 산티아고 순례길 가보고 싶다."

사용자는 입력할 때 정확한 카테고리를 지정하지 않아도 된다.

시스템은 먼저 내용을 저장하고,
필요한 경우 AI가 다음을 제안한다.

- 어떤 유형인지
- 제목
- 요약
- 태그
- 관련된 기존 항목
- 필요한 경우 할 일
- 프로젝트와의 관계

사용자가 승인하면 실제 데이터에 반영한다.

---

# 3. 제품의 핵심 가치

제품의 핵심은 다음 3가지다.

## 3.1 Capture

생각나는 것을 빠르게 저장한다.

사용자가 "정리해야지"라고 생각하지 않아도 된다.

그냥 입력한다.

## 3.2 Organize

저장된 정보를 유형, 상태, 태그 등으로 정리한다.

## 3.3 Connect

서로 관련된 정보를 연결한다.

예:

```text
AI Agent 공부
├── 관련 책
├── 관련 메모
├── 관련 공부
├── 관련 프로젝트
└── 관련 할 일
```

이 "연결"이 제품의 중요한 차별점이다.

---

# 4. 핵심 도메인 개념

이 앱에서는 모든 정보를 공통 개념인 **Node**로 관리한다.

```text
Node
├── Task
├── Note
├── Book
├── Place
├── Study
├── Project
├── Idea
└── Person
```

Node와 Node 사이의 연결은 **Relation**으로 관리한다.

```text
Node
│
├── related_to
├── requires
├── inspired_by
├── part_of
├── derived_from
└── recommended
```

이 구조를 기반으로 향후 Knowledge Graph, Graph View, Semantic Search, AI 관계 분석 등을 확장할 수 있어야 한다.

---

# 5. 핵심 설계 원칙

## 5.1 작은 MVP부터 만든다

처음부터 Notion, Evernote, Obsidian, Todoist 등의 모든 기능을 구현하지 않는다.

항상 다음 순서로 개발한다.

1. 가장 작은 기능을 정의한다.
2. 구현한다.
3. 실행한다.
4. 테스트한다.
5. 실제 사용성을 확인한다.
6. 문제가 있으면 수정한다.
7. 다음 기능으로 넘어간다.

한 번에 전체 제품을 구현하지 않는다.

---

## 5.2 Capture First

사용자가 입력할 때 다음을 결정할 필요가 없어야 한다.

- 카테고리
- 태그
- 상태
- 관계
- 우선순위

최소한 다음만으로 저장할 수 있어야 한다.

- 제목 또는 내용

---

## 5.3 Progressive Disclosure

처음부터 모든 옵션을 보여주지 않는다.

기본:

- title
- content

고급 옵션:

- type
- tag
- due date
- priority
- relation
- status

필요할 때만 펼쳐서 보여준다.

---

## 5.4 단순함을 우선한다

기능을 구현할 때 항상 다음 질문을 먼저 한다.

> 더 단순한 방법으로 해결할 수 있는가?

필요하지 않은 abstraction, 상태 관리, dependency, API layer 등을 추가하지 않는다.

---

# 6. MVP 범위

첫 번째 MVP에서는 다음 기능만 구현한다.

## 필수 기능

- 로그인
- Inbox / Quick Capture
- Node 생성
- Node 목록
- Node 상세
- Node 수정
- Node 삭제
- Node 타입 분류
- Tag
- Node 간 Relation
- 기본 텍스트 검색
- 기본 필터
- Dashboard
- 모바일 반응형 UI
- PWA 기본 설정

---

## MVP에서 구현하지 않는 것

다음 기능은 MVP가 안정화된 후 사용자가 명시적으로 요청했을 때 구현한다.

- Graph View
- Calendar
- Kanban
- Timeline
- 고급 AI Agent
- 자동 프로젝트 생성
- 자동 장기계획 수립
- 복잡한 자동화
- 외부 서비스 연동
- 모바일 네이티브 앱
- 복잡한 알림 시스템
- Semantic Search
- 자동 대규모 Relation 생성
- AI 기반 Daily / Weekly / Monthly Review

---

# 7. 기술 스택

## Frontend

- Next.js
- App Router
- TypeScript
- React
- Tailwind CSS

## Backend

- Next.js Server Components
- Server Actions 또는 API Routes
- Supabase

## Database

- PostgreSQL via Supabase
- pgvector 확장 고려

## Authentication

- Supabase Auth

## Deployment

- Vercel

## PWA

PWA는 현재 사용하는 Next.js 버전과 호환성이 가장 좋은 방식을 선택한다.

특정 PWA 라이브러리를 무조건 사용하지 않는다.

PWA에서 다음 요구사항을 고려한다.

- Web App Manifest
- Service Worker
- Installability
- App Icons
- Splash Screen
- 적절한 Cache Strategy
- Offline Fallback

---

# 8. 모바일 우선 / PWA

이 애플리케이션은 모바일에서 매우 편하게 사용할 수 있어야 한다.

Desktop First가 아니라 **Mobile First**로 UI를 설계한다.

특히 Inbox / Quick Capture는 모바일에서 가장 중요한 기능이다.

목표 UX:

```text
홈 화면에서 앱 실행
↓
입력창 선택
↓
생각 입력
↓
저장
```

가능하면 몇 초 안에 완료할 수 있어야 한다.

모바일에서 다음 기능이 편해야 한다.

- 입력
- 검색
- 항목 열기
- 수정
- 삭제
- 완료 처리
- 연결
- 뒤로 가기

UI 레이아웃:

- Desktop: Sidebar 중심
- Mobile: Bottom Navigation 중심

모바일 터치 타겟은 가능하면 최소 44~48px 수준을 확보한다.

---

## 8.1 향후 Web Share Target

향후 외부 링크나 텍스트를 모바일에서 바로 Inbox로 전달할 수 있도록 Web Share Target API 적용을 고려한다.

단, **MVP에서는 구현하지 않는다.**

---

# 9. 기본 화면

## 9.1 Dashboard

오늘과 앞으로 해야 할 일,
최근 저장한 정보,
진행 중인 프로젝트 등을 보여준다.

MVP Dashboard:

- 오늘 할 일
- 예정된 할 일
- 최근 추가한 항목
- 최근 수정한 항목
- 진행 중인 프로젝트

"최근 관심 분야"와 같은 AI 기반 분석 기능은 MVP 이후 구현한다.

Dashboard는 복잡하게 만들지 않는다.

---

# 10. Inbox / Quick Capture

Inbox는 이 앱에서 가장 중요한 기능이다.

사용자는 아무 생각이나 빠르게 입력할 수 있어야 한다.

예:

```text
도쿄 가면 팀랩 가보기
```

```text
클린 코드 읽기
```

```text
AI Agent 공부
```

```text
언젠가 스페인 산티아고 순례길 가보고 싶다
```

모두 빠르게 저장할 수 있어야 한다.

처음부터 분류하지 않아도 된다.

필요하면 나중에 AI가 분류를 제안한다.

---

# 11. Inbox와 Node의 관계

Inbox는 별도의 독립적인 데이터 모델이나 별도의 저장소로 만들지 않는다.

**Quick Capture는 Node를 생성하는 가장 빠른 입력 방식이다.**

기본 흐름:

```text
Quick Capture
     ↓
Node 생성
     ↓
Capture 상태 = inbox
     ↓
사용자가 정리
     ↓
Type / Tag / Relation / Status 추가
```

Node 생성 직후에도 사용자가 바로 확인할 수 있어야 한다.

Inbox와 Node를 별도 테이블로 만들어 중복 데이터를 관리하지 않는다.

Inbox 상태가 필요하면 Node에 별도의 `capture_status` 필드를 사용하는 것을 우선 고려한다.

예:

```text
capture_status
├── inbox
└── processed
```

기존 Node의 `status`와 의미가 충돌하지 않도록 한다.

---

# 12. Explore

전체 데이터를 탐색한다.

기본 타입:

- Task
- Note
- Book
- Place
- Study
- Project
- Idea
- Person

필터:

- Type
- Status
- Tag
- Priority
- Due Date

필요한 필터만 점진적으로 추가한다.

---

# 13. Search

MVP에서는 기본 텍스트 검색을 구현한다.

검색 대상:

- title
- content
- summary
- tags

가능하면 PostgreSQL ILIKE 또는 PostgreSQL Full-Text Search를 사용한다.

검색 모듈은 향후 Semantic Search로 확장할 수 있도록 별도의 모듈로 만든다.

예상 구조:

```text
lib/
  search/
    index.ts
```

MVP에서는 pgvector 기반 Semantic Search를 구현하지 않는다.

---

# 14. Node Detail

각 항목의 상세 정보를 보여준다.

예:

```text
AI Agent 공부

Type: Study

설명...

Tags:
AI
Agent
Programming

Related:

Books
- Designing Agentic Systems

Tasks
- Claude Code로 실습하기
- 관련 강의 보기

Projects
- 개인 AI 비서 만들기

Notes
- MCP 관련 메모
```

Detail 화면에서는 항목 자체뿐 아니라 **연결된 정보**가 중요하다.

---

# 15. 핵심 Node Type

기본 Node Type:

```text
task
note
book
place
study
project
idea
person
```

초기에는 이 8개만 사용한다.

사용자가 명시적으로 요청하지 않는 한 새로운 타입을 임의로 추가하지 않는다.

---

# 16. Node 데이터 모델

기본 DB 구조:

```text
nodes

- id              uuid primary key
- user_id         uuid foreign key
- type            varchar
- title           text
- content         text
- summary         text
- tags            text[]
- status          varchar
- capture_status  varchar
- priority        varchar
- due_date        timestamp
- metadata        jsonb
- embedding       vector (optional / future)
- created_at      timestamp
- updated_at      timestamp
```

---

## 16.1 핵심 필드 원칙

검색, 정렬, 필터링이 빈번한 핵심 데이터는 일반 컬럼으로 유지한다.

예:

- user_id
- type
- title
- status
- priority
- due_date
- created_at
- updated_at

타입별 부가 정보만 `metadata JSONB`에 저장한다.

예:

Book:

```json
{
  "author": "작가명",
  "total_pages": 300
}
```

Place:

```json
{
  "address": "주소",
  "map_url": "지도 URL"
}
```

JSONB에 모든 데이터를 무분별하게 넣지 않는다.

---

# 17. Node 설계 원칙

타입별 별도의 테이블을 만들기보다 공통 Node 구조로 우선 해결한다.

예:

```text
Task
├── title
├── content
├── status
├── priority
└── due_date
```

```text
Book
├── title
├── content
├── status
└── metadata
    ├── author
    └── total_pages
```

```text
Place
├── title
├── content
├── status
└── metadata
    ├── address
    └── map_url
```

타입별 특수 정보가 필요하면 먼저 `metadata` JSONB로 해결할 수 있는지 검토한다.

---

# 18. Tags

초기에는 Tag를 단순한 문자열 배열로 관리한다.

예:

```text
tags = [
  "AI",
  "Agent",
  "Programming"
]
```

초기 MVP에서는 다음 기능을 만들지 않는다.

- Tag 색상 관리
- 부모/자식 Tag
- Tag hierarchy
- Tag 별도 관리 시스템

필요성이 확인된 후 확장한다.

---

# 19. Node Status

## Task

```text
todo
in_progress
done
cancelled
```

## Book

```text
want_to_read
reading
completed
abandoned
```

## Project

```text
planned
active
paused
completed
```

다른 타입의 status가 필요하면 기존 상태와 의미가 충돌하지 않는지 먼저 검토한다.

---

# 20. Priority

Priority는 문자열 enum으로 관리한다.

```text
low
medium
high
urgent
```

필요하면 priority가 없는 상태를 `null`로 표현한다.

---

# 21. Relations

Node 사이의 관계를 별도의 Relation으로 관리한다.

DB 구조:

```text
relations

- id              uuid primary key
- user_id         uuid foreign key
- from_node_id    uuid foreign key
- to_node_id      uuid foreign key
- relation_type   varchar
- created_at      timestamp
```

중복 관계 방지를 위해 다음 제약 조건을 사용한다.

```text
UNIQUE(
  from_node_id,
  to_node_id,
  relation_type
)
```

---

# 22. Relation Type

초기 relation type:

```text
related_to
requires
inspired_by
part_of
derived_from
recommended
```

처음부터 relation type을 너무 많이 만들지 않는다.

가장 중요한 것은:

> A와 B가 관련되어 있다.

를 표현하는 것이다.

---

# 23. Relation 방향성

`related_to`와 같은 대칭적 관계는 DB에 중복 저장하지 않는다.

예:

```text
A -- related_to --> B
```

하나만 저장한다.

B를 조회할 때는:

```text
from_node_id = B
OR
to_node_id = B
```

방식으로 양방향 관계를 조회하여 UI에서는 다음처럼 표현할 수 있다.

```text
A
↕
related_to
↕
B
```

DB에 다음처럼 두 개를 저장하지 않는다.

```text
A → B
B → A
```

---

# 24. Relation 사용자 격리

Relation 생성 시 `from_node`와 `to_node`가 모두 현재 로그인한 사용자의 Node인지 반드시 검증한다.

다른 사용자의 Node를 Relation으로 연결할 수 없어야 한다.

이 검증은 가능한 경우:

- Server
- Database
- RLS

에서 함께 보호한다.

---

# 25. Relation 예시

예:

```text
AI Agent 공부
|
+-- related_to --> Designing Agentic Systems
|
+-- related_to --> MCP 메모
|
+-- requires --> Claude Code로 실습
|
+-- part_of --> 개인 AI 비서 만들기
```

또 다른 예:

```text
일본 한 달 살기
|
+-- related_to --> 도쿄
|
+-- related_to --> 일본어 공부
|
+-- requires --> 숙소 조사
|
+-- requires --> 비용 조사
|
+-- related_to --> 일본 여행 책
```

나중에 Graph View를 만들 수 있도록 DB 구조는 확장 가능하게 설계한다.

Graph View 자체는 MVP에서 만들지 않는다.

---

# 26. AI 기능

AI는 제품의 중요한 기능이지만,
처음부터 모든 것을 자동화하지 않는다.

AI는 기본적으로 **Suggestion 방식**으로 동작한다.

AI가 사용자의 데이터를 마음대로 변경해서는 안 된다.

기본 흐름:

```text
사용자 입력
     ↓
Node 저장
     ↓
AI 분석
     ↓
Suggestion 생성
     ↓
사용자 확인
     ↓
[적용] 또는 [무시]
     ↓
승인된 내용만 DB 반영
```

---

# 27. AI Phase 1: 자동 분류

자연어 입력을 분석하여 다음을 제안한다.

- type
- title
- summary
- tags
- related node candidates
- suggested tasks

예:

사용자:

```text
내년에 일본에서 한 달 정도 살아보고 싶고
도쿄에서 일주일 정도 지내면서 맛집도 찾아보고 싶다.
```

AI:

```text
Type:
Idea

Title:
일본 한 달 살기

Summary:
일본에서 약 한 달 동안 체류하면서
도쿄에서 일주일 정도 머무르는 계획

Tags:
일본
여행
장기체류
도쿄

Related candidates:
도쿄
여행
맛집
```

---

# 28. AI 관련 Node 추천

AI에게 전체 사용자의 Node 데이터를 무조건 전달하지 않는다.

기본 흐름:

```text
새로운 Node
     ↓
검색 / 후보 추출
     ↓
관련 가능성이 높은 Node 후보 생성
     ↓
AI가 후보들의 관련성 판단
     ↓
상위 후보 추천
     ↓
사용자 승인
```

후보 추출에는 상황에 따라 다음을 사용할 수 있다.

- Type
- Tag
- Full Text Search
- PostgreSQL
- Embedding
- pgvector

MVP에서는 가능한 한 단순한 검색 기반 후보 추출부터 시작한다.

---

# 29. AI 출력 검증

AI 응답을 절대 그대로 신뢰하지 않는다.

AI가 반환하는 데이터는 서버에서 반드시 검증한다.

Zod 등의 Schema Validation을 사용하는 것을 권장한다.

예:

```text
type
title
summary
tags
relatedNodeIds
suggestedTasks
```

모든 필드의 타입과 허용값을 검증한다.

허용되지 않은 `type`이 반환되면 임의로 `note`로 저장하지 않는다.

대신:

- AI 결과를 폐기하거나
- 재시도하거나
- 사용자에게 직접 타입 선택을 요청한다.

가능하면 Structured Outputs 또는 JSON Schema를 사용한다.

---

# 30. AI Provider 추상화

AI provider에 직접적으로 의존하는 코드를 여러 곳에 만들지 않는다.

예상 구조:

```text
lib/
  ai/
    provider.ts
    classify.ts
    relate.ts
    embedding.ts
```

예상 인터페이스:

```ts
interface AIProvider {
  classifyNode(input: string): Promise<ClassificationResult>;

  findRelatedNodes(
    node: Node
  ): Promise<RelatedNodeResult[]>;

  generateEmbedding?(
    text: string
  ): Promise<number[]>;
}
```

향후 다음 AI provider를 교체할 수 있도록 설계한다.

- OpenAI
- Anthropic
- Gemini
- 기타 provider

특정 provider의 SDK 호출이 애플리케이션 전체에 퍼지지 않도록 한다.

---

# 31. AI 요청 타이밍

사용자가 입력하는 동안 불필요하게 AI를 호출하지 않는다.

권장:

```text
사용자 입력
↓
입력 완료
↓
저장
↓
AI 분류 요청
```

AI 호출은 가능한 한 명확한 사용자 행동 이후 실행한다.

검색 입력에는 필요하면 debounce를 적용한다.

---

# 32. 향후 AI 기능

MVP 이후 다음 기능을 고려한다.

- 기존 항목과 자동 관계 생성
- 중복 항목 탐지
- 관련 항목 추천
- 저장된 내용을 기반으로 할 일 추천
- 프로젝트 자동 생성 제안
- 장기 목표에서 실행 가능한 Task 추출
- Semantic Search
- 자연어 검색
- 최근 관심사 분석
- Weekly Review
- Monthly Review
- 개인 지식 그래프 분석

사용자가 명시적으로 요청하기 전에는 구현하지 않는다.

---

# 33. Embedding / Semantic Search

`embedding` 컬럼은 향후 Semantic Search를 위해 고려한다.

하지만 MVP에서는:

- embedding 생성
- embedding 저장
- vector search
- Semantic Search

를 구현하지 않는다.

MVP Search:

```text
PostgreSQL
+
ILIKE 또는 Full-Text Search
```

향후:

```text
Node
↓
Embedding
↓
pgvector
↓
Semantic Search
```

형태로 확장한다.

---

# 34. 향후 Graph View

Node와 Relation 데이터가 충분히 쌓이면 Graph View를 추가할 수 있다.

예:

```text
             [Book]
                |
                |
[Note] ---- [AI 공부] ---- [Project]
                |
                |
             [Task]
```

Graph View는 MVP에서 구현하지 않는다.

Graph View보다 먼저:

> Node와 Relation 데이터 구조를 안정적으로 만드는 것

을 우선한다.

---

# 35. UI 디자인 방향

전체적으로 다음 느낌을 목표로 한다.

- 깔끔함
- 차분함
- 직관적
- 정보 과부하 방지
- 빠른 입력
- 명확한 hierarchy
- 모바일 친화적
- 장시간 사용해도 피곤하지 않음

라이트/다크 모드를 모두 고려한다.

색상과 장식보다 정보 구조와 사용성을 우선한다.

---

# 36. Component 설계

작고 재사용 가능한 컴포넌트를 선호한다.

예:

```text
NodeCard
NodeTypeBadge
NodeList
NodeDetail
RelationList
RelationPicker
TagList
SearchInput
QuickCapture
```

거대한 컴포넌트 하나에 모든 기능을 넣지 않는다.

하지만 작은 컴포넌트를 만들기 위한 과도한 abstraction도 피한다.

---

# 37. 예상 프로젝트 구조

가능하면 다음과 비슷한 구조를 유지한다.

```text
app/
  (auth)/
  dashboard/
  inbox/
  nodes/
  search/

components/
  ui/
  nodes/
  inbox/
  dashboard/
  relations/

lib/
  db/
  ai/
  auth/
  search/
  utils/

types/
```

실제 프로젝트 상황에 따라 구조는 조정할 수 있다.

기존 프로젝트 구조가 이미 존재한다면 기존 구조를 우선 존중한다.

---

# 38. TypeScript

`any` 사용을 원칙적으로 금지한다.

도메인 타입을 명확하게 정의한다.

예:

```ts
type NodeType =
  | "task"
  | "note"
  | "book"
  | "place"
  | "study"
  | "project"
  | "idea"
  | "person";
```

가능한 한 타입 안정성을 유지한다.

---

# 39. 데이터 보안

이 앱에는 개인적인 정보가 많이 저장될 수 있다.

사용자 간 데이터가 절대로 섞이면 안 된다.

모든 주요 데이터는 `user_id`를 기준으로 접근한다.

Supabase Row Level Security(RLS)를 필수로 사용한다.

다른 사용자의 데이터를 조회하거나 수정할 수 있는 API를 만들지 않는다.

---

# 40. RLS 원칙

다음 데이터는 반드시 현재 사용자에게만 접근 가능해야 한다.

- nodes
- relations
- 기타 향후 생성되는 사용자 데이터

예:

```text
auth.uid() = user_id
```

를 기본 접근 원칙으로 한다.

Relation의 경우에도 단순히 `relations.user_id`만 확인하지 말고,
연결된 Node들이 현재 사용자 소유인지 확인해야 한다.

---

# 41. 보안 원칙

반드시 다음 원칙을 따른다.

- API Key를 클라이언트에 노출하지 않는다.
- Supabase Service Role Key를 브라우저에 노출하지 않는다.
- 환경변수를 사용한다.
- 사용자 입력을 신뢰하지 않는다.
- 서버에서 권한을 검증한다.
- DB 접근 권한을 검증한다.
- RLS를 사용한다.
- AI 출력값을 검증한다.
- AI Prompt Injection 가능성을 고려한다.
- 사용자의 개인 데이터를 AI 요청에 불필요하게 포함하지 않는다.

---

# 42. 성능

처음부터 과도한 최적화를 하지 않는다.

하지만 다음은 기본적으로 고려한다.

- 불필요한 DB query 최소화
- Pagination
- 적절한 DB Index
- Client / Server Component 구분
- 불필요한 렌더링 방지
- AI 요청 중복 방지
- 검색 debounce

기본적으로 다음 컬럼의 index 필요성을 검토한다.

```text
user_id
type
status
capture_status
created_at
updated_at
due_date
```

실제 DB query 패턴을 확인한 후 필요한 index만 추가한다.

---

# 43. Loading / Empty / Error State

모든 주요 화면은 다음 상태를 고려한다.

## Loading

가능하면 Skeleton UI 등을 사용한다.

## Empty

사용자가 무엇을 해야 하는지 알려준다.

예:

```text
아직 저장된 내용이 없습니다.

생각나는 것을 하나 적어보세요.
```

## Error

무엇이 잘못되었는지 이해할 수 있게 하고
가능한 경우 다음 행동을 안내한다.

---

# 44. 접근성

가능한 한 다음을 준수한다.

- Semantic HTML
- Keyboard Navigation
- Focus State
- 충분한 Color Contrast
- 명확한 Button Label
- 적절한 Touch Target
- Screen Reader 고려

접근성을 기능 구현 후 마지막에 추가하는 것이 아니라
처음부터 기본적인 수준을 유지한다.

---

# 45. 개발 작업 방법

새 기능을 구현할 때 다음 순서를 따른다.

1. 요구사항을 이해한다.
2. CLAUDE.md를 확인한다.
3. 현재 프로젝트 구조를 확인한다.
4. 관련 코드를 확인한다.
5. 현재 DB schema를 확인한다.
6. 기존 구현이 있는지 확인한다.
7. 가장 작은 구현 방법을 선택한다.
8. 코드를 작성한다.
9. lint를 실행한다.
10. typecheck를 실행한다.
11. 테스트를 실행한다.
12. 모바일 UI를 확인한다.
13. 데스크톱 UI를 확인한다.
14. 변경 내용을 요약한다.

---

# 46. 기존 코드 우선

이미 존재하는 기능을 새로 만들지 않는다.

새 기능을 구현하기 전에 다음을 확인한다.

- 기존 component
- 기존 utility
- 기존 hook
- 기존 DB query
- 기존 server action
- 기존 API
- 기존 type

기존 코드가 재사용 가능한 경우 재사용한다.

---

# 47. 큰 작업 처리

큰 작업은 다음 단계로 나누어 진행한다.

```text
Phase 1
Database

↓
Phase 2
Backend

↓
Phase 3
UI

↓
Phase 4
AI

↓
Phase 5
Testing

↓
Phase 6
Polish
```

한 번에 전체 시스템을 구현하지 않는다.

---

# 48. 큰 변경 전 확인

다음 작업은 현재 구조를 먼저 분석하고 계획한 후 진행한다.

- DB schema 변경
- Authentication 구조 변경
- 대규모 Component 변경
- 새로운 외부 서비스 추가
- 기존 데이터 Migration
- 주요 Dependency 변경
- 전체 UI 구조 변경

작은 수정은 바로 진행할 수 있다.

---

# 49. DB Migration

기존 사용자 데이터가 존재하는 상태에서 schema를 변경해야 한다면
Migration을 사용한다.

기존 데이터를 삭제하는 방식으로 해결하지 않는다.

Migration이 필요한 경우:

```text
변경 이유
↓
변경 계획
↓
기존 데이터 영향 분석
↓
Migration 작성
↓
Migration 실행
↓
검증
```

순서로 진행한다.

---

# 50. 요구사항이 모호할 때

사소한 부분이 모호하지만 합리적인 기본값으로 구현할 수 있다면
먼저 구현한다.

모든 세부사항을 사용자에게 매번 질문하지 않는다.

단, 다음과 같은 경우에는 먼저 확인한다.

- 사용자 데이터가 삭제될 수 있는 경우
- 기존 데이터에 영향을 주는 경우
- DB Migration이 필요한 경우
- 인증/보안 구조가 변경되는 경우
- 비용이 발생하는 외부 서비스가 추가되는 경우
- 전체 아키텍처에 영향을 주는 경우

---

# 51. Testing

핵심 기능은 가능한 한 테스트한다.

특히 다음을 중요하게 테스트한다.

- 로그인
- Node 생성
- Node 수정
- Node 삭제
- Quick Capture
- Relation 생성
- Relation 삭제
- 검색
- 필터
- 사용자 권한
- RLS
- AI 제안 검증

AI 응답은 항상 예상하지 못한 결과를 반환할 수 있다는 전제로 테스트한다.

---

# 52. 완료 기준

기능 구현이 끝났다고 판단하기 전에 다음을 확인한다.

- TypeScript 오류가 없는가?
- lint 오류가 없는가?
- 기존 기능이 깨지지 않았는가?
- 모바일 UI가 정상적인가?
- Desktop UI가 정상적인가?
- 권한 문제가 없는가?
- RLS가 정상적으로 동작하는가?
- DB query가 올바른가?
- Loading State가 있는가?
- Empty State가 있는가?
- Error State가 있는가?
- 핵심 사용자 흐름이 정상적으로 동작하는가?

---

# 53. 절대로 하지 말아야 할 것

사용자의 명시적인 요청 없이 다음을 하지 않는다.

- MVP에 필요 없는 대규모 기능 추가
- Graph View 임의 구현
- Semantic Search 임의 구현
- 복잡한 AI Agent 임의 구현
- 과도한 abstraction
- 필요 없는 dependency 추가
- DB 구조의 대규모 변경
- 기존 기능을 깨는 리팩토링
- 디자인 시스템 전체 교체
- 임의의 외부 서비스 연결
- 사용자 데이터 삭제
- 기존 데이터를 임의로 Migration
- API Key 노출
- 다른 사용자의 데이터 접근 가능하게 만들기
- 필요 이상의 파일 생성
- 필요 이상의 복잡한 상태 관리 도입

---

# 54. 제품 개발 우선순위

기능 우선순위는 다음과 같다.

```text
1. 빠른 입력 (Quick Capture)
2. 안정적인 데이터 저장
3. 사용자 데이터 격리 / RLS
4. Node 상세 보기
5. 검색
6. Relation 연결
7. 모바일 UX
8. PWA 기본
9. AI 자동 분류 제안
10. AI 관련 항목 추천
11. Dashboard
12. 고급 기능
```

화려한 기능보다 위 순서를 따른다.

---

# 55. MVP 개발 순서

## Phase 1 — 프로젝트 초기 설정

- Next.js
- App Router
- TypeScript
- Tailwind
- Supabase
- 환경변수
- 기본 Layout

---

## Phase 2 — Authentication

- 로그인
- 회원가입
- 로그아웃
- Session
- Protected Routes

---

## Phase 3 — Database & RLS

- nodes
- relations
- tags
- 필요한 Index
- RLS 정책
- 사용자 데이터 격리

이 단계에서는 Semantic Search와 embedding을 구현하지 않는다.

---

## Phase 4 — Inbox / Quick Capture

- 빠른 입력
- Node 생성
- Inbox 상태
- 목록
- 기본 상태 관리

---

## Phase 5 — Node CRUD

- Node List
- Node Detail
- Node Create
- Node Edit
- Node Delete
- Type
- Tag
- Status

---

## Phase 6 — Relations

- 관련 항목 표시
- Relation 추가
- Relation 삭제
- 양방향 조회
- 사용자 데이터 격리

---

## Phase 7 — Search & Filter

- 기본 텍스트 검색
- Type 필터
- Status 필터
- Tag 필터
- Priority 필터
- Due Date 필터

---

## Phase 8 — Dashboard

- 오늘 할 일
- 예정된 할 일
- 최근 추가한 항목
- 최근 수정한 항목
- 진행 중인 프로젝트

---

## Phase 9 — AI Integration

- 자동 Type 제안
- 제목 제안
- Summary 생성
- Tag 추천
- 관련 Node 후보 추천
- Suggested Task
- 승인 / 무시 UX
- AI 결과 서버 검증

---

## Phase 10 — Polish

- PWA
- Mobile UX
- Desktop UX
- Loading State
- Empty State
- Error State
- Accessibility
- Performance
- 기본 UX 개선

---

# 56. 장기 확장 방향

MVP가 안정화된 후 다음 기능을 고려한다.

## Life OS

- 목표
- 장기 계획
- 습관
- 프로젝트
- Review

## Knowledge

- Knowledge Graph
- Graph View
- Semantic Search
- AI Summary
- AI Relation Analysis

## Planning

```text
Goal
 ↓
Project
 ↓
Task
 ↓
Execution
```

## Review

- Daily Review
- Weekly Review
- Monthly Review
- Yearly Review

## AI Assistant

예:

```text
"최근 내가 어떤 것에 관심을 많이 가지고 있어?"
```

```text
"이 프로젝트에서 아직 해야 할 일이 뭐가 있을까?"
```

```text
"내가 저장한 책 중 지금 읽기 좋은 책을 추천해줘."
```

```text
"일본 한 달 살기를 준비하려면 무엇을 조사해야 할까?"
```

이 기능들은 충분한 데이터가 쌓이고
기본 MVP가 안정화된 이후 구현한다.

---

# 57. 장기 제품 흐름

장기적으로 다음 흐름을 목표로 한다.

```text
Capture
   ↓
Organize
   ↓
Connect
   ↓
Plan
   ↓
Execute
   ↓
Review
   ↓
Discover
```

즉,

생각을 저장하고
↓
정리하고
↓
서로 연결하고
↓
계획으로 만들고
↓
실행하고
↓
돌아보고
↓
새로운 패턴을 발견하는

개인용 Life OS를 목표로 한다.

---

# 58. 핵심 UX

사용자가 할 일:

```text
생각한다.
입력한다.
```

시스템이 도와주는 것:

```text
분류한다.
정리한다.
연결한다.
검색한다.
추천한다.
```

핵심 원칙:

> 사용자는 생각만 하면 된다.
> 정리는 시스템이 도와준다.

---

# 59. 핵심 철학

이 프로젝트에서 가장 중요한 것은 기능의 개수가 아니다.

핵심은 다음과 같다.

> 내 머릿속에 떠오르는 모든 것을 부담 없이 저장하고,
> 시간이 지나면서 그것들이 서로 연결되어
> 나에게 다시 유용한 정보와 행동으로 돌아오는 시스템을 만든다.

따라서 모든 기술적 결정과 UX 결정은
이 목적에 맞는지를 기준으로 판단한다.

---

# 60. 현재 최우선 목표

현재 최우선 목표는 완성된 거대한 Life OS를 만드는 것이 아니다.

다음 흐름이 실제로 잘 작동하는 작은 제품을 만드는 것이다.

```text
사용자가 생각을 입력
        ↓
Quick Capture
        ↓
Node 저장
        ↓
Inbox 상태
        ↓
Type 지정 또는 AI 제안
        ↓
상세 페이지 확인
        ↓
Tag 추가
        ↓
관련 항목 연결
        ↓
검색
        ↓
Dashboard에서 다시 발견
```

이 흐름이 안정적으로 작동하면
그 다음 AI 자동화와 고급 기능을 추가한다.

---

# 61. Claude Code의 기본 행동

Claude Code는 이 파일을 프로젝트의 기본 제품 요구사항과 개발 원칙으로 간주한다.

작업을 요청받으면:

1. CLAUDE.md를 먼저 읽는다.
2. 현재 프로젝트 상태를 확인한다.
3. 기존 코드를 확인한다.
4. 기존 기능을 최대한 활용한다.
5. 가장 단순한 해결책을 선택한다.
6. 모바일 UX를 고려한다.
7. 사용자 데이터 보안을 우선한다.
8. DB 변경에는 신중한다.
9. AI 결과를 서버에서 검증한다.
10. 구현 후 가능한 검증을 수행한다.

항상 다음 질문을 먼저 생각한다.

> "가장 작은 변경으로 현재 요구사항을 만족시키는 방법은 무엇인가?"

그리고 다음 질문도 항상 확인한다.

> "이 기능이 현재 MVP에 정말 필요한가?"

현재 MVP에 필요하지 않다면 구현하지 않는다.
```

 

 