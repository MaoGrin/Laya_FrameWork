"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
/**
 * 配置门面：全局唯一配置入口。
 *
 * Model / Service 只依赖 Config 取配置，不关心配置来自哪里；
 * 启动时 setProvider 注入一次即可，测试用 BagTestData.install()。
 */
class Config {
    static setProvider(provider) {
        Config._provider = provider;
    }
    static getItemCfg(id) {
        return Config._provider ? Config._provider.getItemCfg(id) : null;
    }
    static getContainerCfg(id) {
        return Config._provider ? Config._provider.getContainerCfg(id) : null;
    }
}
exports.Config = Config;
Config._provider = null;
