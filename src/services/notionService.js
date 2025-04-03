import { Client } from '@notionhq/client';
import config from '../config.js';
import { cleanHtmlContent } from '../utils/fileProcessor.js';

// Notion API 클라이언트 초기화
const notion = new Client({
  auth: config.notion.token,
});

/**
 * 지연 함수 - API 속도 제한 방지용
 * @param {number} ms - 지연 시간(밀리초)
 * @returns {Promise} 지연 Promise
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 대종경 장별 제목 및 설명 생성
 * @param {string} chapterKey - 장 키 (예: "1장 서품")
 * @returns {Promise<string>} - 생성된 블록의 ID
 */
export const createChapterTitle = async (chapterKey) => {
  const chapter = config.chapterTitles[chapterKey];
  
  if (!chapter) {
    console.error(`알 수 없는 장 키: ${chapterKey}`);
    return null;
  }
  
  const chapterNum = chapterKey.split('장')[0].trim();
  const fullTitle = `제${chapterNum} ${chapter.title}(${chapter.hanja})`;
  const description = `대종경의 ${chapterNum} 번째 장으로, ${chapter.title}(${chapter.hanja})에 관한 내용을 담고 있습니다.`;
  
  try {
    const response = await notion.blocks.children.append({
      block_id: config.notion.pageId,
      children: [
        {
          object: "block",
          type: "heading_1",
          heading_1: {
            rich_text: [{ type: "text", text: { content: fullTitle } }]
          }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: description } }]
          }
        }
      ],
    });
    
    return response.results[0].id;
  } catch (error) {
    console.error(`장 제목 생성 중 오류:`, error.message);
    return null;
  }
};

/**
 * 대종경 데이터베이스 생성
 * @param {string} chapterKey - 장 키 (예: "1장 서품")
 * @returns {Promise<string>} - 생성된 데이터베이스의 ID
 */
export const createDatabase = async (chapterKey) => {
  const chapter = config.chapterTitles[chapterKey];
  
  if (!chapter) {
    console.error(`알 수 없는 장 키: ${chapterKey}`);
    return null;
  }
  
  const chapterNum = chapterKey.split('장')[0].trim();
  const dbTitle = `제${chapterNum} ${chapter.title}(${chapter.hanja}) 데이터베이스`;
  
  try {
    const response = await notion.databases.create({
      parent: {
        type: "page_id",
        page_id: config.notion.pageId
      },
      title: [
        {
          type: "text",
          text: {
            content: dbTitle
          }
        }
      ],
      properties: {
        "장": {
          title: {}
        },
        "내용": {
          rich_text: {}
        },
        "색인": {
          rich_text: {}
        },
        "대종경": {
          rich_text: {}
        }
      }
    });
    
    return response.id;
  } catch (error) {
    console.error(`데이터베이스 생성 오류:`, error.message);
    return null;
  }
};

/**
 * JSON 객체에서 추출한 항목을 Notion 데이터베이스에 추가
 * @param {Object} jsonData - 파싱된 JSON 데이터
 * @param {string} databaseId - Notion 데이터베이스 ID
 */
export const addItemsToDatabase = async (jsonData, databaseId) => {
  if (!jsonData || Object.keys(jsonData).length === 0) {
    console.error('유효한 데이터가 없습니다.');
    return;
  }
  
  // 항목들을 배열로 변환
  const entries = Object.entries(jsonData);
  console.log(`총 ${entries.length}개 항목 발견`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [index, entry] of entries.entries()) {
    const [key, value] = entry;
    
    if (!value || typeof value !== 'object') continue;
    if (!value.contents || !value.chapter_title) continue;
    
    // HTML 태그 및 특수 문자 제거
    const content = cleanHtmlContent(value.contents);
    
    try {
      // Notion API 제한 때문에 텍스트 길이 제한
      const truncatedContent = content.length > 2000 
        ? content.slice(0, 1997) + '...'
        : content;
      
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          "장": {
            title: [{ text: { content: value.chapter_title } }]
          },
          "내용": {
            rich_text: [{ text: { content: truncatedContent } }]
          },
          "색인": {
            rich_text: [{ text: { content: key } }]
          },
          "대종경": {
            rich_text: [{ 
              text: { 
                content: `대종경 ${value.volume_title?.replace('제', '') || ''} ${value.chapter_title}` 
              } 
            }]
          }
        }
      });
      
      console.log(`[${index + 1}/${entries.length}] 항목 추가됨: ${key}`);
      successCount++;
      
      // API 속도 제한 방지
      await delay(config.timeouts.betweenItems);
    } catch (error) {
      console.error(`[${index + 1}/${entries.length}] 항목 추가 실패 (${key}):`, error.message);
      errorCount++;
      
      // 오류 시 더 긴 지연
      await delay(config.timeouts.betweenItems * 2);
    }
  }
  
  console.log(`처리 완료: ${successCount}개 성공, ${errorCount}개 실패`);
};