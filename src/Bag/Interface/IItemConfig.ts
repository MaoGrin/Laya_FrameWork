export interface IItemConfig {
    id: number;          // 物品ID
    name: string;        // 物品名称
    icon: string;        // 物品图片
    kind: number;        // 物品类型 1.装备 2.道具 3.材料...
    stackable: boolean;  // 是否可堆叠（false = 装备/带随机属性，每件一格）
    maxStack: number;    // 最大堆叠数（stackable=true 时有效；不可堆叠恒为 1）
}
