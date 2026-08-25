"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerType = void 0;
/**
 * 容器类型枚举
 *
 * 现代主流手游里，玩家的各类存储统一抽象成 Container，用 type 区分行为，
 * 而不是给"背包/装备栏/仓库"各写一套代码。
 */
var ContainerType;
(function (ContainerType) {
    /** 背包：随身主物品栏，格数可变、可扩容、可一键整理 */
    ContainerType[ContainerType["Bag"] = 1] = "Bag";
    /** 装备栏：固定槽位，每个槽位按部位绑定（武器/衣服/首饰…） */
    ContainerType[ContainerType["Equipment"] = 2] = "Equipment";
    /** 仓库/银行：长期存储，容量大、通常不可随身整理 */
    ContainerType[ContainerType["Warehouse"] = 3] = "Warehouse";
    /** 货币：无实体格子，纯数值（金币/钻石/代币），通常交给钱包而非背包 */
    ContainerType[ContainerType["Currency"] = 4] = "Currency";
    /** 临时容器：掉落预览 / 交易窗口 / 邮件附件 / 合成材料槽 */
    ContainerType[ContainerType["Temporary"] = 5] = "Temporary";
})(ContainerType || (exports.ContainerType = ContainerType = {}));
