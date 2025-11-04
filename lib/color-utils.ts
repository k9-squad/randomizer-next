// 将颜色转换为淡雅版本（降低饱和度和提高亮度）
export function getLighterColor(color: string): string {
  // 移除透明度部分
  let pureColor = color;
  if (color.startsWith("#")) {
    pureColor = color.substring(0, 7);
  } else if (color.includes("/")) {
    pureColor = color.split("/")[0].trim();
    if (!pureColor.endsWith(")")) {
      pureColor += ")";
    }
  }

  // 如果是 hex 格式，转换为 hsl 以便调整
  if (pureColor.startsWith("#")) {
    // 转换 hex 到 RGB
    const hex = pureColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // RGB 转 HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    // 降低饱和度到 40%，提高亮度到 65%
    h = Math.round(h * 360);
    s = 40;
    l = 65;

    return `hsl(${h} ${s}% ${l}%)`;
  }

  // 如果已经是 hsl 格式，直接调整
  if (pureColor.startsWith("hsl")) {
    const match = pureColor.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
    if (match) {
      const h = match[1];
      // 降低饱和度到 40%，提高亮度到 65%
      return `hsl(${h} 40% 65%)`;
    }
  }

  return pureColor;
}
