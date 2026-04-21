# 📖 Quality Pulse: Mock Data to Real Database Migration Guideline

이 지침서는 현재 목업(Mock) 데이터로 동작하는 Quality Pulse 시스템을 **실제 PostgreSQL 데이터베이스**와 연동하기 위해 필요한 단계별 가이드라인 및 아키텍처 조언을 담고 있습니다.

---

## 1. 현재 상황 분석 (Mock Data의 위치와 한계)

현재 프론트엔드의 화려한 대시보드(세계 지도, 실시간 로그, KPI 카드 등)는 하드코딩된 정적 데이터에 의존하고 있습니다.

### 주요 Mock Data 포인트
*   **파일 위치**: `frontend/src/shared/mockData.ts`
*   **활용처**:
    *   **KPI 통계 (`MOCK_KPI_STATS`)**: 목표 달성률, 볼륨 추이 등의 상단 카드
    *   **차트 데이터**: 파이 차트(`MOCK_RISK_DATA`), 시계열 트렌드(`MOCK_TIMELINE_DATA`), 지역별 막대(`MOCK_REGIONAL_DATA`)
    *   **최근 이벤트 (`MOCK_EVENTS`)**: 우측 하단의 실시간 이슈 상태 로깅
*   **지도 컴포넌트 (`LabeledWorldMap.tsx`)**: 내부 상태 배열이나 정적 위/경도(Latitude, Longitude) 매핑을 사용.

🚨 **문제점**: 이 상태로는 크롤러(Crawl4AI)가 긁어온 실제 품질 이슈(Recalls, Hazards)가 프론트엔드 화면에 반영되지 않습니다.

---

## 2. 데이터베이스 스키마 및 API 매핑 전략

실제 DB 구조(`backend/models/issue.py`)를 기반으로 프론트엔드 대시보드를 채우기 위한 API 서빙 전략입니다.

### A. 대시보드 집계 API (Aggregation)
프론트엔드에서 수천 건의 Issue 원본 데이터를 가져와 직접 계산하면 브라우저에 과부하가 걸립니다. **백엔드에서 집계(Group By)하여 내려주어야 합니다.**

1.  **시계열 트렌드 (`/api/v1/dashboard/timeline`)**
    *   *쿼리 모델*: `SELECT DATE(published_at), COUNT(*) FROM issues WHERE published_at > NOW() - INTERVAL '7 days' GROUP BY DATE(published_at);`
2.  **리스크 분포 (`/api/v1/dashboard/risk`)**
    *   *쿼리 모델*: `SELECT severity, COUNT(*) FROM issues GROUP BY severity;`
3.  **최근 품질 이벤트 로그 (`/api/v1/dashboard/recent-logs`)**
    *   *쿼리 모델*: `SELECT title, severity, category, created_at FROM issues ORDER BY created_at DESC LIMIT 20;`

### B. 글로벌 위치 데이터 (World Map 처리)
세계 지도(ECharts)는 `[경도, 위도, 값]` 형태의 좌표를 요구합니다. 하지만 현재 DB의 `Issue` 모델에는 `region`(예: "NA", "APAC" 등 단순 텍스트) 컬럼만 있고 구체적인 좌표(Lat/Lng)가 없습니다.

**✅ 해결 방안 (선택):**
1.  **백엔드 스키마 추가 (권장)**: `Issue` 혹은 `Location` 참조 테이블에 실제 `latitude`, `longitude` 컬럼을 Alembic을 통해 추가.
2.  **프론트엔드 딕셔너리 매핑**: 백엔드에서 `region: "North America", count: 120`을 주면, 프론트엔드의 `utils` 파일에서 `{ "North America": [경도, 위도] }` 사전(Dictionary)을 통해 ECharts 좌표로 변환 반영.

---

## 3. 실데이터 연동 작업 순서 (Action Plan)

### Step 1: 백엔드 Dashboard API 개발 (FastAPI)
1.  새로운 라우터 생성 (`backend/api/endpoints/dashboard.py`).
2.  위에서 언급된 집계형 API 3~4개를 구현.
3.  Postgres의 `SQLAlchemy`를 이용한 고성능 `func.count()`, `func.date_trunc()` 쿼리 최적화 수행.

### Step 2: 클라이언트 API 호출 계층 (Next.js)
1.  `frontend/src/shared/mockData.ts`의 역할을 대체할 API 호출 함수를 `frontend/src/utils/api.ts` 등에 작성.
2.  성능 향상을 위해 **SWR** 또는 **React Query**, 혹은 Next.js의 Server Elements (App Router fetch with `revalidate`)를 도입하여 데이터를 주입.

### Step 3: 컴포넌트 의존성 주입 리팩토링
1.  프론트엔드 컴포넌트(`RawDataTable`, `LabeledWorldMap` 등)가 내부에서 `import { MOCK_* }`를 직접 호출하지 않도록 제거.
2.  최상단 부모 페이지(예: `page.tsx`)에서 API로부터 데이터를 로드한 뒤 컴포넌트로 `props`를 내려주는 구조로 변경.

---

## 4. 상세 구현 가이드 (Implementation Guide)

위 작업 순서를 실제로 코드에 적용하기 위한 상세 구현 예시입니다.

