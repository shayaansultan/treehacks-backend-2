"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleTree = void 0;
var crypto_1 = require("crypto");
var MerkleTree = /** @class */ (function () {
    function MerkleTree() {
        this.root = null;
        this.leaves = [];
    }
    MerkleTree.prototype.hashData = function (data) {
        var stringData = "".concat(data.name, ":").concat(data.quantity);
        return crypto_1.default.createHash('sha256').update(stringData).digest('hex');
    };
    MerkleTree.prototype.hashPair = function (left, right) {
        var combined = left + right;
        return crypto_1.default.createHash('sha256').update(combined).digest('hex');
    };
    MerkleTree.prototype.buildTree = function (drugs) {
        var _this = this;
        // Create leaf nodes
        this.leaves = drugs.map(function (drug) { return ({
            hash: _this.hashData(drug)
        }); });
        // If no drugs, return empty hash
        if (this.leaves.length === 0) {
            this.root = { hash: this.hashPair('', '') };
            return this.root.hash;
        }
        // Build tree level by level
        var currentLevel = this.leaves;
        while (currentLevel.length > 1) {
            var nextLevel = [];
            for (var i = 0; i < currentLevel.length; i += 2) {
                var leftNode = currentLevel[i];
                var rightNode = i + 1 < currentLevel.length
                    ? currentLevel[i + 1]
                    : currentLevel[i]; // Duplicate last node if odd number
                var parentNode = {
                    hash: this.hashPair(leftNode.hash, rightNode.hash),
                    left: leftNode,
                    right: rightNode
                };
                nextLevel.push(parentNode);
            }
            currentLevel = nextLevel;
        }
        this.root = currentLevel[0];
        return this.root.hash;
    };
    MerkleTree.prototype.generateProof = function (drug) {
        var targetHash = this.hashData(drug);
        var proofs = [];
        // Find the leaf node
        var currentNode = this.leaves.find(function (leaf) { return leaf.hash === targetHash; });
        if (!currentNode) {
            return null;
        }
        // Traverse up the tree
        var current = currentNode;
        var parent = this.findParent(current);
        while (parent) {
            var isLeft = parent.left === current;
            proofs.push({
                position: isLeft ? 'right' : 'left',
                pairHash: isLeft ? parent.right.hash : parent.left.hash
            });
            current = parent;
            parent = this.findParent(current);
        }
        return {
            drug: drug,
            proofs: proofs,
            root: this.root.hash
        };
    };
    MerkleTree.prototype.findParent = function (node) {
        var findParentRecursive = function (current) {
            if (!current.left && !current.right)
                return null;
            if (current.left === node || current.right === node)
                return current;
            var leftResult = current.left ? findParentRecursive(current.left) : null;
            if (leftResult)
                return leftResult;
            return current.right ? findParentRecursive(current.right) : null;
        };
        return this.root ? findParentRecursive(this.root) : null;
    };
    MerkleTree.prototype.verifyProof = function (proof) {
        var currentHash = this.hashData(proof.drug);
        for (var _i = 0, _a = proof.proofs; _i < _a.length; _i++) {
            var p = _a[_i];
            currentHash = p.position === 'left'
                ? this.hashPair(p.pairHash, currentHash)
                : this.hashPair(currentHash, p.pairHash);
        }
        return currentHash === proof.root;
    };
    return MerkleTree;
}());
exports.MerkleTree = MerkleTree;
