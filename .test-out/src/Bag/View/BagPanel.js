"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BagPanel = void 0;
const BaseView_1 = require("./BaseView");
const BagList_1 = require("./BagList");
const ContainerRegistry_1 = require("../Model/ContainerRegistry");
const Config_1 = require("../Model/Config");
const BagTestData_1 = require("../Test/BagTestData");
const BagService_1 = require("../Model/BagService");
const ItemStack_1 = require("../Model/ItemStack");
const IdGenerator_1 = require("../../Common/IdGenerator");
const { regClass } = Laya;
/**
 * 背包面板（挂在 BagPanel 预制体根节点上）。
 */
let BagPanel = (() => {
    let _classDecorators = [regClass()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseView_1.BaseView;
    var BagPanel = _classThis = class extends _classSuper {
        onAwake() {
            // 子脚本用 childScript 取；子节点用 child 取（样板已收进基类）
            this._bagList = this.childScript("BagList", BagList_1.BagList);
            this._btnRandom = this.child("btnRandom");
        }
        onEnable() {
            if (this._btnRandom)
                this._btnRandom.onClick(this, this.onClickRandom);
            this.refresh();
        }
        onDisable() {
            if (this._btnRandom)
                this._btnRandom.offClick(this, this.onClickRandom);
        }
        onClickRandom() {
            this.randomAddItem();
            this.refresh();
        }
        randomAddItem() {
            const randomCfg = BagTestData_1.BagTestData.instance.getRandomItemCfg();
            if (!randomCfg)
                return;
            const container = ContainerRegistry_1.ContainerRegistry.instance.get(1001);
            if (!container)
                return;
            // 可堆叠物品 uuid=0；不可堆叠物品用全局生成器分配唯一实例 id
            const uuid = randomCfg.stackable ? 0 : IdGenerator_1.IdGenerator.instance.next();
            const itemStack = new ItemStack_1.ItemStack(randomCfg.id, 1, uuid, null);
            BagService_1.BagService.instance.addItem(container, itemStack);
        }
        /** 从 Model 层读背包数据 → 转成视图数据 → 交给 BagList 渲染 */
        refresh() {
            const container = ContainerRegistry_1.ContainerRegistry.instance.get(1001);
            const viewData = [];
            if (container) {
                for (const slot of container.unlockedSlots) {
                    if (!slot.stack)
                        continue;
                    const cfg = Config_1.Config.getItemCfg(slot.stack.itemId);
                    viewData.push({
                        name: cfg ? cfg.name : "id=" + slot.stack.itemId,
                        icon: cfg ? cfg.icon : "",
                        count: slot.stack.count,
                    });
                }
            }
            if (this._bagList)
                this._bagList.setList(viewData);
        }
    };
    __setFunctionName(_classThis, "BagPanel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BagPanel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BagPanel = _classThis;
})();
exports.BagPanel = BagPanel;
