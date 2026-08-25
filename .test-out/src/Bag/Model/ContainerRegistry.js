"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerRegistry = void 0;
/**
 * 容器注册中心：全局按 uid 管理所有 Container 实例。
 *
 * 取代旧 ItemManager（旧版是"装物品的全局字典"，这里只做"查找容器"）。
 * 物品本身存在 Container 的 Slot 里，不再散落在一个全局 Map 中。
 */
class ContainerRegistry {
    constructor() {
        this._containers = new Map();
    }
    static get instance() {
        if (!this._instance)
            this._instance = new ContainerRegistry();
        return this._instance;
    }
    register(container) {
        this._containers.set(container.uid, container);
    }
    unregister(uid) {
        this._containers.delete(uid);
    }
    get(uid) {
        return this._containers.get(uid) ?? null;
    }
    /** 某玩家/实体名下的所有容器（背包/装备栏/仓库…） */
    getByOwner(ownerId) {
        const out = [];
        for (const c of this._containers.values()) {
            if (c.ownerId === ownerId)
                out.push(c);
        }
        return out;
    }
}
exports.ContainerRegistry = ContainerRegistry;
