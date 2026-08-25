import { IItemConfig } from "./IItemConfig";
import { IContainerConfig } from "./IContainerConfig";

/**
 * 配置数据源接口。
 *
 * 真实项目由 Luban / JSON / Proto 加载后实现本接口并注入 Config；
 * 测试阶段用 BagTestData 作为其中一个实现。这样 Model 层不再硬编码数据源。
 */
export interface IConfigProvider {
    getItemCfg(id: number): IItemConfig | null;
    getContainerCfg(id: number): IContainerConfig | null;
}
