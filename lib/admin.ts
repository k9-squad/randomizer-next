import { sql } from "./db";

/**
 * 检查用户是否为管理员
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT 1 FROM admins WHERE user_id = ${userId}
    `;
    return result.length > 0;
  } catch (error) {
    console.error("检查管理员权限失败:", error);
    return false;
  }
}

/**
 * 检查用户邮箱是否为管理员
 */
export async function isAdminEmail(email: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT 1 FROM admins a
      JOIN users u ON a.user_id = u.id
      WHERE u.email = ${email}
    `;
    return result.length > 0;
  } catch (error) {
    console.error("检查管理员邮箱失败:", error);
    return false;
  }
}
