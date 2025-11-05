// 字符长度限制常量
export const INPUT_LIMITS = {
  // 项目相关
  PROJECT_NAME: 50,           // 项目名称
  PROJECT_DESCRIPTION: 200,   // 项目描述
  LOCATION_TEXT: 100,         // 位置文本
  
  // 标签和分类
  TAG: 20,                    // 单个标签
  TAG_COUNT: 10,              // 最多标签数
  CATEGORY: 30,               // 分类名称
  
  // 抽奖池相关
  POOL_ITEM: 100,             // 单个抽奖项
  ROTATOR_LABEL: 30,          // 轮换位标签
  
  // 分组相关
  MEMBER_NAME: 50,            // 成员名称
  GROUP_NAME: 30,             // 组名
  
  // 用户相关
  USER_NAME: 50,              // 用户名
  EMAIL: 100,                 // 邮箱
  
  // 图标相关
  IMAGE_URL: 500,             // 图片 URL
} as const;

// 验证函数
export function validateLength(
  value: string,
  maxLength: number,
  fieldName: string
): { valid: boolean; error?: string } {
  if (value.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName}不能超过 ${maxLength} 个字符（当前 ${value.length} 个）`,
    };
  }
  return { valid: true };
}

// 截断文本
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength);
}