### 4.1 백엔드: API 엔드포인트 구현 (FastAPI)
`backend/api/endpoints/dashboard.py` 경로에 새로운 라우터를 생성하고 집계 데이터를 반환하도록 구성합니다.

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.database import get_db
from models.issue import Issue

router = APIRouter()

@router.get("/risk")
def get_risk_distribution(db: Session = Depends(get_db)):
    # DB에서 severity 카운트 집계
    results = db.query(
        Issue.severity.label('name'), 
        func.count(Issue.id).label('value')
    ).group_by(Issue.severity).all()
    
    # ECharts에서 요구하는 [{name: '...', value: ... }] 형식으로 반환
    return [{"name": r.name, "value": r.value} for r in results]
```

### 4.2 프론트엔드: API 호출 유틸리티 작성 (Next.js)
`frontend/src/utils/api.ts` 등에 SWR을 이용한 범용 Fetcher를 작성합니다.

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useDashboardData(endpoint: string) {
  // 실제 백엔드 주소로 호출되도록 proxy 설정이 적용됨
  const { data, error, isLoading } = useSWR(`/api/v1/dashboard/${endpoint}`, fetcher);
  
  return {
    data,
    isLoading,
    isError: error
  };
}
```

### 4.3 프론트엔드: 컴포넌트 의존성 주입 (React)
Mock Data를 직접 import 하던 방식에서, 부모 컴포넌트(`page.tsx`)에서 데이터를 서버로부터 받아 하위 컴포넌트로 전달(Props)하는 구조로 변경합니다.

```tsx
// frontend/src/app/dashboard/materials/page.tsx
import { useDashboardData } from '@/utils/api';
import { LabeledWorldMap } from '@/components/dashboard/LabeledWorldMap';
// import { MOCK_REGIONAL_DATA } from '@/shared/mockData'; // 삭제

export default function MaterialsDashboard() {
  const { data: mapData, isLoading } = useDashboardData('map');

  if (isLoading) return <div>Data Loading...</div>;

  return (
    <div className="grid">
      {/* 백엔드에서 받은 실제 DB 데이터를 컴포넌트에 주입 */}
      <LabeledWorldMap data={mapData} />
    </div>
  );
}
```

---

## 5. 고급 시계열 및 목표 관리 대시보드 (Year-over-Year & Targets)

2024년, 2025년과 같이 연도(Year)가 가변적으로 늘어나는 경우, 구조적인 확장을 위해 다음 설계를 권장합니다.

### A. 목표(Target) 데이터 모델링
단순 하드코딩이 아닌, 연도별/월별/권역별로 목표를 다이나믹하게 관리하기 위해 별도 테이블 추가.
```sql
CREATE TABLE kpi_targets (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,             -- 예: 2024, 2025
    metric_name VARCHAR NOT NULL,  -- 예: defect_rate, total_issues
    region VARCHAR,                -- 예: Global, NA, APAC
    target_value DECIMAL NOT NULL, -- 목표 임계치
    effective_from DATE
);
```

### B. 비교를 위한 백엔드 집계 API (Dynamic Validation)
- 프론트엔드가 연도 목록(예: `[2024, 2025]`)를 배열로 전송하면, 백엔드는 해당 연도별 데이터 세트를 병렬로 추출하여 반환합니다.
- **예측선(Projection) 로직**: 백엔드의 머신러닝 모듈이나 통계 라이브러리(Pandas/Numpy)를 이용해 `현재 월의 이동편균(Moving Average)`을 계산하고 잔여 기간에 대한 예측값(Extrapolation)을 JSON 배열에 포함하여 내려줍니다.

---

## 6. 전문가 조언 (Architect's Recommendations)

1.  **성능과 캐싱 (Redis 활용)**
    *   대시보드 통계는 조회수 대비 데이터 생성 빈도가 낮습니다. 집계 쿼리는 RDBMS에 부하를 주므로, 백엔드의 Redis를 통해 대시보드 API 응답값을 **1분~5분 단위로 캐싱(Cache)** 하십시오.
2.  **서버 기반 차트 렌더링주의 (Hydration Mismatch)**
    *   ECharts와 같은 Canvas/WebGL 기반 시각화 라이브러리는 SSR(Server-Side Rendering) 단계에서 그릴 수 없습니다. `Next.js`의 `dynamic import(..., { ssr: false })`를 사용하여 클라이언트(브라우저)에서만 지도가 렌더링되도록 유지하십시오.
3.  **데이터 Fallback 방어코드 작성**
    *   크롤러가 멈춰서 DB에 당장 오늘자 데이터가 빈 형태(Empty Array)로 내려오더라도 UI 컴포넌트가 Error를 뿜으며 터지지 않도록, "데이터 없음(No Data Available)"이나 로딩 스켈레톤(Skeleton) 처리를 미리 구현해야 상용 MVP 퀄리티가 훼손되지 않습니다.
4.  **권역 데이터의 지능화 (GenAI Triage)**
    *   크롤러가 "Chicago"라는 텍스트를 파싱했을 때, Gemini (Triage Agent)가 JSON 형태로 정제하는 과정에서 프롬프트를 수정하여 `"lat": 41.8781, "lng": -87.6298` 등 지리적 좌표(Geocoding)를 함께 추출하도록 고도화하면 DB와 지도의 완전한 자동화가 완성됩니다.
