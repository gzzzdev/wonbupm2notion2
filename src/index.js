import path from 'path';
import config from './config.js';
import { findJsonFiles, parseJsonFile } from './utils/fileProcessor.js';
import { 
  createChapterTitle, 
  createDatabase,
  addItemsToDatabase 
} from './services/notionService.js';

/**
 * 메인 함수 - 모든 대종경 장을 처리
 */
const main = async () => {
  console.log('===== 대종경 JSON을 Notion 데이터베이스로 변환하는 도구 =====');
  
  // Notion 토큰 확인
  if (!config.notion.token) {
    console.error('오류: Notion API 토큰이 설정되지 않았습니다.');
    console.error('환경 변수 NOTION_TOKEN을 설정하거나 .env 파일을 만들어 주세요.');
    process.exit(1);
  }
  
  // 폴더 경로 확인
  const daejongPath = config.folders.daejong;
  console.log(`대종경 폴더 경로: ${daejongPath}`);
  console.log(`Notion 페이지 ID: ${config.notion.pageId}`);
  
  try {
    // 폴더에서 모든 JSON 파일 가져오기
    const files = findJsonFiles(daejongPath);
    
    if (files.length === 0) {
      console.error(`오류: ${daejongPath}에서 대종경 JSON 파일을 찾을 수 없습니다.`);
      process.exit(1);
    }
    
    console.log(`처리할 JSON 파일 ${files.length}개 발견`);
    
    // 각 파일 처리
    for (const [index, file] of files.entries()) {
      const chapterKey = file.replace('.json', '');
      const chapterNum = chapterKey.split('장')[0].trim();
      
      console.log(`\n[${index + 1}/${files.length}] "${chapterKey}" 처리 중...`);
      
      // 장 제목 생성
      console.log('- 장 제목 생성 중...');
      await createChapterTitle(chapterKey);
      
      // 데이터베이스 생성
      console.log('- 데이터베이스 생성 중...');
      const dbId = await createDatabase(chapterKey);
      if (!dbId) {
        console.error(`  ${chapterKey}의 데이터베이스 생성 실패, 건너뜀`);
        continue;
      }
      
      // JSON 파일 처리
      console.log('- JSON 파일 처리 중...');
      const filePath = path.join(daejongPath, file);
      const jsonData = parseJsonFile(filePath);
      
      // 데이터베이스에 항목 추가
      console.log('- 데이터베이스에 항목 추가 중...');
      await addItemsToDatabase(jsonData, dbId);
      
      console.log(`"${chapterKey}" 처리 완료`);
      
      // API 속도 제한 방지
      if (index < files.length - 1) {
        console.log(`다음 장 처리 대기 중... (${config.timeouts.betweenChapters}ms)`);
        await new Promise(resolve => setTimeout(resolve, config.timeouts.betweenChapters));
      }
    }
    
    console.log('\n모든 처리가 완료되었습니다!');
    console.log('대종경 데이터가 성공적으로 Notion에 추가되었습니다.');
    
  } catch (error) {
    console.error('프로그램 실행 중 오류 발생:', error.message);
    process.exit(1);
  }
};

// 프로그램 실행
main().catch(error => {
  console.error('예상치 못한 오류 발생:', error);
  process.exit(1);
});