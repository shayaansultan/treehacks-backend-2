"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalInventory = void 0;
var MerkleTree_1 = require("../MerkleTree/MerkleTree");
var mockData_1 = require("../../data/mockData");
var HospitalInventory = /** @class */ (function () {
    function HospitalInventory(hospital, eigenDA) {
        var _this = this;
        this.merkleTree = new MerkleTree_1.MerkleTree();
        this.inventory = new Map();
        this.hospital = hospital;
        this.eigenDA = eigenDA;
        // Load initial inventory if available
        var initialInventory = mockData_1.INITIAL_INVENTORY[hospital.id];
        if (initialInventory) {
            initialInventory.forEach(function (drug) {
                _this.inventory.set(drug.name, __assign(__assign({}, drug), { lastUpdated: Date.now() }));
            });
            // Build initial Merkle tree
            this.merkleTree.buildTree(Array.from(this.inventory.values()));
        }
    }
    HospitalInventory.prototype.updateInventory = function (updates) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, updates_1, update, currentItem, newQuantity, drugs, root;
            return __generator(this, function (_a) {
                // Apply updates to inventory
                for (_i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
                    update = updates_1[_i];
                    currentItem = this.inventory.get(update.drug.name);
                    switch (update.action) {
                        case 'add':
                            this.inventory.set(update.drug.name, __assign(__assign({}, update.drug), { quantity: ((currentItem === null || currentItem === void 0 ? void 0 : currentItem.quantity) || 0) + (update.quantity || 0), lastUpdated: Date.now() }));
                            break;
                        case 'remove':
                            if (currentItem) {
                                newQuantity = currentItem.quantity - (update.quantity || 0);
                                if (newQuantity > 0) {
                                    this.inventory.set(update.drug.name, __assign(__assign({}, currentItem), { quantity: newQuantity, lastUpdated: Date.now() }));
                                }
                                else {
                                    this.inventory.delete(update.drug.name);
                                }
                            }
                            break;
                        case 'set':
                            this.inventory.set(update.drug.name, __assign(__assign({}, update.drug), { lastUpdated: Date.now() }));
                            break;
                    }
                }
                drugs = Array.from(this.inventory.values());
                root = this.merkleTree.buildTree(drugs);
                // Store root in EigenDA
                // await this.eigenDA.post({
                //   type: 'hospital_inventory',
                //   hospitalId: this.hospital.id,
                //   root,
                //   timestamp: Date.now()
                // });
                return [2 /*return*/, root];
            });
        });
    };
    HospitalInventory.prototype.generateDrugProof = function (drugName) {
        return __awaiter(this, void 0, void 0, function () {
            var drug;
            return __generator(this, function (_a) {
                drug = this.inventory.get(drugName);
                if (!drug)
                    return [2 /*return*/, null];
                return [2 /*return*/, this.merkleTree.generateProof(drug)];
            });
        });
    };
    HospitalInventory.prototype.checkDrugAvailability = function (drugName, quantity) {
        return __awaiter(this, void 0, void 0, function () {
            var drug;
            return __generator(this, function (_a) {
                drug = this.inventory.get(drugName);
                return [2 /*return*/, drug ? drug.quantity >= quantity : false];
            });
        });
    };
    return HospitalInventory;
}());
exports.HospitalInventory = HospitalInventory;
