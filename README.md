# 🏛 ALCOL - 알고리즘 대결 사이트

![로고](/uploads/f67275ddbfe191bba02d51b3634b0821/로고.PNG)

</br>

## 🕹 ALCOL 링크 : [ALCOL](http://i8b303.p.ssafy.io)
## 🕹 소개 영상 : [UCC 링크](https://youtu.be/0q725RXhRio)


## ✔ 프로젝트 진행 기간
2022.01.03(화) ~ 2022.02.17(금)

SSAFY 8기 2학기 공통프로젝트 - ALCOL

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
- OpenJDK 1.8
- Springboot 2.7.8
- Spring Data JPA
- Spring Security 5.7.6
- Spring Cloud(2021.0.5)
- Spring NetFlix Eureka 1.10.17
- Spring Web
- Redis 7.0.8
- MySQL 8.0.32

**Frontend**
- Visual Studio Code IDE
- React 18.2.0
- Node.js 18.13.0
- TypeScript 7.20
- Ant design 5.1.5
- recoil 0.7

**CI/CD**
- AWS EC2
    - Ubuntu 20.04 LTS
    - Docker 20.10.12
- Jenkins 2.375.1
- NGINX
- SSL

## ✔ 프로젝트 파일 기본구조
---
### Backend - MSA 서비스 기본구조
```
service
  ├── api
  │   └── dev
  ├── config
  ├── controller
  ├── dto
  ├── entity
  ├── error
  │   └── CustomStatusCode
  ├── repository
  ├── service
  └── util
      └── ApiUtils
```

</br>

### Frontend
```
Frontend
  ├── .prettierrc
  ├── build
  ├── default.conf
  ├── Dockerfile
  ├── package-lock.json
  ├── package.json
  ├── public
  ├── README.md
  └── src
      ├── assets
      │  ├── fonts
      │  └── images
      ├── components
      │  ├── accounts
      │  ├── battle
      │  ├── home
      │  └── mypage
      ├── shared
      └── states

```

</br>

## ✔ 서비스별 데이터베이스 분리

---

- ### User Service
    - 사용자(USER_TB)
    - 사용자 탈퇴(USER_LEFT_TB)
    - 사용자 레벨(USER_LEVEL_TB)
    - 사용자 티어(USER_TIER_TB)
    - 레벨 경험치
        - key
            - levelExp:userId
        - value
            - 1
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
    - 승패 횟수(Hash Table)
        - key
            - winloseCnt:userId:battleMode
        - field
            - win
            - lose
    - MMR별 랭킹(Sorted Set)
        - key
            - speed
            - optimization 
        - member
            - userid
        - score
            - MMR
    - 랭킹 유저 데이터(Hash Table)
        - key
            - userInfo:userId
            - field
                - nickname
                - level
                - speed_tier
                - optimization_tier
                - stored_file_name
    <br/>
- ### Match Service
    <br/>

</br>

### ERD
---
![ERD](/uploads/06b92fd25d9a257d72dec4f885aa2be8/ERD.png)

</br>

## ✔ CI/CD
---
### MSA구조에 맞게 프로젝트 단위마다 Docker 컨테이너로 나누어 관리, 젠킨스를 통해 자동 빌드, 배포 중
---
![iimage](/uploads/c718ce6a72f89c83957f886f2ccbf4b9/iimage.png)

</br>


## ✔ 협업 툴
---
- GitLab
- Notion
- JIRA
- MatterMost
- Webex

</br>

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

</br>
  
## ✔ 팀원 역할 분배
---
![팀원 역할 분배](/uploads/981486a506d5be6094c3f20ad5532868/스크린샷_2023-02-17_오전_1.59.39.png)

</br>

