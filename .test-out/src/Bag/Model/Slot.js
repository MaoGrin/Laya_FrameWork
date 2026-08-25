"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
/**
 * 格子：容器里最小的存储单元，最多放一个物品栈（空格则 stack = null）
 *
 * 格子有两种"不可用"状态要区分：
 * - locked：未解锁（背包扩容前的位置不可用）
 * - allowKinds：槽位级类型过滤（装备槽按部位只收对应装备），与 locked 无关
 */
class Slot {
    constructor(index, locked = false, allowKinds = null) {
        this.index = index;
        this.locked = locked;
        this.allowKinds = allowKinds;
        this.stack = null;
    }
    get isEmpty() {
        return this.stack === null;
    }
}
exports.Slot = Slot;
