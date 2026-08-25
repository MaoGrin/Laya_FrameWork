import { Container } from "./Container";

/**
 * 容器注册中心：全局按 uid 管理所有 Container 实例。
 *
 * 取代旧 ItemManager（旧版是"装物品的全局字典"，这里只做"查找容器"）。
 * 物品本身存在 Container 的 Slot 里，不再散落在一个全局 Map 中。
 */
export class ContainerRegistry {
    private static _instance: ContainerRegistry;
    static get instance(): ContainerRegistry {
        if (!this._instance) this._instance = new ContainerRegistry();
        return this._instance;
    }

    private _containers: Map<number, Container> = new Map();

    register(container: Container): void {
        this._containers.set(container.uid, container);
    }

    unregister(uid: number): void {
        this._containers.delete(uid);
    }

    get(uid: number): Container | null {
        return this._containers.get(uid) ?? null;
    }

    /** 某玩家/实体名下的所有容器（背包/装备栏/仓库…） */
    getByOwner(ownerId: number): Container[] {
        const out: Container[] = [];
        for (const c of this._containers.values()) {
            if (c.ownerId === ownerId) out.push(c);
        }
        return out;
    }
}
