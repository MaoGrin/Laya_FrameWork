import { IConfigProvider } from "../Interface/IConfigProvider";
import { IItemConfig } from "../Interface/IItemConfig";
import { IContainerConfig } from "../Interface/IContainerConfig";
import { ContainerType } from "../Model/ContainerType";
import { Config } from "../Model/Config";

/**
 * 测试/演示用配置数据：实现 IConfigProvider，通过 Config.install 注入。
 *
 * 真实项目把这份数据替换成配置表加载结果即可，Model/Service 无需改动。
 */
export class BagTestData implements IConfigProvider {
    private static _instance: BagTestData;
    static get instance(): BagTestData {
        if (!this._instance) this._instance = new BagTestData();
        return this._instance;
    }

    /** 把本测试数据注册为全局配置源（测试入口调用一次即可） */
    static install(): BagTestData {
        Config.setProvider(BagTestData.instance);
        return BagTestData.instance;
    }

    private _items: Map<number, IItemConfig> = new Map();
    private _containers: Map<number, IContainerConfig> = new Map();

    private constructor() {
        this.initItems();
        this.initContainers();
    }

    private initItems(): void {
        // 不可堆叠：装备，每件一格
        this._items.set(1, { id: 1, name: "小刀", icon: "", kind: 1, stackable: false, maxStack: 1 });
        // 可堆叠：道具 / 材料
        this._items.set(2, { id: 2, name: "红药水", icon: "", kind: 2, stackable: true, maxStack: 99 });
        this._items.set(3, { id: 3, name: "铁矿石", icon: "", kind: 3, stackable: true, maxStack: 999 });
    }

    private initContainers(): void {
        // 背包：20 格起步，可扩容到 60，允许所有物品，支持整理
        this._containers.set(1001, {
            id: 1001, type: ContainerType.Bag, name: "背包",
            baseCapacity: 20, maxCapacity: 60, canExpand: true,
            allowItemKinds: null, allowSort: true, tabIds: [],
        });
        // 装备栏：6 格固定，只收装备(kind=1)
        this._containers.set(1002, {
            id: 1002, type: ContainerType.Equipment, name: "装备栏",
            baseCapacity: 6, maxCapacity: 6, canExpand: false,
            allowItemKinds: [1], allowSort: false, tabIds: [],
        });
    }

    getItemCfg(id: number): IItemConfig | null {
        return this._items.get(id) ?? null;
    }

    getContainerCfg(id: number): IContainerConfig | null {
        return this._containers.get(id) ?? null;
    }
}
