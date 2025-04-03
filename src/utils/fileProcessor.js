import fs from 'fs';
import path from 'path';

/**
 * JSON 파일 내용을 파싱하여 객체로 변환
 * @param {string} filePath - JSON 파일 경로
 * @returns {Object} 파싱된 데이터 객체
 */
export const parseJsonFile = (filePath) => {
  try {
    // 파일 내용 읽기
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // JSON 파일을 객체로 파싱
    const jsonObj = {};
    const lines = fileContent.split('\n');
    
    let currentKey = null;
    let currentJson = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // 키 식별 패턴: "daejong0101": 
      const keyMatch = trimmedLine.match(/^"([^"]+)":/);
      
      if (keyMatch) {
        // 이전 JSON 데이터가 있으면 저장
        if (currentKey && currentJson) {
          try {
            jsonObj[currentKey] = JSON.parse(currentJson);
          } catch (e) {
            console.error(`${currentKey} 파싱 오류:`, e.message);
          }
        }
        
        // 새 키 설정
        currentKey = keyMatch[1];
        // 키 이후의 JSON 내용 시작
        currentJson = trimmedLine.substring(keyMatch[0].length).trim();
        
        // JSON 객체가 아니면 무시
        if (!currentJson.startsWith('{')) {
          currentKey = null;
          currentJson = '';
        }
      } else if (currentKey) {
        // 진행 중인 JSON에 라인 추가
        currentJson += trimmedLine;
      }
    }
    
    // 마지막 항목 처리
    if (currentKey && currentJson) {
      try {
        jsonObj[currentKey] = JSON.parse(currentJson);
      } catch (e) {
        console.error(`${currentKey} 파싱 오류:`, e.message);
      }
    }
    
    return jsonObj;
  } catch (error) {
    console.error(`파일 처리 오류 (${filePath}):`, error.message);
    return {};
  }
};

/**
 * 폴더에서 모든 대종경 JSON 파일 찾기
 * @param {string} folderPath - 폴더 경로
 * @returns {Array} 파일 목록 (장 번호 순으로 정렬)
 */
export const findJsonFiles = (folderPath) => {
  try {
    return fs.readdirSync(folderPath)
      .filter(file => 
        file.endsWith('.json') && 
        !file.startsWith('.') && 
        /\d+장/.test(file)
      )
      .sort((a, b) => {
        // 파일 이름에서 장 번호 추출하여 정렬
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
      });
  } catch (error) {
    console.error(`폴더 읽기 오류 (${folderPath}):`, error.message);
    return [];
  }
};

/**
 * HTML 태그와 특수 문자 제거
 * @param {string} htmlString - HTML 문자열
 * @returns {string} 정리된 문자열
 */
export const cleanHtmlContent = (htmlString) => {
  if (!htmlString) return '';
  
  return htmlString
    .replace(/&nbsp;/g, ' ')  // 공백 문자 처리
    .replace(/&lt;/g, '<')    // < 문자 처리
    .replace(/&gt;/g, '>')    // > 문자 처리
    .replace(/&amp;/g, '&')   // & 문자 처리
    .replace(/&quot;/g, '"')  // " 문자 처리
    .replace(/<[^>]*>/g, ''); // HTML 태그 제거
};