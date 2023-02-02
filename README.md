# 🏛 ALCOL - 알고리즘 대결 사이트


## ALCOL 링크 : [http://i8b303.p.ssafy.io]


## 프로젝트 진행 기간
2022.01.03(화) ~ 2022.02.02(금) - Sub-PJT Ⅲ
SSAFY 8기 2학기 공통프로젝트 - ALCOL

</br>
## 🕹Sub-PJT Ⅲ
<br/>
### 서비스별 데이터베이스 분리
---
- ### User Service
    - 사용자(USER_TB)
    - 사용자 탈퇴(USER_LEFT_TB)
    - 친구(FRIEND_TB)
    - 사용자 레벨(USER_LEVEL_TB)
    - 사용자 티어(USER_TIER_TB)
    <br/>
- ### Problem Service
    - 문제(PROBLEM_TB)
    - 문제 티어(PROB_TIER_TB)
    - 문제 유형(PROB_CATEGORY_TB)
    - 문제 유형 연결 테이블(PROB_CATEGORY_PIVOT_TB)
    <br/>
- ### Battle Service
    - 배틀 모드(BATTLE_MODE_TB)
    <br/>
- ### Log Service
    - 문제 제출 로그(PROB_TRIAL_LOG_TB)
    - 배틀 전적 로그(BATTLE_LOG_TB)
    - 배틀 문제 제출 로그(BATTLE_PROB_SUBMIT_LOG_TB)
    - 과거 시즌 로그(PAST_SEASON_LOG_TB)
    <br/>
- ### Rank Service
    <br/>
- ### Match Service
    <br/>

</br>
### ERD
![Untitled](/uploads/b4f22590820e7d6cf8a0d4f343a8fb8f/Untitled.png)
</br>

## ✔ 기획의도
IT직군 채용 프로세스의 일부로 코딩테스트를 도입하는 기업들이 증가함에 따라 관련 사이트의 수요가 증가하고 있습니다.

기존의 사이트들은 혼자서 알고리즘 문제를 해결하는 방식으로 사용자들에게 정적인 경험을 제공하지만, 이러한 방식은 사용자가 흥미를 느끼기에 충분하지 않습니다.

ALCOL은 이와 같은 문제를 해결하기 위해 착안된 알고리즘 대결 프로젝트입니다. ALCOL과 함께라면 알고리즘 풀이에 더욱 몰입할 수 있습니다.


</br>

## ✔ 개요
*- 알고리즘 문제 풀이 서비스에 경쟁을 넣음으로써 학습 의지를 향상시키자! -*  

ALCOL은 ALgorithm COLosseum의 약자입니다.
ALCOL은 학습동기 유발을 위해 배틀 구조의 대결을 제공하는 웹서비스입니다. 타인과 대결을 함으로써 학습 동기를 유발하여 학습 의지를 향상시킬 수 있습니다.

티어와 시즌제를 도입함으로써 부담 없는 경쟁 요소로 동기부여를 하고 콘텐츠 순환을 유도하여 랭크게임의 참여와 몰입도를 높였습니다. 또한, 레벨제도를 도입하여 열심히 문제를 푸는 유저는 그만큼 성취감을 더할 수 있게 하였습니다.


</br>

## ✔ 주요 기능
---
- ### 알고리즘 대결 서비스
    - 스피드전, 최적화전 중에서 원하는 모드를 선택할 수 있습니다.
    - 사용자는 알고리즘 유형을 보고 원하지 않는 문제 하나를 밴할 수 있습니다.
    - 문제를 푸는 도중에 상대의 문제 풀이 현황 알림을 확인할 수 있습니다.
    <br/>
- ### 랭킹 서비스
    - 게임 모드별 개인과 전체 랭킹을 확인할 수 있습니다.
    - 유저 닉네임을 검색하여 해당 유저의 랭킹과 정보를 확인할 수 있습니다.
    <br/>
- ### 연습문제 서비스
    - 대결이 아닌 연습문제 풀이 기능을 제공합니다.
    - 문제를 풀면 경험치를 얻고, 경험치를 얻어 레벨을 높일 수 있습니다.
    <br/>
- ### 마이페이지
    - 이번 시즌에서의 모드별 티어와 대결 전적을 확인할 수 있습니다.
    - 지난 시즌의 기록과 티어를 확인할 수 있습니다.
    <br/>

</br>

## ✔ 주요 기술
---

**Backend - Spring**
- IntelliJ IDE
- Springboot 2.7.8
- Spring Data JPA
- Spring Security
- Spring Cloud
- Spring Web
- WebSocket
- Redis
- MySQL

**Frontend**
- Visual Studio Code IDE
- React 18.2.0
- Node.js 18.13.0

**CI/CD**
- AWS EC2
- Jenkins
- NGINX
- SSL

## ✔ MSA 파일 기본구조
---
```
service
  ├── api
  │   └── dev
  ├── config
  ├── controller
  ├── dto
  ├── entity
  ├── repository
  ├── service
  └── utils
```


## ✔ 협업 툴
---
- Git
- Notion
- JIRA
- MatterMost
- Webex

## ✔ 협업 환경
---
- Gitlab
  - 코드의 버전을 관리
  - Git Flow 브랜치 전략 사용
  - 팀원과의 소통을 위해 설정한 Git Convention을 따름
- JIRA
  - 매주 월요일 목표를 설정하여 Sprint 진행
  - 업무의 할당량을 정하여 Story Point를 설정하고 해당하는 컴포넌트와 버전을 명시함
- 회의
  - 매일아침 30분씩 스크럼을 통해 진행사항 공유
  - 긴급 안건이 있는 경우 별도의 회의를 진행함
- Notion
  - 회의가 있을때마다 회의록을 기록하여 보관
  - 전날 진행한 사항과 진행할 사항 등에 관한 스크럼 사항 기록
  - 기술확보 시, 다른 팀원들도 추후 따라할 수 있도록 보기 쉽게 작업 순서대로 정리
  - 컨벤션 정리
  - 간트차트 관리
  - 기능명세서, API 명세서 등 모두가 공유해야 하는 문서 관리

## ✔ 프로젝트 산출물
---
- [기능명세서](https://blushing-friend-fae.notion.site/9b486ee135fd4411a3b36f5a5b6a5894)
- [시퀀스다이어그램](https://www.figma.com/file/vyjwu7DsXiuFn20tJ9e07v/User-Flow?t=OJhV1EWLoFnaFHIp-0)
- [와이어프레임](https://www.figma.com/file/VHlwCDfrbRYxbhY3gxLO5r/UI?t=TQoZZjmzCwyifvzN-6)
- [컨벤션](https://blushing-friend-fae.notion.site/e3b2e67c015b44bbabbde02d8a32ef0a)
- [API](https://blushing-friend-fae.notion.site/API-84eacb82e6614561a3456764761e8fe1)
- [ERD](https://blushing-friend-fae.notion.site/ERD-a3f7f107e10d48f2ad4509eb8eb11819)
- [회의록](https://blushing-friend-fae.notion.site/TEAM-J6IX-4319b50de1bf4cb58222b889304ccef4)
- [시스템기술서](https://blushing-friend-fae.notion.site/735840ca0f694c30b366eda4774e31f7)
