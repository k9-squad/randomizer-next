import { Group } from "@/types/project";

/**
 * 智能分组算法
 * 确保成员数量均匀分配，并且每个组等概率获得额外成员
 * 
 * @param members 成员列表
 * @param groupCount 分组数量
 * @param existingGroups 现有的组配置（可选，用于保留自定义组名）
 * @returns 分组结果
 * 
 * 算法原理：
 * 1. 打乱成员顺序（Fisher-Yates洗牌算法）
 * 2. 计算基础人数：floor(成员总数 / 组数)
 * 3. 计算余数：成员总数 % 组数
 * 4. 随机选择余数个组，每组多分配1人
 * 5. 按顺序分配成员到各组
 */
export function distributeMembers(
  members: string[],
  groupCount: number,
  existingGroups?: Group[]
): Group[] {
  if (groupCount <= 0) {
    throw new Error("分组数量必须大于0");
  }

  if (members.length < groupCount) {
    throw new Error("成员数量不能少于分组数量");
  }

  // 1. 打乱成员顺序
  const shuffledMembers = shuffleArray([...members]);

  // 2. 计算每组基础人数和余数
  const baseSize = Math.floor(members.length / groupCount);
  const remainder = members.length % groupCount;

  // 3. 随机选择哪些组会多分配1人（确保等概率）
  const groupsWithExtraMember = shuffleArray(
    Array.from({ length: groupCount }, (_, i) => i)
  ).slice(0, remainder);

  // 4. 计算每组实际人数
  const groupSizes = Array.from({ length: groupCount }, (_, i) => 
    baseSize + (groupsWithExtraMember.includes(i) ? 1 : 0)
  );

  // 5. 分配成员到各组
  const groups: Group[] = [];
  let memberIndex = 0;

  for (let i = 0; i < groupCount; i++) {
    const groupMembers = shuffledMembers.slice(
      memberIndex,
      memberIndex + groupSizes[i]
    );
    
    // 尝试从现有组中获取自定义名称，否则使用默认名称
    const customName = existingGroups && existingGroups[i]?.name
      ? existingGroups[i].name
      : `第 ${i + 1} 组`;
    
    groups.push({
      id: i + 1,
      name: customName,
      members: groupMembers,
    });

    memberIndex += groupSizes[i];
  }

  return groups;
}

/**
 * Fisher-Yates 洗牌算法
 * 时间复杂度 O(n)，保证完全随机
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

/**
 * 验证分组是否合法（用于测试）
 */
export function validateGrouping(
  originalMembers: string[],
  groups: Group[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. 检查所有成员是否都被分配
  const allGroupMembers = groups.flatMap(g => g.members);
  const memberSet = new Set(originalMembers);
  const groupMemberSet = new Set(allGroupMembers);

  if (allGroupMembers.length !== originalMembers.length) {
    errors.push("分配的总人数与原始人数不符");
  }

  for (const member of originalMembers) {
    if (!groupMemberSet.has(member)) {
      errors.push(`成员 "${member}" 未被分配`);
    }
  }

  // 2. 检查是否有重复分配
  if (allGroupMembers.length !== groupMemberSet.size) {
    errors.push("存在重复分配的成员");
  }

  // 3. 检查人数分配是否均匀
  const groupSizes = groups.map(g => g.members.length);
  const minSize = Math.min(...groupSizes);
  const maxSize = Math.max(...groupSizes);

  if (maxSize - minSize > 1) {
    errors.push(
      `人数分配不均匀：最小 ${minSize} 人，最大 ${maxSize} 人`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证分组配置是否合法
 * 在创建或修改项目时调用
 */
export function validateGroupingConfig(
  members: string[],
  groupCount: number
): { valid: boolean; error?: string } {
  if (groupCount <= 0) {
    return {
      valid: false,
      error: "分组数量必须大于 0",
    };
  }

  if (members.length < groupCount) {
    return {
      valid: false,
      error: `成员数量（${members.length}）不能少于分组数量（${groupCount}）`,
    };
  }

  if (members.length === 0) {
    return {
      valid: false,
      error: "成员列表不能为空",
    };
  }

  // 检查是否有空成员名
  const emptyMembers = members.filter(m => !m || m.trim() === "");
  if (emptyMembers.length > 0) {
    return {
      valid: false,
      error: "成员名称不能为空",
    };
  }

  // 检查是否有重复成员名
  const uniqueMembers = new Set(members);
  if (uniqueMembers.size !== members.length) {
    return {
      valid: false,
      error: "成员名称不能重复",
    };
  }

  return { valid: true };
}
