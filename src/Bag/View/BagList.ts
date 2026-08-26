import { BaseView } from "./BaseView";
import { BagItem } from "./BagItem";
import { BagItemVo } from "../vo/BagItemVo";

const { regClass, property } = Laya;

/**
 * 背包列表（挂在 BagList 预制体根节点上）。
 * 内部引用一个 GList，用 itemRenderer + numItems 渲染。
 */
@regClass()
export class BagList extends BaseView {
    @property(Laya.GList)
    public list: Laya.GList = null;
    private _data: BagItemVo[] = [];

    public initUI(): void {
        this._initList();
    }

    /** GList 的渲染方式：itemRenderer 回调 + numItems 数量 */
    private _initList(): void {
        if (!this.list) return;
        this.list.itemRenderer = (index: number, item: any) => this._onRenderItem(index, item);
    }

    private _onRenderItem(index: number, item: any): void {
        const data = this._data[index];
        const cell = item.getComponent(BagItem);
        if (cell) cell.setData(data);
    }

    /** 对外接口：传入视图数据数组（由 BagPanel 调用） */
    setList(data: BagItemVo[]): void {
        this._data = data || [];
        if (!this.list) {
            this.list = this.child<Laya.GList>("ItemList");
            this._initList();
        }
        if (this.list) {
            this.list.numItems = this._data.length;
        }
    }
}
