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
exports.BagList = void 0;
const BaseView_1 = require("./BaseView");
const BagItem_1 = require("./BagItem");
const { regClass } = Laya;
/**
 * 背包列表（挂在 BagList 预制体根节点上）。
 * 内部引用一个 GList，用 itemRenderer + numItems 渲染。
 */
let BagList = (() => {
    let _classDecorators = [regClass()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseView_1.BaseView;
    var BagList = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this._data = [];
        }
        onAwake() {
            this._list = this.child("ItemList");
            this._initList();
        }
        /** GList 的渲染方式：itemRenderer 回调 + numItems 数量 */
        _initList() {
            if (!this._list)
                return;
            this._list.itemRenderer = (index, item) => this._onRenderItem(index, item);
        }
        _onRenderItem(index, item) {
            const data = this._data[index];
            const cell = item.getComponent(BagItem_1.BagItem);
            if (cell)
                cell.setData(data);
        }
        /** 对外接口：传入视图数据数组（由 BagPanel 调用） */
        setList(data) {
            this._data = data || [];
            if (!this._list) {
                this._list = this.child("ItemList");
                this._initList();
            }
            if (this._list) {
                this._list.numItems = this._data.length;
            }
        }
    };
    __setFunctionName(_classThis, "BagList");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BagList = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BagList = _classThis;
})();
exports.BagList = BagList;
