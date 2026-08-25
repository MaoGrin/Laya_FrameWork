import { ItemStack } from "./ItemStack";

/**
 * 格子：容器里最小的存储单元，最多放一个物品栈（空格则 stack = null）
 *
 * 格子有两种"不可用"状态要区分：
 * - locked：未解锁（背包扩容前的位置不可用）
 * - allowKinds：槽位级类型过滤（装备槽按部位只收对应装备），与 locked 无关
 */
export class Slot {
    index: number;              // 序号（从 0 开始）
    locked: boolean;            // 是否锁定（未解锁，不可用）
    allowKinds: number[] | null;// 槽位级物品类型过滤：null/空 = 不限（装备槽按部位限制）
    stack: ItemStack | null;    // 当前物品栈；null = 空格

    constructor(index: number, locked = false, allowKinds: number[] | null = null) {
        this.index = index;
        this.locked = locked;
        this.allowKinds = allowKinds;
        this.stack = null;
    }

    get isEmpty(): boolean {
        return this.stack === null;
    }
}
