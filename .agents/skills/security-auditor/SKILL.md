---
name: Full-Stack Security Auditor (Add-on Skill)
description: 웹, 서버, DB 전 계층의 취약점을 식별하고 방어 코드를 설계합니다.
---

# 보안 점검 및 설계 가이드라인

당신은 모든 코드 생성 시 'Security by Design' 원칙을 준수합니다. 구현 기능의 시각적 완성도만큼 데이터의 안전성을 우선시합니다.

## 1. Web Frontend (Client-Side)
- **XSS 방어:** 모든 사용자 입력값과 API 응답 데이터는 렌더링 전 반드시 살균(Sanitize)합니다. (React의 기본 탈출 기능을 신뢰하되, `dangerouslySetInnerHTML` 사용은 엄격히 금지합니다.)
- **CSRF 보호:** 모든 상태 변경 요청(POST, PUT, DELETE)에는 CSRF 토큰 검증 또는 SameSite Cookie 설정을 적용합니다.
- **Content Security Policy (CSP):** Next.js의 `middleware`나 `headers` 설정을 통해 허용되지 않은 스크립트 실행 및 인라인 스타일을 차단합니다.
- **Secure Storage:** JWT 등 민감 정보는 `localStorage` 대신 `httpOnly` 및 `Secure` 플래그가 설정된 쿠키에 저장하도록 설계합니다.

## 2. API & Server (FastAPI / Node.js)
- **Input Validation:** 모든 API 엔드포인트에 `Pydantic` 등 스키마 검증을 도입하여 예기치 않은 데이터 주입을 원천 차단합니다.
- **Rate Limiting:** 특정 IP의 과도한 요청을 제한하여 DoS 공격 및 크롤링 남용을 방지합니다.
- **Authentication & RBAC:** 사용자의 역할(Admin, Editor, Viewer)에 따른 접근 권한(Role-Based Access Control)을 엄격히 분리하여 구현합니다.
- **Error Handling:** 에러 응답 시 스택 트레이스나 내부 서버 구조가 노출되지 않도록 표준화된 에러 메시지만 전달합니다.

## 3. Database (Data Layer)
- **SQL Injection 방어:** Raw Query 사용을 지양하고 반드시 ORM의 Parameterized Query를 사용합니다.
- **Least Privilege:** DB 계정은 해당 서비스에 필요한 최소한의 권한(예: 특정 테이블 읽기/쓰기)만 가지도록 설정합니다.
- **Encryption:** 비밀번호는 반드시 `bcrypt`나 `Argon2`와 같은 강력한 해시 알고리즘으로 암호화하여 저장합니다.

## 4. Infrastructure & Secret Management
- **Environment Variables:** API 키, DB 비밀번호 등은 절대로 코드에 하드코딩하지 않으며 `.env` 파일을 통해 관리합니다.
- **Dependency Scan:** 사용하는 라이브러리의 보안 취약점(CVE)을 주기적으로 점검하도록 권고합니다. (npm audit, pip-audit 활용)

## 5. Hosting
1. **Network Verification**
   - Run `netstat -tulpn` on the host to ensure DB/Redis ports are not listening on `0.0.0.0`.
   
2. **Secret Initialization**
   - Copy `app/.env.example` to `app/.env` and generate a high-entropy password (32+ chars).
   
3. **Container Launch**
   - Run `docker compose up -d`.
   - Verify health via `docker compose ps`.
   
// turbo
4. **Security Audit**
   - Run `trivy image <app-image>` to scan for known vulnerabilities.