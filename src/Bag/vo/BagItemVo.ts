import { IItemConfig } from "../Interface/IItemConfig";
import { Config } from "../Model/Config";

/**
 * 背包格子的视图模型（富 VO）。
 * 持有身份字段（uuid/itemId/slotIdx/count），并通过 getter 派生显示 / 校验所需信息。
 *
 * 注意：配置通过 Config 门面获取，而不是直接依赖 BagTestData，保持配置源可替换。
 */
export class BagItemVo {
    uuid: number;       // 实例id（不可堆叠装备用；可堆叠=0）
    count: number;      // 堆叠数量
    itemId: number;     // 物品配置id
    slotIndex: number;  // 对应 Container 里的格子下标（操作定位用）

    private cfg: IItemConfig;

    constructor(uuid: number, itemId: number, slotIndex: number, count: number) {
        this.uuid = uuid;
        this.count = count;
        this.itemId = itemId;
        this.slotIndex = slotIndex;
        this.cfg = Config.getItemCfg(itemId);
    }

    get name(): string {
        return this.cfg ? this.cfg.name : "未知物品(id=" + this.itemId + ")";
    }

    get icon(): string {
        return this.cfg ? this.cfg.icon : "";
    }

    /** 列表里显示的文本（含堆叠数），显示逻辑收进 VO，BagItem 直接取用 */
    get displayName(): string {
        return this.count > 1 ? this.name + " x" + this.count : this.name;
    }

    // ---- 校验 / 判定用的派生字段（后续点击/使用/拖拽都能从 VO 拿到） ----
    get isStackable(): boolean { return this.cfg ? this.cfg.stackable : false; }
    get maxStack(): number { return this.cfg ? this.cfg.maxStack : 1; }
    get kind(): number { return this.cfg ? this.cfg.kind : 0; }
    get isEquip(): boolean { return this.kind === 1; }
}
