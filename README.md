Wisdom React 프로젝트 사용 설명서
1. 프로젝트 소개
Wisdom React는 온라인 교육 플랫폼으로, 사용자들이 다양한 강의를 구매하고 시청할 수 있는 웹 애플리케이션입니다.
2. 주요 기능
사용자 인증 (로그인/회원가입)
강의 목록 조회 및 검색
강의 구매 및 결제
구매한 강의 시청
장바구니 기능
주문 관리 (진행 중인 주문, 완료된 주문)
사용자 설정 관리
3. 기술 스택
Frontend: React + TypeScript
상태 관리: Redux (slice 패턴 사용)
UI 라이브러리: Material-UI
비디오 플레이어: React Player
4. 주요 페이지 구성
홈페이지 (/src/app/screens/homePage)
신규 강의 목록
인기 강의 목록
구매한 강의 목록
이벤트 정보
강의 페이지 (/src/app/screens/lessonsPage)
전체 강의 목록
강의 상세 정보
비디오 재생 모달
주문 페이지 (/src/app/screens/orderPage)
진행 중인 주문 목록
완료된 주문 목록
사용자 페이지 (/src/app/screens/usersPage)
구매한 강의 관리
사용자 설정
5. 프로젝트 실행 방법
프로젝트 의존성 설치:
Apply to .env
Run
install
개발 서버 실행:
Apply to .env
Run
start
6. 환경 설정
.env 파일에서 필요한 환경 변수 설정
API 엔드포인트 설정은 서비스 파일에서 관리 (/src/app/service/)
7. 주요 서비스
강의 서비스 (LessonService.ts)
강의 목록 조회
강의 상세 정보 조회
강의 검색
회원 서비스 (MemberService.ts)
사용자 인증
프로필 관리
회원 정보 수정
주문 서비스 (OrderService.ts)
주문 생성
주문 상태 관리
결제 처리
8. 스타일링
CSS 모듈을 사용하여 컴포넌트별 스타일링 관리
Material-UI 테마 커스터마이징 (/src/app/MaterialTheme)
9. 유틸리티
전역 상태 관리를 위한 커스텀 훅 (/src/hooks)
타입 정의 (/src/lib/types)
상수 및 열거형 (/src/lib/enums)
이 프로젝트는 교육 콘텐츠를 제공하고 관리하는 데 필요한 모든 기능을 포함하고 있으며, React와 TypeScript를 기반으로 한 현대적인 웹 애플리케이션입니다.
