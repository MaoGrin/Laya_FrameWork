import { ContainerType } from "../Model/ContainerType";

/**
 * 容器静态配置（配置表一次性加载，运行期只读，不随存档变化）
 *
 * 与"运行时状态 Container"分离：同一份配置可被无数个容器实例复用。
 */
export interface IContainerConfig {
    id: number;                    // 配置id
    type: ContainerType;           // 容器类型
    name: string;                  // 显示名
    baseCapacity: number;          // 初始可用格数
    maxCapacity: number;           // 扩容后的最大格数（>= baseCapacity）
    canExpand: boolean;            // 是否支持扩容（背包扩容是手游常见付费点）
    /**
     * 容器级物品类型过滤：null 或空数组 = 不限；
     * 否则只允许这些 kind 的物品进入（例如"材料仓库"只收材料）。
     * 注意：装备栏的"按部位限制"更细，走槽位级 Slot.allowKinds。
     */
    allowItemKinds: number[] | null;
    allowSort: boolean;            // 是否支持"一键整理"
    tabIds: number[];              // 背包分页标签（全部/装备/材料/消耗品），纯 UI 过滤，可空
}
