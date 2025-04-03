# 대종경 to Notion 컨버터

## 프로젝트 개요

이 Node.js 기반 스크립트는 대종경의 JSON 파일을 자동으로 Notion 데이터베이스로 변환하는 도구입니다. 대종경의 각 장을 Notion 페이지와 데이터베이스로 간편하게 변환할 수 있습니다.

## 🌟 주요 기능

- 대종경 JSON 파일 자동 읽기
- 장별 Notion 타이틀 자동 생성
- Notion 데이터베이스 자동 생성
- JSON 데이터를 Notion 데이터베이스에 추가

## 🔧 사전 요구 사항

- Node.js (버전 16.x 이상 권장)
- Notion API 토큰
- Notion 통합(Integration) 계정

## 📦 설치 및 설정

### 1. 저장소 클론
```bash
git clone https://github.com/gzzzdev/wonbupm2notion2.git
cd wonbupm2notion2
```

### 2. 종속성 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:
```
NOTION_TOKEN=your_notion_integration_token
NOTION_PAGE_ID=your_notion_parent_page_id
```

## 🚀 사용 방법

1. `data` 폴더에 대종경 JSON 파일들을 추가하세요.
2. 스크립트 실행:
```bash
npm start
```

## ⚙️ 고급 설정

`src/config.js` 파일에서 다음 설정을 조정할 수 있습니다:
- JSON 파일 폴더 경로
- Notion API 호출 사이 대기 시간

## 🛑 주의사항

- Notion API의 속도 제한을 고려하여 장 사이에 대기 시간을 두었습니다.
- 대규모 JSON 파일 처리 시 시간이 오래 걸릴 수 있습니다.

## 📝 문제 해결

- Notion 토큰의 유효성을 확인하세요.
- JSON 파일 형식이 올바른지 검증하세요.
- Notion 통합에 대상 페이지에 대한 접근 권한을 부여했는지 확인하세요.

## 🤝 기여 방법

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경 사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치 푸시 (`git push origin feature/AmazingFeature`)
5. 풀 리퀘스트 오픈

## 📄 라이선스

MIT 라이선스 - 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 💡 개발자

- GitHub: [gzzzdev](https://github.com/gzzzdev)

## 🙏 감사의 말

대종경 데이터 변환에 도움을 주신 모든 분들께 감사드립니다.
