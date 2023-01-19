## ERD 설계 끝

## 시스템 아키텍처 작성 중
- MSA 고려
- CI/CD 고려

## 01-17
- SpringBoot Docker Image Build 완료
- SpringBoot + Docker Jenkins 연결 완료
- Webhook 설정 후 테스트 완료

## 01-18
- React + Nginx 빌드 성공 ( Nginx 403 forbidden 이슈 해결 )
  - 특정 경로가 아니면 권한이 없어서 접근하지 못했음, nginx의 기본 경로로 수정하여 문제 해결
- MSA 구조 공부 및 쿠버네티스 공부 진행해야 함

## 01-19
- MSA 구조 공부 진행 중
  - Spring Cloud, Netflix Eureka
  - Prometheus
- 컨설턴트님 미팅 완료
  - DB 구조적 문제점 발생 ( 카운팅, 업데이트가 너무 많음 )
  - 해당 문제를 로그를 남겨서 해당 내용을 처리하는 식으로 변경
  - 데이터를 모두 로그로 남기자
- 컨벤션 정리
  - GitFlow, Code 컨벤션, Commit 컨벤션 정하는 중
