/**
 * 物品栈：一个格子里存放的运行时物品状态
 *
 * 这一层用来解决之前 "uuid 与 num 混用" 的问题，规则只有一条：
 * - 可堆叠物品（消耗品/材料）：count = 堆叠数量，uuid = 0，attrs = null
 * - 不可堆叠物品（装备/带随机属性）：count 恒为 1，uuid = 唯一实例id，attrs = 随机属性/耐久
 *
 * "是否可堆叠"由 ItemConfig.stackable 决定，本类只存状态、不查配置。
 * 它取代原来的 IItemData + ItemInstance（二者职责重叠且堆叠语义矛盾）。
 */
export class ItemStack {
    itemId: number;     // 物品配置id
    count: number;      // 堆叠数量（不可堆叠恒为 1）
    uuid: number;       // 实例唯一id（不可堆叠物品用；可堆叠为 0）
    attrs: any;         // 实例属性（强化/耐久/随机词条；可堆叠为 null）

    constructor(itemId: number, count = 1, uuid = 0, attrs: any = null) {
        this.itemId = itemId;
        this.count = count;
        this.uuid = uuid;
        this.attrs = attrs;
    }

    clone(): ItemStack {
        return new ItemStack(this.itemId, this.count, this.uuid, this.attrs);
    }
}
