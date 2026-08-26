"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseView = void 0;
/**
 * UI 脚本基类：收拢 getChildByName / getComponent 的样板代码。
 * 所有挂在 UI 预制体上的脚本继承它（BagPanel / BagList / BagItem ...）。
 *
 * 约定：
 * - child<T>()        取"子节点本身"（GButton / GList / GTextField 这类节点）
 * - childScript<T>()  取"子节点上挂的脚本"（BagList / BagItem 这类 Laya.Script）
 *
 * 说明：静态 UI 引用更推荐用 @property 在 IDE 里拖拽（序列化自动赋值）；
 * 这里的 child/childScript 用于动态内容，以及不想每次拖拽的快捷方式。
 */
class BaseView extends Laya.Script {
    /** 取直接子节点并按类型断言 */
    child(name) {
        return this.owner.getChildByName(name);
    }
    /** 取子节点上挂的脚本组件 */
    childScript(name, ctor) {
        const node = this.owner.getChildByName(name);
        return node ? node.getComponent(ctor) : null;
    }
    onAwake() {
        this.initData();
        this.initUI();
        this.addClick();
        this.addEvent();
    }
    initData() {
    }
    initUI() {
    }
    addClick() {
    }
    addEvent() {
    }
}
exports.BaseView = BaseView;
