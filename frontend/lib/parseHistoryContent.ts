/**
 * 歴代主将ページの本文HTMLを解析
 * 見出しベースで主将名、メンバー、大会成績、画像を抽出
 */

export interface ParsedHistoryContent {
  captainName: string;
  memberList: string;
  battleRecords: string;
  images: string[];
  year: string; // タイトルから抽出した年度
  errors: string[]; // エラーメッセージ
}

/**
 * 本文HTMLから画像URLを抽出
 */
function extractImages(html: string): string[] {
  const images: string[] = [];
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }
  
  return images;
}

/**
 * HTMLから画像タグを削除
 */
function removeImages(html: string): string {
  let cleanHtml = html;
  
  // <figure class="wp-block-image">...</figure> を削除
  cleanHtml = cleanHtml.replace(/<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>[\s\S]*?<\/figure>/gi, '');
  
  // 画像を含む<p>タグを削除
  cleanHtml = cleanHtml.replace(/<p[^>]*>\s*<img[^>]*>\s*<\/p>/gi, '');
  
  // 残った<img>タグを削除
  cleanHtml = cleanHtml.replace(/<img[^>]*>/gi, '');
  
  // 連続する空の<p>タグを削除
  cleanHtml = cleanHtml.replace(/(<p[^>]*>\s*<\/p>\s*)+/gi, '');
  
  return cleanHtml;
}

/**
 * 先頭に付与されている中黒(・)を除去
 */
function removeLeadingMiddleDot(html: string): string {
  if (!html) return html;

  const bulletPattern = '(?:・|&middot;|&#12539;|&#183;|&bull;)';

  let result = html.replace(
    new RegExp(`(<(?:p|li|span|div)[^>]*>\\s*)${bulletPattern}\\s*`, 'gi'),
    '$1'
  );

  result = result.replace(
    new RegExp(`(<br\\s*/?>\\s*)${bulletPattern}\\s*`, 'gi'),
    '$1'
  );

  result = result.replace(new RegExp(`^\\s*${bulletPattern}\\s*`, 'i'), '');

  return result;
}

/**
 * WordPressのリスト構造を段落に変換して箇条書きの中黒を削除
 */
function normalizeMemberListStructure(html: string): string {
  if (!html) return html;

  let result = html;

  result = result.replace(/<ul[^>]*>/gi, '');
  result = result.replace(/<\/ul>/gi, '');
  result = result.replace(/<ol[^>]*>/gi, '');
  result = result.replace(/<\/ol>/gi, '');

  result = result.replace(/<li[^>]*>\s*/gi, '<p class="history-member-line">');
  result = result.replace(/\s*<\/li>/gi, '</p>');

  result = result.replace(/<p[^>]*>\s*<\/p>/gi, '');

  return result;
}

/**
 * タイトルから年度を抽出（例: "2008年度" → "2008"）
 */
function extractYear(title: string): string {
  const yearMatch = title.match(/(\d{4})/);
  return yearMatch ? yearMatch[1] : '';
}

/**
 * H2見出しとその内容を抽出
 */
function extractSection(html: string, headingText: string): string {
  // <h2>見出し</h2> の後ろから次のh2タグまで（または終端まで）を抽出
  const regex = new RegExp(
    `<h2[^>]*>${headingText}[^<]*<\/h2>\\s*([\\s\\S]*?)(?=<h2|$)`,
    'i'
  );
  const match = html.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * 歴代主将ページの本文を解析
 */
export function parseHistoryContent(
  html: string,
  pageTitle: string
): ParsedHistoryContent {
  const errors: string[] = [];
  
  // 1. 年度を抽出
  const year = extractYear(pageTitle);
  if (!year) {
    errors.push(`タイトル「${pageTitle}」から年度を抽出できませんでした。タイトルに4桁の年度を含めてください（例: 2008年度）`);
  }
  
  // 2. 画像を抽出
  const images = extractImages(html);
  
  // 3. 画像を削除したHTMLを作成
  const cleanHtml = removeImages(html);
  
  // 4. 各セクションを抽出
  const captainName = extractSection(cleanHtml, '主将');
  const memberListRaw = extractSection(cleanHtml, 'メンバー');
  const memberList = normalizeMemberListStructure(removeLeadingMiddleDot(memberListRaw));
  const battleRecords = extractSection(cleanHtml, '大会成績');
  
  // 5. 必須セクションのバリデーション
  if (!captainName) {
    errors.push('「主将」セクションが見つかりません。本文に <h2>主将</h2> を追加してください。');
  }
  
  if (!memberList) {
    errors.push('「メンバー」セクションが見つかりません。本文に <h2>メンバー</h2> を追加してください。');
  }
  
  if (!battleRecords) {
    errors.push('「大会成績」セクションが見つかりません。本文に <h2>大会成績</h2> を追加してください。');
  }
  
  return {
    captainName,
    memberList,
    battleRecords,
    images,
    year,
    errors,
  };
}


