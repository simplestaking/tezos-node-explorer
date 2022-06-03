"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateWallet = void 0;
const operators_1 = require("rxjs/operators");
const operation_1 = require("../operation");
/**
  * Activate generated wallet address
  *
  * @operation activate_account
  * @returns Observable
  */
exports.activateWallet = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign(Object.assign({}, state), { activateWallet: selector(state) }))), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    operations.push({
        kind: "activate_account",
        pkh: state.wallet.publicKeyHash,
        secret: state.activateWallet.secret
    });
    return Object.assign(Object.assign({}, state), { operations: operations });
}), 
// create operation 
operation_1.operation());
//# sourceMappingURL=activateWallet.js.map