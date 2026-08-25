"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BagService = exports.BagOp = void 0;
const Config_1 = require("./Config");
const ItemStack_1 = require("./ItemStack");
/** 背包变更操作类型（事件用） */
var BagOp;
(function (BagOp) {
    BagOp["Add"] = "add";
    BagOp["Remove"] = "remove";
    BagOp["Move"] = "move";
    BagOp["Swap"] = "swap";
    BagOp["Sort"] = "sort";
})(BagOp || (exports.BagOp = BagOp = {}));
/**
 * BagService：背包业务逻辑（规则层）。
 *
 * 职责：堆叠合并、容量/类型校验、移动/交换/整理、事件派发。
 * Container 只提供"数据 + 格子原语"，所有"怎么放/怎么合并"的规则都在这里。
 */
class BagService {
    constructor() {
        this._listeners = [];
    }
    static get instance() {
        if (!this._instance)
            this._instance = new BagService();
        return this._instance;
    }
    /** 订阅变更（UI 刷新 / 存档标记） */
    on(listener) {
        this._listeners.push(listener);
    }
    off(listener) {
        const i = this._listeners.indexOf(listener);
        if (i >= 0)
            this._listeners.splice(i, 1);
    }
    emit(container, op, detail) {
        for (const l of this._listeners)
            l(container, op, detail);
    }
    /**
     * 放入物品：可堆叠的先合并到已有堆，放不下再占空格。
     * 返回实际放入数量与剩余数量。
     */
    addItem(container, item) {
        const cfg = Config_1.Config.getItemCfg(item.itemId);
        if (!cfg)
            return { success: false, added: 0, remain: item.count };
        // 容器级类型过滤（装备栏只收装备等）
        if (!container.canAccept(cfg.kind))
            return { success: false, added: 0, remain: item.count };
        let remain = item.count;
        // 1. 可堆叠：优先合并到已有堆
        if (cfg.stackable) {
            for (const slot of container.unlockedSlots) {
                if (!slot.stack || slot.stack.itemId !== item.itemId)
                    continue;
                if (slot.stack.count >= cfg.maxStack)
                    continue;
                const add = Math.min(cfg.maxStack - slot.stack.count, remain);
                slot.stack.count += add;
                remain -= add;
                if (remain <= 0)
                    break;
            }
        }
        // 2. 剩余占新格
        while (remain > 0) {
            const slot = container.getEmptySlot();
            if (!slot)
                break;
            const put = cfg.stackable ? Math.min(remain, cfg.maxStack) : 1;
            slot.stack = new ItemStack_1.ItemStack(item.itemId, put, item.uuid, item.attrs);
            remain -= put;
        }
        const added = item.count - remain;
        if (added > 0) {
            container.markChanged();
            this.emit(container, BagOp.Add, { itemId: item.itemId, added, remain });
        }
        return { success: remain === 0, added, remain };
    }
    /**
     * 移除指定物品数量（从后往前扣，扣空删除格子）。
     * 返回实际移除数量。
     */
    removeItem(container, itemId, count) {
        let remain = count;
        const slots = container.unlockedSlots;
        for (let i = slots.length - 1; i >= 0 && remain > 0; i--) {
            const slot = slots[i];
            if (!slot.stack || slot.stack.itemId !== itemId)
                continue;
            const take = Math.min(slot.stack.count, remain);
            slot.stack.count -= take;
            remain -= take;
            if (slot.stack.count <= 0)
                slot.stack = null;
        }
        const removed = count - remain;
        if (removed > 0) {
            container.markChanged();
            this.emit(container, BagOp.Remove, { itemId, removed, remain });
        }
        return removed;
    }
    /**
     * 移动：目标为空则移动；同物品可堆叠则合并；否则交换。
     */
    moveItem(container, fromIndex, toIndex) {
        const from = container.getSlot(fromIndex);
        const to = container.getSlot(toIndex);
        if (!from || !to || from.locked || to.locked || !from.stack)
            return false;
        const fromStack = from.stack;
        // 目标为空 → 移动
        if (!to.stack) {
            to.stack = fromStack;
            from.stack = null;
            container.markChanged();
            this.emit(container, BagOp.Move, { fromIndex, toIndex });
            return true;
        }
        // 同物品且可堆叠 → 合并
        const cfg = Config_1.Config.getItemCfg(fromStack.itemId);
        if (cfg && cfg.stackable && to.stack.itemId === fromStack.itemId) {
            const space = cfg.maxStack - to.stack.count;
            if (space > 0) {
                const move = Math.min(space, fromStack.count);
                to.stack.count += move;
                fromStack.count -= move;
                if (fromStack.count <= 0)
                    from.stack = null;
                container.markChanged();
                this.emit(container, BagOp.Move, { fromIndex, toIndex, merged: move });
                return true;
            }
        }
        // 否则交换
        from.stack = to.stack;
        to.stack = fromStack;
        container.markChanged();
        this.emit(container, BagOp.Swap, { fromIndex, toIndex });
        return true;
    }
    /** 交换两个格子 */
    swapItem(container, a, b) {
        if (!container.swapSlot(a, b))
            return false;
        this.emit(container, BagOp.Swap, { a, b });
        return true;
    }
    /**
     * 一键整理：可堆叠物品合并并按 itemId 升序排列到最前面；
     * 不可堆叠物品保留各自 uuid/attrs，仅按 itemId 排序。
     */
    sortItem(container) {
        const slots = container.unlockedSlots;
        const stackables = new Map(); // itemId -> 总数量
        const nonStackables = []; // 不可堆叠，保留实例
        for (const s of slots) {
            if (!s.stack)
                continue;
            const cfg = Config_1.Config.getItemCfg(s.stack.itemId);
            if (cfg && cfg.stackable) {
                stackables.set(s.stack.itemId, (stackables.get(s.stack.itemId) ?? 0) + s.stack.count);
            }
            else {
                nonStackables.push(s.stack);
            }
            s.stack = null;
        }
        const result = [];
        for (const [itemId, total] of stackables) {
            const cfg = Config_1.Config.getItemCfg(itemId);
            let n = total;
            while (n > 0) {
                const c = Math.min(n, cfg.maxStack);
                result.push(new ItemStack_1.ItemStack(itemId, c));
                n -= c;
            }
        }
        result.sort((a, b) => a.itemId - b.itemId);
        nonStackables.sort((a, b) => a.itemId - b.itemId);
        const all = result.concat(nonStackables);
        for (let i = 0; i < slots.length; i++) {
            slots[i].stack = i < all.length ? all[i] : null;
        }
        container.markChanged();
        this.emit(container, BagOp.Sort, null);
    }
}
exports.BagService = BagService;
