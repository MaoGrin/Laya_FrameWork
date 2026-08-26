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
export abstract class BaseView extends Laya.Script {
    /** 取直接子节点并按类型断言 */
    protected child<T extends Laya.Node>(name: string): T {
        return this.owner.getChildByName(name) as T;
    }

    /** 取子节点上挂的脚本组件 */
    protected childScript<T extends Laya.Component>(name: string, ctor: new () => T): T {
        const node = this.owner.getChildByName(name);
        return node ? node.getComponent(ctor) : null;
    }

    onAwake(): void {
        this.initData();
        this.initUI();
        this.addClick();
        this.addEvent();
    }

    public initData(): void {

    }

    public initUI(): void {

    }

    public addClick(): void {

    }

    public addEvent(): void {

    }

    public refresh(): void {

    }


}
