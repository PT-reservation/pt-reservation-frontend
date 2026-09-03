# PT팟 — Frontend

그룹 PT 클래스 예약 시스템의 프론트엔드입니다. 백엔드의 낙관적 락/SSE 기반 실시간 예약 시스템을 실제 사용자가 쓸 수 있는 화면으로 구현했습니다.

- 🔗 **Live Demo**: https://pt-reservation-frontend.vercel.app
- ⚙️ **백엔드 저장소**: [pt-reservation-backend](https://github.com/PT-reservation/pt-reservation-backend)

> 백엔드가 무료 플랜(Render)이라 15분 이상 요청이 없으면 슬립됩니다. 접속 후 데이터가 안 뜨면 20~50초 정도 기다렸다가 새로고침해주세요.

---

## 실시간 반영 (SSE)

브라우저의 `EventSource` API는 커스텀 헤더(`Authorization`)를 지원하지 않아서, 인증이 필요한 개인 알림 스트림은 JWT를 쿼리 파라미터로 전달하는 방식으로 연결했습니다 (`/notifications/events?token=...`).

- **클래스 상세 화면**: 다른 사용자의 예약/취소로 좌석 수가 바뀌면 새로고침 없이 실시간 반영 ([`useClassEvents`](src/hooks/useClassEvents.ts))
- **개인 알림**: 대기 중이던 예약이 자동 확정되거나, 세션권 부족으로 승격이 스킵되면 실시간 토스트 알림 ([`useNotificationEvents`](src/hooks/useNotificationEvents.ts))
- 두 경우 모두 이벤트 수신 시 TanStack Query의 `invalidateQueries`로 관련 캐시를 무효화해, 실제 화면 갱신은 기존 `useQuery` 로직을 그대로 재사용합니다

## 클래스 이미지 업로드

트레이너가 클래스 등록/수정 시 이미지를 첨부할 수 있습니다. 이미지 실물 파일은 [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)에 저장하고, DB에는 URL 문자열만 저장하는 방식을 채택했습니다(원본을 DB에 직접 저장하지 않는 표준 패턴 — 용량/성능/CDN 캐싱 이유).

- 업로드 전 브라우저 Canvas API로 이미지를 리사이즈(최대 가로 1200px) + JPEG 압축(품질 80%)해서, 폰 카메라 원본(수 MB)도 수백 KB로 줄여서 전송 ([`lib/image.ts`](src/lib/image.ts))
- Blob 업로드는 클라이언트가 직접 하지 않고 서버 API 라우트(`/api/upload`)를 거쳐 처리 — 쓰기 권한이 있는 토큰을 브라우저에 노출하지 않기 위함
- 이미지 첨부는 선택 사항이며, 미첨부 시 브랜드 로고 기반 기본 이미지로 대체되어 화면상 일관성 유지

## 화면 구성

| 화면 | 경로 | 설명 |
|---|---|---|
| 홈 (클래스 목록) | `/` | 상단 홍보 배너, 전체 클래스 목록, 좌석 현황 |
| 클래스 상세 | `/classes/[id]` | 상세 정보, 예약/취소, 실시간 좌석 반영 |
| 회원가입 / 로그인 | `/signup`, `/login` | 역할(회원/트레이너) 선택 가입 |
| 마이페이지 | `/mypage` | (회원) 예약 이력·세션권 조회 / (트레이너) 클래스 현황 대시보드 |
| 세션권 상점 | `/shop` | (회원 전용) 세션권 패키지 구매 |
| 내 클래스 관리 | `/trainer/classes` | (트레이너 전용) 클래스 등록/수정/삭제, 예약자 명단 조회 |

## 데모

### 실시간 반영 (SSE)

![SSE 실시간 반영 데모](docs/demo-sse.gif)

### Lighthouse 점수

| 항목 | 모바일 | 데스크톱 |
|---|---|---|
| 성능 | 86 | 98 |
| 접근성 | 95 | 95 |
| 권장사항 | 96 | 96 |
| SEO | 100 | 100 |

## 기술 스택

| 분류 | 사용 기술 |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, framer-motion |
| 서버 상태 관리 | TanStack Query |
| 인증 | JWT (localStorage 저장, `React Context`로 전역 상태 공유) |
| 실시간 | Server-Sent Events (`EventSource`) |
| 이미지 저장 | Vercel Blob |
| 배포 | Vercel |

## 로컬 실행

```bash
npm install

# .env.local 생성 후 아래 값 추가
# NEXT_PUBLIC_API_URL=http://localhost:8080   (백엔드를 로컬에서 실행 중일 때)
# 또는 배포된 백엔드를 바라보고 싶다면:
# NEXT_PUBLIC_API_URL=https://pt-reservation-backend.onrender.com
#
# BLOB_READ_WRITE_TOKEN=...   (Vercel 대시보드 > Storage > Blob 스토어에서 발급)
# 클래스 이미지 업로드 기능에만 필요, 없어도 나머지 기능은 정상 동작

npm run dev
```
