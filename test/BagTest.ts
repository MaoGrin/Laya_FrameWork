import { test, assertEq, assertTrue, assertNull, summary } from "./harness";
import { Config } from "../src/Bag/Model/Config";
import { BagTestData } from "../src/Bag/Test/BagTestData";
import { Container } from "../src/Bag/Model/Container";
import { ItemStack } from "../src/Bag/Model/ItemStack";
import { BagService, BagOp } from "../src/Bag/Model/BagService";
import { ContainerRegistry } from "../src/Bag/Model/ContainerRegistry";
import { IdGenerator } from "../src/Common/IdGenerator";

// ==================== 初始化 ====================
BagTestData.install();          // 注入测试配置（物品 + 容器）
const svc = BagService.instance;

/** 用测试配置造一个背包；capacity 可自定义以测溢出 */
function makeBag(uid = 1, capacity = 20): Container {
    const cfg = Config.getContainerCfg(1001)!;
    return new Container(uid, { ...cfg, baseCapacity: capacity, maxCapacity: capacity }, 1000);
}

// ==================== 用例 ====================

test("可堆叠物品自动合并", () => {
    const bag = makeBag(1);
    const r1 = svc.addItem(bag, new ItemStack(2, 30));   // 红药水 maxStack=99
    assertEq(r1.success, true, "30个应全部放入");
    assertEq(bag.getItemCount(2), 30);

    const r2 = svc.addItem(bag, new ItemStack(2, 80));
    assertEq(r2.success, true);
    assertEq(bag.getItemCount(2), 110);

    // 应为 99 + 11 两格
    const slots = bag.unlockedSlots.filter(s => s.stack && s.stack.itemId === 2);
    assertEq(slots.length, 2, "110 个应占两格");
    assertEq(slots[0].stack!.count, 99);
    assertEq(slots[1].stack!.count, 11);
});

test("不可堆叠物品每件一格且保留 uuid", () => {
    const bag = makeBag(2);
    const r = svc.addItem(bag, new ItemStack(1, 1, 777));   // 小刀(装备)
    assertEq(r.success, true);
    const s = bag.findItemSlot(1)!;
    assertEq(s.stack!.count, 1, "装备数量恒为1");
    assertEq(s.stack!.uuid, 777, "装备保留实例id");
});

test("容量不足时返回剩余数量", () => {
    const bag = makeBag(3, 1);   // 只有1格
    const r = svc.addItem(bag, new ItemStack(2, 150));
    assertEq(r.success, false);
    assertEq(r.added, 99, "最多放99个");
    assertEq(r.remain, 51, "剩51个放不下");
});

test("容器类型过滤：装备栏拒绝道具", () => {
    const cfg = Config.getContainerCfg(1002)!;   // 装备栏 allowItemKinds=[1]
    const equip = new Container(4, cfg, 1000);
    const r1 = svc.addItem(equip, new ItemStack(2, 1));   // 药水 kind=2 → 拒绝
    assertEq(r1.success, false);
    assertEq(r1.added, 0);
    const r2 = svc.addItem(equip, new ItemStack(1, 1, 888));   // 小刀 kind=1 → 允许
    assertEq(r2.success, true);
});

test("移除物品并删除空格", () => {
    const bag = makeBag(5);
    svc.addItem(bag, new ItemStack(2, 50));
    const removed = svc.removeItem(bag, 2, 20);
    assertEq(removed, 20);
    assertEq(bag.getItemCount(2), 30);
    const removed2 = svc.removeItem(bag, 2, 99);
    assertEq(removed2, 30, "只能移除实际存在的30个");
    assertEq(bag.getItemCount(2), 0);
    assertNull(bag.findItemSlot(2), "扣空的格子应被清空");
});

test("moveItem：目标为空则移动", () => {
    const bag = makeBag(6);
    svc.addItem(bag, new ItemStack(2, 5));
    const src = bag.findItemSlot(2)!;
    const dst = bag.unlockedSlots.find(s => s.isEmpty)!;
    const ok = svc.moveItem(bag, src.index, dst.index);
    assertTrue(ok);
    assertNull(bag.getSlot(src.index)!.stack, "源格应清空");
    assertEq(bag.getSlot(dst.index)!.stack!.itemId, 2);
});

