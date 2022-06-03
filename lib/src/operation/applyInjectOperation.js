"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAndInjectOperation = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const contract_1 = require("../contract");
const common_1 = require("../common");
/**
 * Validates and inject operation into tezos blockain
 * Can be applied to any prepared operation
 *
 * @throws InjectionError when operation validation fails on node
 */
exports.applyAndInjectOperation = () => (source) => source.pipe(
//get counter
contract_1.counter(), 
// preapply operation
preapplyOperations(), operators_1.tap(state => console.log("[+] operation: preapply ", state.preapply[0].contents[0].metadata.operation_result)), 
// check for errors
operators_1.flatMap(state => {
    const result = state.preapply[0].contents[0].metadata;
    // @@TODO: no such a field as operation_result
    return result.operation_result && result.operation_result.status === "failed" ?
        rxjs_1.throwError({
            state,
            response: result.operation_result.errors
        }) :
        rxjs_1.of(state);
}), 
// inject operation
injectOperations(), operators_1.tap((state) => console.log("[+] operation: " + state.wallet.node.tzstats.url + state.injectionOperation)));
/**
 * Prevalidates (preapply) operation on tezos node
 *
 * @url /chains/main/blocks/head/helpers/preapply/operations
 */
const preapplyOperations = () => (source) => source.pipe(common_1.rpc((state) => ({
    url: '/chains/main/blocks/head/helpers/preapply/operations',
    path: 'preapply',
    payload: [{
            protocol: state.head.metadata.next_protocol,
            branch: state.head.hash,
            contents: state.operations,
            signature: state.signOperation.signature,
        }],
})));
/**
 * Inbjects prevalidated operation to Tezos blockchain
 *
 * @url /injection/operation
 */
const injectOperations = () => (source) => source.pipe(common_1.rpc((state) => {
    return ({
        url: '/injection/operation',
        path: 'injectionOperation',
        payload: `"${state.signOperation.signedOperationContents}"`,
    });
}));
//# sourceMappingURL=applyInjectOperation.js.map