## ✔ 프로젝트 산출물
---
- [주제선정](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/docs/%EC%A3%BC%EC%A0%9C%EC%84%A0%EC%A0%95%20%EB%B8%8C%EB%A0%88%EC%9D%B8%EC%8A%A4%ED%86%A0%EB%B0%8D.md)
- [기능명세서](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/docs/%EA%B8%B0%EB%8A%A5%20%EB%AA%85%EC%84%B8%EC%84%9C.md)
- [시퀀스다이어그램](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/docs/%EC%8B%9C%ED%80%80%EC%8A%A4%20%EB%8B%A4%EC%9D%B4%EC%96%B4%EA%B7%B8%EB%9E%A8.md)
- [UI/UX](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/docs/UIUX%20%EB%94%94%EC%9E%90%EC%9D%B8.md)
- [컨벤션](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/docs/%EC%BB%A8%EB%B2%A4%EC%85%98.md)
- [API](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/docs/API%20%EB%AA%85%EC%84%B8%EC%84%9C.md)
- [ERD](https://blushing-friend-fae.notion.site/ERD-a3f7f107e10d48f2ad4509eb8eb11819)
- [회의록](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/docs/%ED%9A%8C%EC%9D%98%EB%A1%9D.md)
- [시스템 구조도](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/docs/%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EA%B5%AC%EC%A1%B0%EB%8F%84.md)

</br>

## ✔ 프로젝트 결과물
-   [포팅메뉴얼](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/exec/ALCOL_%ED%8F%AC%ED%8C%85_%EB%A7%A4%EB%89%B4%EC%96%BC.pdf)
-   [중간발표자료](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/ppt/ALCOL_%EC%A4%91%EA%B0%84%EB%B0%9C%ED%91%9C.pptx)
-   [최종발표자료](https://lab.ssafy.com/s08-webmobile1-sub2/S08P12B303/-/blob/master/ppt/ALCOL_%EC%B5%9C%EC%A2%85%EB%B0%9C%ED%91%9C.pptx)

</br>

## 🕹 ALCOL 서비스 화면
### 메인 화면

- 회원가입, 로그인, 배틀 시작 기능을 활용할 수 있습니다.
- 서비스 사용 방법을 확인할 수 있습니다.

![ALCOL_-_Chrome_2023-02-17_12-44-54_Trim__2_](/uploads/01de8a718057cbec571c4096382d7a5d/ALCOL_-_Chrome_2023-02-17_12-44-54_Trim__2_.gif)

### 메인 화면 랭킹

- 배틀 모드 별 랭킹을 확인할 수 있습니다.

![Untitled](images/Untitled%201.png)

### 회원가입

- 회원 가입을 진행할 수 있습니다.
- 회원가입 시 사진을 업로드 할 수 있습니다.

![Untitled](images/Untitled%202.png)

### 로그인

- 로그인을 진행할 수 있습니다.

![Untitled](images/Untitled%203.png)

### 연습 문제 목록

- 연습 문제 목록을 확인할 수 있습니다.
- 문제 번호, 문제 이름, 문제 유형, 문제 난이도를 확인할 수 있습니다.

![Untitled](images/Untitled%204.png)

### 연습 문제 상세

- 연습 문제 제출 화면입니다.
- 문제 상세 설명, 입력 설명, 출력 설명이 있고 입출력 예시를 확인할 수 있습니다.
- 제출 언어를 설정할 수 있고, 제출 시 정답 여부를 확인할 수 있습니다.

![Untitled](images/Untitled%205.png)

### 배틀 모드 선택

- 배틀 진행 시 모드를 선택할 수 있습니다.
- 모드는 스피드전, 최적화전 중 하나를 고를 수 있습니다.

![Untitled](images/Untitled%206.png)

### 배틀 언어 선택

- 배틀 시 사용할 언어를 선택할 수 있습니다.
- 언어는 자바, 파이썬, C++ 를 지원합니다.

![Untitled](images/Untitled%207.png)

### 매칭 화면

- 배틀 모드, 언어, mmr 에 맞는 상대방을 매칭합니다.
- 매칭을 중간에 취소할 수도 있습니다.

![Untitled](images/Untitled%208.png)

### 밴 문제 선택

- 밴 할 문제를 선택할 수 있습니다.
- 선택하지 않을 경우 문제가 랜덤하게 선택됩니다.

![Untitled](images/Untitled%209.png)

### 배틀 이동 화면

- 배틀 화면으로 이동합니다.
- 10 초의 타이머가 지난 후 배틀 화면으로 이동합니다.

![Untitled](images/Untitled%2010.png)

### 배틀 문제 제출 화면

- 배틀 문제 제출 화면입니다.
- 문제를 제출하면 정답 여부를 확인할 수 있습니다.
- 문제를 제출 여부를 상대방이 확인할 수 있습니다.

![Untitled](images/Untitled%2011.png)

### 배틀 결과 화면

- 배틀 결과 화면입니다.
- 승리, 패배, 무승부 시 해당하는 메시지가 화면에 나타납니다.

![Untitled](images/Untitled%2012.png)

![Untitled](images/Untitled%2013.png)

![Untitled](images/Untitled%2014.png)

### 마이페이지

- 사용자의 정보를 확인할 수 있는 마이페이지 입니다.
- 사용자의 프로필 이미지, 닉네임, 레벨이 표시됩니다.
- 모드별 티어와 mmr 정보, 티어 진척도를 확인할 수 있습니다.
- 현재 시즌 배틀 전적을 모드별로 확인할 수 있습니다.
- 지난 시즌 배틀 기록을 확인할 수 있습니다.

![Untitled](images/Untitled%2015.png)

![Untitled](images/Untitled%2016.png)

### 랭킹

- 배틀 랭킹을 모드별로 확인할 수 있습니다.
- 자신의 현재 랭킹은 최상단에 위치하게 됩니다.

![Untitled](images/Untitled%2017.png)
