import { IConfigProvider } from "../Interface/IConfigProvider";
import { IItemConfig } from "../Interface/IItemConfig";
import { IContainerConfig } from "../Interface/IContainerConfig";

/**
 * 配置门面：全局唯一配置入口。
 *
 * Model / Service 只依赖 Config 取配置，不关心配置来自哪里；
 * 启动时 setProvider 注入一次即可，测试用 BagTestData.install()。
 */
export class Config {
    private static _provider: IConfigProvider | null = null;

    static setProvider(provider: IConfigProvider | null): void {
        Config._provider = provider;
    }

    static getItemCfg(id: number): IItemConfig | null {
        return Config._provider ? Config._provider.getItemCfg(id) : null;
    }

    static getContainerCfg(id: number): IContainerConfig | null {
        return Config._provider ? Config._provider.getContainerCfg(id) : null;
    }
}
