import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import os from 'os';

// .env 파일 로드
dotenv.config();

// ES 모듈에서 __dirname 얻기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 설정 객체
const config = {
  // Notion API 설정
  notion: {
    token: process.env.NOTION_TOKEN,
    pageId: process.env.NOTION_PAGE_ID || '1ca2394e-5e9d-80b9-8d1b-f3a9b2ff1312',
  },
  
  // 폴더 경로 설정
  folders: {
    daejong: process.env.DAEJONG_FOLDER_PATH || path.join(os.homedir(), 'Desktop', '대종경'),
  },
  
  // 장별 제목 매핑 (한국어 및 한자)
  chapterTitles: {
    '1장 서품': { title: '서품', hanja: '序品' },
    '2장 교의품': { title: '교의품', hanja: '教義品' },
    '3장 수행품': { title: '수행품', hanja: '修行品' },
    '4장 인도품': { title: '인도품', hanja: '人道品' },
    '5장 인과품': { title: '인과품', hanja: '因果品' },
    '6장 변의품': { title: '변의품', hanja: '辨疑品' },
    '7장 성리품': { title: '성리품', hanja: '性理品' },
    '8장 불지품': { title: '불지품', hanja: '佛智品' },
    '9장 천도품': { title: '천도품', hanja: '天道品' },
    '10장 신성품': { title: '신성품', hanja: '神聖品' },
    '11장 요훈품': { title: '요훈품', hanja: '要訓品' },
    '12장 실시품': { title: '실시품', hanja: '實施品' },
    '13장 교단품': { title: '교단품', hanja: '敎團品' },
    '14장 전망품': { title: '전망품', hanja: '展望品' },
    '15장 부촉품': { title: '부촉품', hanja: '付囑品' },
  },
  
  // API 속도 제한 방지용 타임아웃 (ms)
  timeouts: {
    betweenItems: 350,   // 항목 추가 사이 지연
    betweenChapters: 1000, // 장 처리 사이 지연
  }
};

export default config;