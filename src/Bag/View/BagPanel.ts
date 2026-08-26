import { IdGenerator } from "../../Common/IdGenerator";
import { BagService } from "../Model/BagService";
import { ContainerRegistry } from "../Model/ContainerRegistry";
import { ItemStack } from "../Model/ItemStack";
import { BagTestData } from "../Test/BagTestData";
import { BagItemVo } from "../vo/BagItemVo";
import { BagList } from "./BagList";
import { BaseView } from "./BaseView";

const { regClass, property } = Laya;

/**
 * 背包面板（挂在 BagPanel 预制体根节点上）。 
 */
@regClass()
export class BagPanel extends BaseView {
    @property(BagList)
    public bagList: BagList = null;
    @property(Laya.GButton)
    public btnRandom: Laya.GButton = null;

    public addClick(): void {
        this.btnRandom.onClick(this, this.onClickRandom);
    }

    private onClickRandom(): void {
        this.randomAddItem();
        this.refresh();
    }

    private randomAddItem(): void {
        const randomCfg = BagTestData.instance.getRandomItemCfg();
        if (!randomCfg) return;
        const container = ContainerRegistry.instance.get(1001);
        if (!container) return;
        // 可堆叠物品 uuid=0；不可堆叠物品用全局生成器分配唯一实例 id
        const uuid = randomCfg.stackable ? 0 : IdGenerator.instance.next();
        const itemStack = new ItemStack(randomCfg.id, 1, uuid, null);
        BagService.instance.addItem(container, itemStack);
    }

    /** 从 Model 层读背包数据 → 转成视图数据 → 交给 BagList 渲染 */
    public refresh(): void {
        const container = ContainerRegistry.instance.get(1001);
        const viewData: BagItemVo[] = [];
        if (container) {
            for (const slot of container.unlockedSlots) {
                if (!slot.stack) continue;
                const { uuid, count, itemId } = slot.stack;
                const itemVo = new BagItemVo(uuid, itemId, slot.index, count);
                viewData.push(itemVo);
            }
        }
        if (this.bagList) this.bagList.setList(viewData);
    }
}
