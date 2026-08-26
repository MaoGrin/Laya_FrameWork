import { BagItemVo } from "../vo/BagItemVo";
import { BaseView } from "./BaseView";

const { regClass } = Laya;

/**
 * 背包单元格（挂在 BagItem 预制体根节点上）。
 * 一个格子对应一个 ItemStack 的视图。
 */
@regClass()
export class BagItem extends BaseView {
    private _txtName: Laya.GTextField;
    private _vo: BagItemVo;

    onAwake(): void {
        this._txtName = this.child<Laya.GTextField>("txtName");
    }

    /** 由 BagList 的 itemRenderer 调用：填 UI，并保留 VO 供后续交互取用 */
    setData(vo: BagItemVo): void {
        this._vo = vo;
        if (!this._txtName) this._txtName = this.child<Laya.GTextField>("txtName");
        if (this._txtName && vo) {
            this._txtName.text = vo.displayName;
        }
    }

    /** 当前格子的视图模型（含 slotIndex/itemId/uuid，点击/拖拽时用它回源取数据） */
    get vo(): BagItemVo {
        return this._vo;
    }
}
