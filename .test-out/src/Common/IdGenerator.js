"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdGenerator = void 0;
/**
 * 全局自增 ID 生成器（单例，框架级通用工具，不局限于背包系统）。
 *
 * 用途：为需要唯一标识的对象生成 id（装备实例、实体、临时对象等）。
 *
 * 使用注意：
 * 1. 纯客户端内存自增，只保证「进程内唯一」；重启后会从初始值重新开始。
 * 2. 联网游戏里，跨端/需持久化的重要实例 id 应由服务器下发；
 *    客户端生成的 id 只用于本地临时对象，或与服务端约定不同的起始区间避免冲突。
 * 3. 若 id 需要随存档持久化（例如装备实例），存档时应一并保存计数器，
 *    读档后用 resetTo(上次最大值 + 1) 恢复，避免 id 被复用。
 */
class IdGenerator {
    static get instance() {
        if (!this._instance)
            this._instance = new IdGenerator();
        return this._instance;
    }
    constructor() {
        this._next = 1;
    }
    /** 生成下一个唯一 id（自增） */
    next() {
        return this._next++;
    }
    /** 重置计数器到指定值（读档时传「上次最大值 + 1」） */
    resetTo(start) {
        this._next = start;
    }
    /** 当前已分配到的下一个值（存档计数器时用） */
    get current() {
        return this._next;
    }
}
exports.IdGenerator = IdGenerator;