test("moveItem：同物品合并", () => {
    const bag = makeBag(7);
    // 用 setSlot 直接造两个独立堆，绕过 addItem 的自动合并
    bag.setSlot(0, new ItemStack(2, 30));
    bag.setSlot(1, new ItemStack(2, 40));
    const ok = svc.moveItem(bag, 0, 1);
    assertTrue(ok);
    assertEq(bag.getItemCount(2), 70);
    assertNull(bag.getSlot(0)!.stack, "源格应清空");
    assertEq(bag.getSlot(1)!.stack!.count, 70);
});

test("moveItem：不同物品则交换", () => {
    const bag = makeBag(8);
    svc.addItem(bag, new ItemStack(2, 5));
    svc.addItem(bag, new ItemStack(3, 8));
    const a = bag.findItemSlot(2)!;
    const b = bag.findItemSlot(3)!;
    svc.moveItem(bag, a.index, b.index);
    assertEq(bag.getSlot(a.index)!.stack!.itemId, 3);
    assertEq(bag.getSlot(b.index)!.stack!.itemId, 2);
});

test("一键整理合并堆叠并排序", () => {
    const bag = makeBag(9);
    svc.addItem(bag, new ItemStack(3, 500));   // 矿石
    svc.addItem(bag, new ItemStack(2, 60));    // 药水
    svc.addItem(bag, new ItemStack(2, 60));    // 药水
    svc.sortItem(bag);

    assertEq(bag.getItemCount(2), 120);
    assertEq(bag.getItemCount(3), 500);
    // 药水120 → 99+21 两格；矿石500 → 一格；共3格
    const filled = bag.unlockedSlots.filter(s => s.stack);
    assertEq(filled.length, 3);
    // 药水(id2)应排在矿石(id3)前面
    assertEq(filled[0].stack!.itemId, 2);
    assertEq(filled[2].stack!.itemId, 3);
});

test("扩容解锁格子", () => {
    const cfg = Config.getContainerCfg(1001)!;   // base 20 / max 60
    const bag = new Container(10, cfg, 1000);
    assertEq(bag.capacity, 20);
    bag.expand(30);
    assertEq(bag.capacity, 30);
    assertEq(bag.emptyCount, 30, "扩容后空格应为30");
});

test("序列化往返", () => {
    const bag = makeBag(11);
    svc.addItem(bag, new ItemStack(2, 30));
    svc.addItem(bag, new ItemStack(1, 1, 999));

    const data = bag.serialize() as any;
    const bag2 = new Container(11, Config.getContainerCfg(1001)!, 1000);
    bag2.deserialize(data);

    assertEq(bag2.getItemCount(2), 30);
    assertEq(bag2.findItemSlot(1)!.stack!.uuid, 999, "装备uuid应被还原");
});

test("操作触发事件", () => {
    const bag = makeBag(12);
    let events = 0;
    const listener = (_c: Container, op: BagOp) => { if (op === BagOp.Add) events++; };
    svc.on(listener);
    svc.addItem(bag, new ItemStack(2, 10));
    svc.off(listener);
    assertEq(events, 1, "应派发一次 Add 事件");
});

test("版本号与脏标记", () => {
    const bag = makeBag(13);
    assertEq(bag.dirty, false);
    svc.addItem(bag, new ItemStack(2, 1));
    assertEq(bag.dirty, true, "变更后置脏");
    assertEq(bag.version, 1, "变更后版本+1");
    bag.markSaved();
    assertEq(bag.dirty, false, "保存后清脏");
});

test("容器注册与按归属查找", () => {
    const reg = ContainerRegistry.instance;
    const bag = new Container(14, Config.getContainerCfg(1001)!, 1000);
    reg.register(bag);
    assertTrue(reg.get(14) === bag, "按uid应能找到");
    assertTrue(reg.getByOwner(1000).length >= 1, "按ownerId应能找到");
});

test("IdGenerator 自增且不重复", () => {
    IdGenerator.instance.resetTo(1);
    const a = IdGenerator.instance.next();
    const b = IdGenerator.instance.next();
    const c = IdGenerator.instance.next();
    assertEq(a, 1);
    assertEq(b, 2);
    assertEq(c, 3);
    assertTrue(a !== b && b !== c, "id 不应重复");
});

test("IdGenerator resetTo 恢复", () => {
    IdGenerator.instance.resetTo(100);
    assertEq(IdGenerator.instance.next(), 100);
    assertEq(IdGenerator.instance.current, 101);
});

// ==================== 输出汇总 ====================
summary("背包系统测试");
