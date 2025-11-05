import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * GET /api/community/categories
 * 获取所有分类及其项目数量
 */
export async function GET() {
  try {
    // 预定义的分类列表
    const categories = [
      "随机选择",
      "团队分组",
      "抽奖活动",
      "决策工具",
      "游戏娱乐",
      "教育学习",
      "工作效率",
      "其他",
    ];

    // 查询每个分类的项目数量
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const result = await sql`
          SELECT COUNT(*) as count
          FROM projects
          WHERE is_public = true
          AND category = ${category}
        `;
        return {
          name: category,
          count: parseInt(result[0].count) || 0,
        };
      })
    );

    return NextResponse.json(categoryCounts);
  } catch (error) {
    console.error("获取分类统计失败:", error);
    return NextResponse.json(
      { error: "获取分类统计失败" },
      { status: 500 }
    );
  }
}
