// 主题色工具函数

/**
 * 生成渐变色的起始颜色（26% 透明度）
 */
export function getGradientFrom(themeColor?: string): string {
  return themeColor
    ? `${themeColor}26`
    : "hsl(220 13% 69% / 0.15)";
}

/**
 * 生成渐变色的结束颜色（13% 透明度）
 */
export function getGradientTo(themeColor?: string): string {
  return themeColor
    ? `${themeColor}0d`
    : "hsl(220 13% 69% / 0.01)";
}

/**
 * 获取渐变色配置对象
 */
export function getGradientColors(themeColor?: string): {
  gradientFrom: string;
  gradientTo: string;
} {
  return {
    gradientFrom: getGradientFrom(themeColor),
    gradientTo: getGradientTo(themeColor),
  };
}
