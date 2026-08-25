"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const Slot_1 = require("./Slot");
const ItemStack_1 = require("./ItemStack");
/**
 * Container 容器：一份独立的、实例级的物品存储。
 *
 * 设计要点（对齐现代主流手游）：
 * 1. 容器是"实例"，不是全局单例——同一玩家可同时拥有 背包/装备栏/仓库/临时容器 多个实例，
 *    由 uid 区分；全局层只负责"注册/查找容器"，而不是装物品。
 * 2. 职责边界清晰：Container 只做「数据 + 查询 + 格子原语 + 扩容 + 序列化」；
 *    增删改的"业务规则"（堆叠合并、容量/类型校验、事件派发）交给 BagService，
 *    这样背包、装备栏、仓库都能复用同一套 Slot 操作，规则各自可调。
 * 3. 容量可扩容：预分配 maxCapacity 个格子，超过 baseCapacity 的标记 locked，
 *    expand() 逐格解锁——背包扩容这个付费点只是解锁格子的动作。
 * 4. 双重类型过滤：容器级 allowItemKinds（如材料仓库只收材料）
 *    + 槽位级 allowKinds（装备槽按部位），canAccept() 统一判定。
 * 5. 变更追踪：每次原语变更 _version++（UI/同步判断）、_dirty=true（存档判断）。
 *
 * 注意：直接改 slots 里的字段不会更新 version/dirty，请一律走 setSlot/clearSlot/swapSlot。
 */
class Container {
    constructor(uid, cfg, ownerId = 0) {
        this.uid = uid;
        this.cfgId = cfg.id;
        this.cfg = cfg;
        this.ownerId = ownerId;
        this._unlocked = cfg.baseCapacity;
        this._version = 0;
        this._dirty = false;
        this._slots = [];
        for (let i = 0; i < cfg.maxCapacity; i++) {
            // 超过 baseCapacity 的格子先锁定，扩容时解锁
            this._slots.push(new Slot_1.Slot(i, i >= cfg.baseCapacity));
        }
    }
    // ==================== 只读查询 ====================
    get type() { return this.cfg.type; }
    /** 当前可用格数（已解锁） */
    get capacity() { return this._unlocked; }
    get maxCapacity() { return this.cfg.maxCapacity; }
    get version() { return this._version; }
    get dirty() { return this._dirty; }
    /** 所有格子（含未解锁），只读视角；变更请走原语方法 */
    get slots() { return this._slots; }
    /** 已解锁的格子 */
    get unlockedSlots() {
        return this._slots.filter(s => !s.locked);
    }
    /** 空格数量 */
    get emptyCount() {
        let n = 0;
        for (const s of this._slots)
            if (!s.locked && s.isEmpty)
                n++;
        return n;
    }
    get isFull() { return this.emptyCount === 0; }
    getSlot(index) {
        return this._slots[index] ?? null;
    }
    /** 第一个空格（用于放新物品） */
    getEmptySlot() {
        return this._slots.find(s => !s.locked && s.isEmpty) ?? null;
    }
    /** 统计某物品在本容器的总数量（含所有堆叠） */
    getItemCount(itemId) {
        let n = 0;
        for (const s of this._slots) {
            if (!s.locked && s.stack && s.stack.itemId === itemId)
                n += s.stack.count;
        }
        return n;
    }
    /** 查找可继续堆叠的同物品格子（是否满堆由 Service 结合 maxStack 判断） */
    findStackableSlot(itemId) {
        return this._slots.find(s => !s.locked && s.stack && s.stack.itemId === itemId) ?? null;
    }
    /** 查找某物品所在的第一个格子 */
    findItemSlot(itemId) {
        return this.findStackableSlot(itemId);
    }
    /** 容器 + 槽位 是否接受某 kind 的物品（双重过滤） */
    canAccept(kind, slot) {
        const c = this.cfg.allowItemKinds;
        if (c && c.length > 0 && c.indexOf(kind) < 0)
            return false;
        if (slot) {
            const s = slot.allowKinds;
            if (s && s.length > 0 && s.indexOf(kind) < 0)
                return false;
        }
        return true;
    }
    // ==================== 变更原语（只保证结构正确，业务规则由 Service 前置校验） ====================
    /** 直接把物品栈放进指定格子（覆盖旧值） */
    setSlot(index, stack) {
        const slot = this._slots[index];
        if (!slot || slot.locked)
            return false;
        slot.stack = stack;
        this._changed();
        return true;
    }
    /** 清空指定格子，返回被移除的物品栈 */
    clearSlot(index) {
        const slot = this._slots[index];
        if (!slot || slot.locked)
            return null;
        const old = slot.stack;
        slot.stack = null;
        this._changed();
        return old;
    }
    /** 交换两个格子的物品 */
    swapSlot(a, b) {
        const sa = this._slots[a];
        const sb = this._slots[b];
        if (!sa || !sb || sa.locked || sb.locked)
            return false;
        const t = sa.stack;
        sa.stack = sb.stack;
        sb.stack = t;
        this._changed();
        return true;
    }
    /** 供 Service 直接修改格内堆叠数量（如合并）后，手动触发变更追踪 */
    markChanged() {
        this._changed();
    }
    // ==================== 扩容 ====================
    /** 扩容到目标格数（不超过 maxCapacity） */
    expand(targetCapacity) {
        if (targetCapacity <= this._unlocked)
            return false;
        const n = Math.min(targetCapacity, this.cfg.maxCapacity);
        for (let i = this._unlocked; i < n; i++) {
            this._slots[i].locked = false;
        }
        this._unlocked = n;
        this._changed();
        return true;
    }
    // ==================== 序列化 ====================
    /** 序列化为可存档/可下发的纯数据（只存非空格） */
    serialize() {
        const items = [];
        for (const s of this._slots) {
            if (!s.locked && s.stack) {
                items.push({ index: s.index, stack: s.stack });
            }
        }
        return {
            uid: this.uid,
            cfgId: this.cfgId,
            ownerId: this.ownerId,
            unlocked: this._unlocked,
            items,
        };
    }
    /** 从存档/服务器数据回填 */
    deserialize(data) {
        if (!data)
            return;
        this._unlocked = data.unlocked ?? this._unlocked;
        // 先重置所有格子
        for (const s of this._slots) {
            s.locked = s.index >= this._unlocked;
            s.stack = null;
        }
        if (Array.isArray(data.items)) {
            for (const it of data.items) {
                const slot = this._slots[it.index];
                if (slot && !slot.locked && it.stack) {
                    slot.stack = new ItemStack_1.ItemStack(it.stack.itemId, it.stack.count, it.stack.uuid, it.stack.attrs);
                }
            }
        }
        this._version = 0;
        this._dirty = false;
    }
    // ==================== 内部 ====================
    _changed() {
        this._version++;
        this._dirty = true;
    }
    /** 保存/同步完成后清除脏标记 */
    markSaved() {
        this._dirty = false;
    }
}
exports.Container = Container;
